const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Configuração dos links e modelos de e-mail por produto
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const payload = req.body;
    
    console.log('--- NOVO WEBHOOK KIRVANO ---');
    console.log('ID da Venda:', payload.sale_id);
    console.log('Email:', payload.customer?.email);

    // 1. Validação de Segurança (Token)
    const kirvanoToken = req.headers['x-kirvano-token'] || req.headers['X-Kirvano-Token'];
    const expectedToken = (process.env.KIRVANO_WEBHOOK_TOKEN || '').trim();

    if (expectedToken && (kirvanoToken || '').trim() !== expectedToken) {
      console.error(`ALERTA: Token inválido. Recebido: "${kirvanoToken}", Esperado: "${expectedToken}"`);
      return res.status(401).json({ error: 'Não autorizado' });
    }

    // 2. Validar Status (Filtro de Venda Aprovada)
    const isApproved = payload.status === 'APPROVED' || payload.event === 'PAYMENT_CONFIRMED' || payload.event === 'SALE_APPROVED';
    
    if (!isApproved) {
      console.log(`Evento ignorado (Status: ${payload.status || payload.event})`);
      return res.status(200).json({ message: 'Evento ignorado (não aprovado)' });
    }

    // 3. Processar cada produto da venda
    const products = payload.products || [];
    let emailsSent = 0;

    for (const prod of products) {
      let config = null;
      const lowerName = (prod.name || '').toLowerCase();
      const prodId = (prod.id || '').toLowerCase();

      // Identificar qual produto é
      if (lowerName.includes('mounjaro') || lowerName.includes('gelatina')) {
        config = PRODUCT_CONFIG.mounjaro;
      } else if (lowerName.includes('21d') || prodId.includes('bfb96a0e')) {
        config = PRODUCT_CONFIG.d21;
      }

      if (config) {
        console.log(`Enviando acesso para: ${config.nome}`);
        
        await resend.emails.send({
          from: 'Protocolo Gelatina <suporte@metodogelatina.com.br>',
          to: [payload.customer.email],
          subject: config.assunto,
          html: `
            <div style="background-color: #05060a; color: #f8fafc; font-family: 'Segoe UI', serif; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
              <h1 style="color: ${config.cor}; font-size: 28px; margin-bottom: 20px;">ACESSO LIBERADO!</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">
                Olá, <strong>${payload.customer.name || 'Vitoriosa'}</strong>!<br><br>
                O seu acesso ao <strong>${config.nome}</strong> ${config.icone} já está disponível. Toque no botão abaixo para começar agora mesmo!
              </p>
              
              <div style="margin: 40px 0;">
                <a href="${config.link}" style="background-color: ${config.cor}; color: white; padding: 20px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
                  CLIQUE AQUI PARA ACESSAR
                </a>
              </div>

              <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; text-align: left; margin-bottom: 30px;">
                <p style="font-size: 13px; color: #94a3b8; margin: 0;"><strong>Dica:</strong> Salve este link nos seus favoritos ou adicione o aplicativo à tela inicial do seu celular para acesso rápido.</p>
              </div>

              <p style="font-size: 12px; color: #64748b; margin-top: 40px;">
                Protocolo Gelatina VIP © 2026. Suporte: suporte@metodogelatina.com.br
              </p>
            </div>
          `
        });
        emailsSent++;
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Entrega processada. E-mails enviados: ${emailsSent}`,
      sale_id: payload.sale_id
    });

  } catch (err) {
    console.error('ERRO CRÍTICO NO WEBHOOK:', err.message);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
