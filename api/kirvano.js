const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. CONFIGURAÇÕES DOS PRODUTOS (ENTREGA)
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

  // Cancelar e-mails de recuperação agendados para este cliente
  try {
    const list = await resend.emails.list({ limit: 50 });
    const pending = (list.data || []).filter(e => 
      e.to.includes(email) && e.scheduled_at !== null
    );
    for (const emailRecord of pending) {
      await resend.emails.cancel(emailRecord.id);
      console.log(`[CANCELADO] Recuperação cancelada para ${email} (Compra realizada).`);
    }
  } catch (e) {
    console.error('Erro ao cancelar recuperações:', e.message);
  }

  // Entregar acessos
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
          <div style="background-color: #05060a; color: #f8fafc; font-family: sans-serif; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
            <img src="https://protocolo-gelatina-app.vercel.app/assets/novacapa_do_funil.png" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: ${config.cor}; font-size: 28px; margin-bottom: 15px;">ACESSO LIBERADO!</h1>
            <p style="font-size: 16px; color: #94a3b8; line-height: 1.6;">
              Olá, <strong>${payload.customer?.name || 'Vitoriosa'}</strong>!<br><br>
              Seu acesso ao <strong>${config.nome}</strong> está disponível. Toque no botão abaixo e comece agora!
            </p>
            <div style="margin: 30px 0;">
              <a href="${config.link}" style="background-color: ${config.cor}; color: white; padding: 18px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">ENTRAR NO APLICATIVO</a>
            </div>
            <p style="font-size: 12px; color: #475569;">Protocolo Gelatina © 2026.</p>
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
  
  console.log(`[AGENDADO] Recuperação de ${reason} para ${email} em 15min.`);

  await resend.emails.send({
    from: 'Protocolo Gelatina <suporte@metodogelatina.com.br>',
    to: [email],
    subject: '⚠️ Sua vaga no Protocolo Gelatina oficial expira em breve',
    scheduledAt: 'in 15 minutes',
    html: `
      <div style="background-color: #05060a; color: #f8fafc; font-family: sans-serif; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
        <h1 style="color: #f59e0b; font-size: 24px;">FICOU COM ALGUMA DÚVIDA?</h1>
        <p style="font-size: 16px; color: #94a3b8; line-height: 1.6; margin: 25px 0;">
          Oi, <strong>${name}</strong>!<br><br>
          Notamos que você iniciou sua inscrição no <strong>Protocolo Gelatina</strong>, mas ainda não concluiu.<br><br>
          Este protocolo está ajudando milhares de mulheres a ativar o metabolismo naturalmente. Não deixe sua vaga para outra pessoa!
        </p>
        <div style="margin: 35px 0;">
          <a href="${CHECKOUT_RECOVERY_URL}" style="background-color: #f59e0b; color: white; padding: 18px 35px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3);">CONCLUIR MINHA INSCRIÇÃO</a>
        </div>
        <p style="font-size: 11px; color: #64748b;">*Se já pagou via Pix, aguarde alguns minutos pelo seu acesso.</p>
      </div>
    `
  });
}

/**
 * HANDLER PRINCIPAL
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const payload = req.body;
    const event = payload.event || payload.status;
    const kirvanoToken = req.headers['x-kirvano-token'] || req.headers['X-Kirvano-Token'];
    const expectedToken = (process.env.KIRVANO_WEBHOOK_TOKEN || '').trim();

    // Log Permissivo para Debug
    if (expectedToken && (kirvanoToken || '').trim() !== expectedToken) {
      console.log(`[DEBUG] Token mismatch: "${kirvanoToken}"`);
    }

    console.log(`EVENTO: ${event} | ID: ${payload.sale_id}`);

    if (event === 'APPROVED' || event === 'PAYMENT_CONFIRMED' || event === 'SALE_APPROVED') {
      const count = await handleApprovedSale(payload);
      return res.status(200).json({ success: true, action: 'delivery', count });
    }

    if (event === 'PIX_GENERATED' || event === 'CART_ABANDONED' || event === 'ORDER_CREATED') {
      await handleRecovery(payload, event);
      return res.status(200).json({ success: true, action: 'recovery_scheduled' });
    }

    return res.status(200).json({ message: 'OK' });
  } catch (err) {
    console.error('ERRO:', err.message);
    return res.status(500).json({ error: 'Internal Error' });
  }
};
