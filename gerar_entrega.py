from fpdf import FPDF

class EntregaPDF(FPDF):
    def header(self):
        pass
    def footer(self):
        pass

# Configurações do PDF
pdf = EntregaPDF(orientation='P', unit='mm', format='A4')
pdf.add_page()

# 1. Fundo Escuro (Premium)
pdf.set_fill_color(12, 10, 21) # #0c0a15 (Mesmo do Splash do App)
pdf.rect(0, 0, 210, 297, 'F')

# 2. Logo / Título
pdf.set_font("helvetica", "B", 40)
pdf.set_text_color(250, 204, 21) # #facc15 (Amarelo Protocolo)
pdf.cell(0, 60, "Protocolo", ln=True, align='C')

pdf.set_font("helvetica", "B", 20)
pdf.set_text_color(161, 161, 170) # #a1a1aa
pdf.cell(0, -20, "GELATINA MOUNJARO", ln=True, align='C')

# 3. Mensagem de Boas-vindas
pdf.ln(60)
pdf.set_font("helvetica", "", 16)
pdf.set_text_color(255, 255, 255)
pdf.multi_cell(0, 10, "Parabéns, Guerreira! Seu acesso foi liberado com sucesso.\nClique no botão abaixo para entrar na sua área de membros exclusiva.", align='C')

# 4. Botão Central (Grande e Verde)
pdf.ln(30)
btn_w = 160
btn_h = 25
btn_x = (210 - btn_w) / 2
btn_y = pdf.get_y()

# Sombra do botão
pdf.set_fill_color(26, 81, 42) # Tom mais escuro para simular sombra
pdf.rect(btn_x + 2, btn_y + 2, btn_w, btn_h, 'F')

# Corpo do botão
pdf.set_fill_color(34, 197, 94) # #22c55e (Verde vibrante)
pdf.rect(btn_x, btn_y, btn_w, btn_h, 'F')

# Texto do Botão
pdf.set_y(btn_y + 7.5)
pdf.set_font("helvetica", "B", 14)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 10, "CLIQUE AQUI PARA ACESSAR O APLICATIVO", ln=True, align='C')

# Link no Botão
landing_url = "https://protocolo-gelatina-app.vercel.app/app.html"
pdf.link(btn_x, btn_y, btn_w, btn_h, landing_url)

# 5. Rodapé
pdf.set_y(260)
pdf.set_font("helvetica", "I", 10)
pdf.set_text_color(113, 113, 122)
pdf.cell(0, 10, "Este é seu acesso vitalício. Guarde este arquivo em um lugar seguro.", ln=True, align='C')

# Salvar
output_name = "Acesso_Protocolo_Gelatina.pdf"
pdf.output(output_name)
print(f"Sucesso! PDF gerado: {output_name}")
