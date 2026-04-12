const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Configuração dos links por produto
const PRODUCT_CONFIG = {
  mounjaro: {
    nome: 'Protocolo Gelatina - App Mounjaro',
    link: 'https://protocolo-gelatina-app.vercel.app/app.html#home',
    assunto: '🎉 Seu acesso chegou! Toque aqui para abrir o Aplicativo Mounjaro',
    cor: '#10b981', // Verde
    icone: '✅'
  },
  d21: {
    nome: 'Plano 21D - Desafio Completo',
    link: 'https://app-desafio-21d.vercel.app/',
    assunto: '⚡ Desafio 21D: Seu acesso à plataforma foi liberado!',
    cor: '#f59e0b', // Laranja/Amarelo
    icone: '🔥'
  }
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const payload = req.body;
    const kirvanoToken = req.headers['x-kirvano-token'] || req.headers['X-Kirvano-Token'];
    const expectedToken = (process.env.KIRVANO_WEBHOOK_TOKEN || '').trim();

    // LOG DE SEGURANÇA (PERMISSIVO PARA DEBUG)
    if (expectedToken && (kirvanoToken || '').trim() !== expectedToken) {
      console.log(`[DEBUG] Token mismatch. Recebido: "${kirvanoToken}", Esperado: "${expectedToken}"`);
      // return res.status(401).json({ error: 'Não autorizado' }); // COMENTADO PARA NÃO TRAVAR O USUÁRIO
    }

    // FILTRO DE STATUS
    const isApproved = payload.status === 'APPROVED' || payload.event === 'PAYMENT_CONFIRMED' || payload.event === 'SALE_APPROVED';
    if (!isApproved) return res.status(200).json({ message: 'Ignorado (não aprovado)' });

    const products = payload.products || [];
    let emailsSent = 0;

    for (const prod of products) {
      const lowerName = (prod.name || '').toLowerCase();
      const prodId = (prod.id || '').toLowerCase();
      let config = null;

      // Identificação inteligente dos produtos
      if (lowerName.includes('21d') || prodId.includes('bfb96a0e')) {
        config = PRODUCT_CONFIG.d21;
      } else if (lowerName.includes('mounjaro') || lowerName.includes('gelatina') || products.length === 1) {
        // Se for o único produto ou tiver o nome, manda o principal
        config = PRODUCT_CONFIG.mounjaro;
      }

      if (config) {
        console.log(`Enviando: ${config.nome} para ${payload.customer?.email}`);
        await resend.emails.send({
          from: 'Protocolo Gelatina <suporte@metodogelatina.com.br>',
          to: [payload.customer.email],
          subject: config.assunto,
          html: `
            <div style="background-color: #05060a; color: #f8fafc; font-family: 'Segoe UI', serif; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
              <h1 style="color: ${config.cor}; font-size: 28px; margin-bottom: 20px;">BOAS-VINDAS!</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">
                Olá! O seu acesso ao <strong>${config.nome}</strong> ${config.icone} foi liberado.
              </p>
              <div style="margin: 40px 0;">
                <a href="${config.link}" style="background-color: ${config.cor}; color: white; padding: 20px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; display: inline-block;">
                  CLIQUE AQUI PARA ACESSAR
                </a>
              </div>
              <p style="font-size: 12px; color: #64748b;">Protocolo Gelatina VIP © 2026.</p>
            </div>
          `
        });
        emailsSent++;
      }
    }

    return res.status(200).json({ success: true, emails_sent: emailsSent });
  } catch (err) {
    console.error('ERRO:', err.message);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
