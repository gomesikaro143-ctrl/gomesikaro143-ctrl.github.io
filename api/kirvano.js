const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. CONFIGURAÇÕES DOS PRODUTOS
const PRODUCT_CONFIG = {
  mounjaro: {
    nome: 'Protocolo Gelatina - App Mounjaro',
    link: 'https://protocolo-gelatina-app.vercel.app/app.html#home',
    assunto: '🎉 Seu acesso chegou! Toque aqui para abrir o Aplicativo Mounjaro',
    cor: '#10b981',
    icone: '✅'
  },
  d21: {
    nome: 'Plano 21D - Desafio Completo',
    link: 'https://app-desafio-21d.vercel.app/',
    assunto: '⚡ Desafio 21D: Seu acesso à plataforma foi liberado!',
    cor: '#f59e0b',
    icone: '🔥'
  }
};

// 2. CONFIGURAÇÃO DE RECUPERAÇÃO (UTMIFY)
const CHECKOUT_RECOVERY_URL = "https://pay.kirvano.com/19684841-a5a6-4071-adc8-60c0d375ac8b?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}";

/**
 * FUNÇÃO: Processar Venda Aprovada (Entrega de Acesso + Cancelar Recuperações Pendentes)
 */
async function handleApprovedSale(payload) {
  const email = payload.customer?.email;
  const products = payload.products || [];
  let sentCount = 0;

  // Tentar cancelar qualquer e-mail de recuperação agendado para este cliente
  try {
    const list = await resend.emails.list({ limit: 50 });
    const pending = (list.data || []).filter(e => 
      e.to.includes(email) && e.scheduled_at !== null
    );
    for (const emailRecord of pending) {
      await resend.emails.cancel(emailRecord.id);
      console.log(`[CANCELADO] Recuperação cancelada para ${email} pois ele comprou!`);
    }
  } catch (e) {
    console.error('Erro ao cancelar recuperações:', e.message);
  }

  // Entregar os acessos
  for (const prod of products) {
    const lowerName = (prod.name || '').toLowerCase();
    const prodId = (prod.id || '').toLowerCase();
    let config = null;

    if (lowerName.includes('21d') || prodId.includes('bfb96a0e')) {
      config = PRODUCT_CONFIG.d21;
    } else if (lowerName.includes('mounjaro') || lowerName.includes('gelatina') || products.length === 1) {
      config = PRODUCT_CONFIG.mounjaro;
    }

    if (config) {
      await resend.emails.send({
        from: 'Protocolo Gelatina <suporte@metodogelatina.com.br>',
        to: [email],
        subject: config.assunto,
        html: `
          <div style="background-color: #05060a; color: #f8fafc; font-family: 'Segoe UI', serif; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
            <h1 style="color: ${config.cor}; font-size: 28px; margin-bottom: 20px;">BOAS-VINDAS!</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">Olá! O seu acesso ao <strong>${config.nome}</strong> ${config.icone} foi liberado.</p>
            <div style="margin: 40px 0;"><a href="${config.link}" style="background-color: ${config.cor}; color: white; padding: 20px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; display: inline-block;">CLIQUE AQUI PARA ACESSAR</a></div>
            <p style="font-size: 12px; color: #64748b;">Protocolo Gelatina VIP © 2026.</p>
          </div>
        `
      });
      sentCount++;
    }
  }
  return sentCount;
}

/**
 * FUNÇÃO: Agendar Recuperação (Abandono ou Pix Gerado)
 */
async function handleRecovery(payload, reason) {
  const email = payload.customer?.email;
  const name = payload.customer?.name || 'Vitoriosa';
  
  console.log(`[AGENDADO] Recuperação de ${reason} para ${email} em 15 minutos.`);

  await resend.emails.send({
    from: 'Protocolo Gelatina <suporte@metodogelatina.com.br>',
    to: [email],
    subject: '🚨 IMPORTANTE: Sua vaga no Protocolo Gelatina expira em breve',
    scheduledAt: 'in 15 minutes',
    html: `
      <div style="background-color: #05060a; color: #f8fafc; font-family: 'Segoe UI', serif; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
        <h1 style="color: #f59e0b; font-size: 28px; margin-bottom: 20px;">FICOU COM ALGUMA DÚVIDA?</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">
          Olá, <strong>${name}</strong>!<br><br>
          Vimos que você tentou garantir seu acesso ao <strong>Protocolo Gelatina</strong>, mas a inscrição ainda não foi concluída.<br><br>
          As vagas são limitadas e o sistema reserva o seu lugar por apenas alguns minutos. Não deixe sua saúde para depois!
        </p>
        <div style="margin: 40px 0;">
          <a href="${CHECKOUT_RECOVERY_URL}" style="background-color: #f59e0b; color: white; padding: 20px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);">
            CONCLUIR MINHA INSCRIÇÃO AGORA
          </a>
        </div>
        <p style="font-size: 13px; color: #94a3b8;">* Se você já realizou o pagamento via Pix ou Cartão, desconsidere este aviso. Seu e-mail de acesso chegará em instantes.</p>
        <p style="font-size: 12px; color: #64748b; margin-top: 40px;">Protocolo Gelatina VIP © 2026.</p>
      </div>
    `
  });
}

/**
 * HANDLER PRINCIPAL (WEBHOOK)
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const payload = req.body;
    const event = payload.event || payload.status;
    const kirvanoToken = req.headers['x-kirvano-token'] || req.headers['X-Kirvano-Token'];
    const expectedToken = (process.env.KIRVANO_WEBHOOK_TOKEN || '').trim();

    // Segurança (Permissiva para Debug)
    if (expectedToken && (kirvanoToken || '').trim() !== expectedToken) {
      console.log(`[DEBUG] Token mismatch. Recebido: "${kirvanoToken}", Esperado: "${expectedToken}"`);
    }

    console.log(`--- WEBHOOK RECEBIDO: ${event} ---`);

    // 1. CASO: Venda Aprovada (Entrega + Cancelar Lembrete)
    if (event === 'APPROVED' || event === 'PAYMENT_CONFIRMED' || event === 'SALE_APPROVED') {
      const count = await handleApprovedSale(payload);
      return res.status(200).json({ success: true, action: 'delivery', count });
    }

    // 2. CASO: Recuperação (Pix Gerado ou Carrinho Abandonado)
    if (event === 'PIX_GENERATED' || event === 'CART_ABANDONED' || event === 'ORDER_CREATED') {
      await handleRecovery(payload, event);
      return res.status(200).json({ success: true, action: 'recovery_scheduled' });
    }

    return res.status(200).json({ message: 'Evento ignorado' });

  } catch (err) {
    console.error('ERRO NO WEBHOOK:', err.message);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
