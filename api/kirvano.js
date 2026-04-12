const { Resend } = require('resend');

// Inicializa o Resend com a chave de API
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Apenas aceita requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const payload = req.body;
    
    // Log detalhado para depuração no painel da Vercel
    console.log('--- NOVO WEBHOOK KIRVANO ---');
    console.log('Headers recebidos:', JSON.stringify(req.headers));
    console.log('Corpo da requisição:', JSON.stringify(payload));
    
    // 0. Validação de Segurança (Token)
    const kirvanoToken = req.headers['x-kirvano-token'] || req.headers['X-Kirvano-Token']; 
    const expectedToken = (process.env.KIRVANO_WEBHOOK_TOKEN || '').trim();

    if (expectedToken && (kirvanoToken || '').trim() !== expectedToken) {
      console.error(`ALERTA: Token inválido. Recebido: "${kirvanoToken}", Esperado: "${expectedToken}"`);
      // Temporariamente retornando 200 para não travar a Kirvano, mas logando o erro
      // return res.status(401).json({ error: 'Não autorizado' }); 
    }

    // Log detalhado para depuração no painel da Vercel
    console.log('--- NOVO WEBHOOK KIRVANO ---');
    console.log('ID da Venda:', payload.sale_id);
    console.log('Evento:', payload.event);
    console.log('Status:', payload.status);

    // 1. Validar Status (Filtro de Venda Aprovada)
    const isApproved = payload.status === 'APPROVED' || payload.event === 'PAYMENT_CONFIRMED' || payload.event === 'SALE_APPROVED';
    
    if (!isApproved) {
      console.log(`Evento ignorado: ${payload.event || payload.status}`);
      return res.status(200).json({ message: 'Evento recebido, mas ignorado por não ser aprovação.' });
    }

    // 2. Validar Produto (DESATIVADO TEMPORARIAMENTE PARA DEBUG)
    /*
    const mainProductId = process.env.MAIN_PRODUCT_ID;
    const products = payload.products || [];
    const containsMainProduct = products.some(p => p.id === mainProductId || (p.name && p.name.toLowerCase().includes('mounjaro')));

    if (!containsMainProduct) {
      console.log('Venda de outro produto detectada. E-mail de automação não enviado.');
      return res.status(200).json({ message: 'Produto diferente do configurado.' });
    }
    */
    console.log('Filtro de produto ignorado por estar em modo debug.');

    // 3. Extrair dados da cliente
    const customerEmail = payload.customer?.email;
    const customerName = payload.customer?.name || 'Vitoriosa';

    if (!customerEmail) {
      console.error('Erro: E-mail da cliente não encontrado no payload.');
      return res.status(400).json({ error: 'E-mail da cliente ausente.' });
    }

    // 4. Configurar Link de Acesso
    const appLink = process.env.APP_ACCESS_URL || 'https://protocolo-gelatina-app.vercel.app/app.html#home';
    
    // 5. Enviar E-mail via Resend
    // NOTA: Se você ainda não verificou um domínio no Resend, use 'onboarding@resend.dev'
    const fromEmail = 'Protocolo Gelatina <suporte@metodogelatina.com.br>'; 

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [customerEmail],
      subject: `🎉 Seu acesso chegou! Toque aqui para abrir o Aplicativo Mounjaro`,
      html: `
        <div style="background-color: #05060a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
          <h1 style="color: #10b981; font-size: 28px; margin-bottom: 20px;">SEJA BEM-VINDA!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">
            Olá, <strong>${customerName}</strong>!<br><br>
            Sua jornada para transformar seu corpo começou agora. Seu acesso exclusivo ao <strong>Protocolo Gelatina - Aplicativo Mounjaro</strong> já está liberado.
          </p>
          
          <div style="margin: 40px 0;">
            <a href="${appLink}" style="background-color: #10b981; color: white; padding: 20px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.4);">
              CLIQUE AQUI PARA ACESSAR O APP
            </a>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; text-align: left; margin-bottom: 30px;">
            <p style="font-size: 14px; color: #f8fafc; margin-bottom: 10px;">📌 <strong>Dica de Ouro:</strong></p>
            <p style="font-size: 13px; color: #94a3b8; margin: 0;">Salve este link nos seus favoritos ou adicione o aplicativo à tela inicial do seu celular para não perder o foco!</p>
          </div>

          <p style="font-size: 12px; color: #64748b; margin-top: 40px;">
            Este é um e-mail automático enviado pelo Protocolo Gelatina VIP © 2026.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Erro no Resend:', error);
      return res.status(500).json({ error: 'Falha ao processar entrega do e-mail.' });
    }

    console.log('SUCESSO: E-mail de acesso enviado para:', customerEmail);
    return res.status(200).json({ 
      success: true, 
      message: 'Entrega realizada com sucesso!',
      sale_id: payload.sale_id
    });

  } catch (err) {
    console.error('ERRO CRÍTICO:', err.message);
    return res.status(500).json({ error: 'Erro interno no processamento do webhook.' });
  }
};
