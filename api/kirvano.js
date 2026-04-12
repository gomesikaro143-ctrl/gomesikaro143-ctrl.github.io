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
            <p style="font-size: 16px; color: #94a3b8; line-height: 1.6; margin-bottom: 30px;">
              Olá, <strong>${payload.customer?.name || 'Vitoriosa'}</strong>!<br><br>
              Seu acesso ao <strong>${config.nome}</strong> está pronto. Toque no botão gigante abaixo para entrar:
            </p>
            
            <div style="text-align: center;">
              <a href="${config.link}" target="_blank" style="background-color:${config.cor}; border: 1px solid ${config.cor}; border-radius: 12px; color: #ffffff; display: inline-block; font-family: sans-serif; font-size: 18px; font-weight: bold; line-height: 60px; text-align: center; text-decoration: none; width: 300px; -webkit-text-size-adjust: none; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
                ENTRAR NO APLICATIVO
              </a>
            </div>

            <p style="font-size: 12px; color: #475569; margin-top: 40px;">Protocolo Gelatina © 2026.</p>
          </div>
        `
      });
      sentCount++;
    }
  }
  return sentCount;
}

/**
 * FUNÇÃO: Agendar Recuperação (Abandono ou Pix Gerado) - LIMPA PARA EVITAR SPAM
 */
async function handleRecovery(payload, reason) {
  const email = payload.customer?.email;
  const name = payload.customer?.name || 'Vitoriosa';
  
  console.log(`[AGENDADO] Recuperação de ${reason} para ${email} em 15min.`);

  await resend.emails.send({
    from: 'Protocolo Gelatina <suporte@metodogelatina.com.br>',
    to: [email],
    subject: `[Detalhes] Sua inscrição no Protocolo Gelatina`,
    scheduledAt: 'in 15 minutes',
    html: `
      <div style="background-color: #05060a; color: #f8fafc; font-family: sans-serif; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
        <h1 style="color: #f8fafc; font-size: 24px;">Oi, ${name}!</h1>
        <p style="font-size: 16px; color: #94a3b8; line-height: 1.6; margin: 25px 0;">
          Vimos que você iniciou sua inscrição no <strong>Protocolo Gelatina</strong>, mas ainda não concluiu e seu lugar continua reservado.<br><br>
          Caso tenha ocorrido algum problema com o seu pagamento, você pode tentar novamente clicando no botão abaixo:
        </p>

        <div style="text-align: center;">
          <a href="${CHECKOUT_RECOVERY_URL}" target="_blank" style="background-color:#f59e0b; border: 1px solid #f59e0b; border-radius: 12px; color: #ffffff; display: inline-block; font-family: sans-serif; font-size: 18px; font-weight: bold; line-height: 60px; text-align: center; text-decoration: none; width: 300px; -webkit-text-size-adjust: none; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
            ACESSAR MINHA INSCRIÇÃO
          </a>
        </div>

        <p style="font-size: 12px; color: #64748b; margin-top: 35px;">* Se você já realizou o pagamento, seu e-mail de acesso deve chegar em alguns minutos.</p>
        <p style="font-size: 11px; color: #475569; margin-top: 15px;">Protocolo Gelatina © 2026.</p>
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
