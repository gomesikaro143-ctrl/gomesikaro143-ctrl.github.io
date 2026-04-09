from fpdf import FPDF

class EntregaPDF(FPDF):
    def header(self):
        pass
    def footer(self):
        pass

# Configurações do PDF (Focado em Mobile: 100mm x 180mm)
pdf = EntregaPDF(orientation='P', unit='mm', format=(100, 180))
pdf.add_page()

# 1. Fundo Escuro (Premium)
pdf.set_fill_color(12, 10, 21) # #0c0a15
pdf.rect(0, 0, 100, 180, 'F')

# 2. Logo / Título
pdf.set_font("helvetica", "B", 30)
pdf.set_text_color(250, 204, 21) # #facc15
pdf.cell(0, 40, "Protocolo", ln=True, align='C')

pdf.set_font("helvetica", "B", 14)
pdf.set_text_color(161, 161, 170) # #a1a1aa
pdf.cell(0, -15, "GELATINA MOUNJARO", ln=True, align='C')

# 3. Mensagem de Boas-vindas (SUBIDO)
pdf.ln(40)
pdf.set_font("helvetica", "", 12)
pdf.set_text_color(255, 255, 255)
pdf.multi_cell(0, 7, "Parabéns! Seu acesso foi liberado com sucesso.\nClique no botão abaixo para entrar na sua área de membros exclusiva.", align='C')

# 4. Botão Central (Gigante para Mobile)
pdf.ln(15)
btn_w = 80
btn_h = 22
btn_x = (100 - btn_w) / 2
btn_y = pdf.get_y()

# Sombra do botão
pdf.set_fill_color(26, 81, 42)
pdf.rect(btn_x + 1.5, btn_y + 1.5, btn_w, btn_h, 'F')

# Corpo do botão
pdf.set_fill_color(34, 197, 94) # #22c55e
pdf.rect(btn_x, btn_y, btn_w, btn_h, 'F')

# Texto do Botão
pdf.set_y(btn_y + 6)
pdf.set_font("helvetica", "B", 10)
pdf.set_text_color(255, 255, 255)
pdf.multi_cell(btn_w, 5, "CLIQUE AQUI PARA\nACESSAR O APLICATIVO", align='C')

# Link no Botão
landing_url = "https://protocolo-gelatina-app.vercel.app/app.html"
pdf.link(btn_x, btn_y, btn_w, btn_h, landing_url)

# 5. Rodapé
pdf.set_y(160)
pdf.set_font("helvetica", "I", 8)
pdf.set_text_color(113, 113, 122)
pdf.cell(0, 10, "Este é seu acesso vitalício. Guarde este arquivo.", ln=True, align='C')

# Salvar
output_name = "Acesso_Protocolo_Gelatina.pdf"
pdf.output(output_name)
print(f"Sucesso! PDF Mobile-First gerado: {output_name}")
