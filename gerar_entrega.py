from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

# Setup do arquivo
pdf_path = "/Users/macbook/site gelatina moujaro/Acesso_Aplicativo_Desafio_21D.pdf"
c = canvas.Canvas(pdf_path, pagesize=letter)
width, height = letter

# Cores
bg_color = HexColor("#090e17")
primary_color = HexColor("#10b981") # Verde Mounjaro
text_light = HexColor("#f8fafc")
text_muted = HexColor("#94a3b8")

# Fundo do PDF
c.setFillColor(bg_color)
c.rect(0, 0, width, height, fill=1)

# Textos Principais
c.setFillColor(text_light)
c.setFont("Helvetica-Bold", 26)
c.drawCentredString(width/2, height - 120, "PARABÉNS PELA DECISÃO!")

c.setFont("Helvetica-Bold", 18)
c.setFillColor(primary_color)
c.drawCentredString(width/2, height - 160, "DESAFIO 21 DIAS + GELATINA MOUNJARO")

c.setFont("Helvetica", 12)
c.setFillColor(text_muted)
c.drawCentredString(width/2, height - 200, "Seu aplicativo exclusivo já está liberado. Siga o passo a passo diário")
c.drawCentredString(width/2, height - 220, "para potencializar a queima e a firmeza da sua pele.")

# BOTÃO VERDE PULSANTE (Estático no PDF mas com cara de botão)
btn_x = width/2 - 180
btn_y = height - 380
btn_width = 360
btn_height = 65

# Sombra / Contorno brilhante do botão
c.setFillColor(HexColor("#0d9467"))
c.roundRect(btn_x-3, btn_y-3, btn_width+6, btn_height+6, 12, stroke=0, fill=1)

# Botão principal
c.setFillColor(primary_color)
c.roundRect(btn_x, btn_y, btn_width, btn_height, 10, stroke=0, fill=1)

# Texto do Botão
c.setFillColor(text_light)
c.setFont("Helvetica-Bold", 18)
c.drawCentredString(width/2, btn_y + 25, "CLIQUE AQUI PARA ACESSAR O APP")

# Transformar o Botão em um Link Clicável
app_link = "https://app-desafio-21d.vercel.app/"
c.linkURL(app_link, (btn_x, btn_y, btn_x + btn_width, btn_y + btn_height), relative=1)

# Rodapé
c.setFont("Helvetica", 10)
c.setFillColor(text_muted)
c.drawCentredString(width/2, 50, "Atenção: Salve este PDF ou marque a página do aplicativo nos seus favoritos.")
c.drawCentredString(width/2, 35, "Link direto: " + app_link)

c.save()
print("PDF gerado com sucesso em:", pdf_path)
