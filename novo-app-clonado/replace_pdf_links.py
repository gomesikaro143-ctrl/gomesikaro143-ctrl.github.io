import fitz
import sys

filename = "ebook_gelatina_mounjaro_final.pdf"
new_url = "https://gomesikaro143-ctrl.github.io/novo-app-clonado/upsell1.html"

try:
    doc = fitz.open(filename)
    num_pages = len(doc)
    last_page = doc[num_pages - 1]
    
    links = last_page.get_links()
    modifications = 0
    
    for link in links:
        if link["kind"] == fitz.LINK_URI:
            print(f"Modificando link original: {link['uri']}")
            link["uri"] = new_url
            last_page.update_link(link)
            modifications += 1

    if modifications > 0:
        doc.save("ebook_gelatina_mounjaro_final_upsold.pdf")
        print("Links atualizados e PDF salvo com sucesso!")
    else:
        print("Nenhum link encontrado ou modificado.")
            
except Exception as e:
    print(f"Erro ao processar PDF: {e}")
