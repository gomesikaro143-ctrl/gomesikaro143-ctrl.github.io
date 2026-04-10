import fitz

input_pdf = "ebook_gelatina_mounjaro_final.pdf"
output_pdf = "ebook_gelatina_mounjaro_final.pdf" # overwriting directly
new_link = "https://vip-mentoria-site.vercel.app"

try:
    doc = fitz.open(input_pdf)
    num_pages = len(doc)
    last_page = doc[num_pages - 1]
    
    links = last_page.get_links()
    
    for link in links:
        if link["kind"] == fitz.LINK_URI:
            old_uri = link["uri"]
            # Encontra o Link 2 (Checkout direto) e substitui pro Mentoria VIP App!
            if "pay.kirvano.com" in old_uri:
                print(f"Substituindo link 2: {old_uri}")
                link["uri"] = new_link
                last_page.update_link(link)
                print(f"Novo link injetado no E-Book PDF: {new_link}")
            
    doc.save("ebook_tmp.pdf")
    doc.close()
    
    import os
    os.replace("ebook_tmp.pdf", input_pdf)
    print("O PDF Final foi atualizado com sucesso!")
except Exception as e:
    print(f"Erro ao modificar o PDF: {e}")
