const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const payload = req.body;
    
    console.log('--- RESTAURANDO ENTREGA PRINCIPAL ---');
    console.log('ID da Venda:', payload.sale_id);

    // 1. Validação de Segurança (Token)
    const kirvanoToken = req.headers['x-kirvano-token'] || req.headers['X-Kirvano-Token'];
    const expectedToken = (process.env.KIRVANO_WEBHOOK_TOKEN || '').trim();

    if (expectedToken && (kirvanoToken || '').trim() !== expectedToken) {
      console.error('ALERTA: Token inválido.');
      return res.status(401).json({ error: 'Não autorizado' });
    }

    // 2. Validar Status (Apenas Vendas Aprovadas)
    const isApproved = payload.status === 'APPROVED' || payload.event === 'PAYMENT_CONFIRMED' || payload.event === 'SALE_APPROVED';
    
    if (!isApproved) {
      console.log(`Evento ignorado: ${payload.status || payload.event}`);
      return res.status(200).json({ message: 'Ignorado' });
    }

    // 3. ENVIAR ACESSO (Obrigatório para o Produto Principal)
    console.log(`Enviando acesso principal para: ${payload.customer?.email}`);
    
    const { data, error } = await resend.emails.send({
      from: 'Protocolo Gelatina <suporte@metodogelatina.com.br>',
      to: [payload.customer.email],
      subject: '🎉 Seu acesso chegou! Toque aqui para abrir o Aplicativo Mounjaro',
      html: `
        <div style="background-color: #05060a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
          <h1 style="color: #10b981; font-size: 28px; margin-bottom: 20px;">SEJA BEM-VINDA!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">
            Olá, <strong>${payload.customer?.name || 'Vitoriosa'}</strong>!<br><br>
            Sua jornada para transformar seu corpo começou agora. Seu acesso exclusivo ao <strong>Protocolo Gelatina - Aplicativo Mounjaro</strong> já está liberado.
          </p>
          
          <div style="margin: 40px 0;">
            <a href="https://protocolo-gelatina-app.vercel.app/app.html#home" style="background-color: #10b981; color: white; padding: 20px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.4);">
              CLIQUE AQUI PARA ACESSAR O APP
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; margin-top: 40px;">
            Este é um e-mail automático enviado pelo Protocolo Gelatina VIP © 2026.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Erro no Resend:', error);
      return res.status(500).json({ error: 'Erro no envio' });
    }

    return res.status(200).json({ success: true, message: 'Entrega principal realizada!' });

  } catch (err) {
    console.error('ERRO CRÍTICO:', err.message);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
