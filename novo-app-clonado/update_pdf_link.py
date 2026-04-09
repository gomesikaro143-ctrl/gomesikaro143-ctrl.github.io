import fitz

input_pdf = "ebook_gelatina_mounjaro_final.pdf"
output_pdf = "ebook_gelatina_mounjaro_final_v2.pdf"
new_link = "https://gomesikaro143-ctrl.github.io/novo-app-clonado/upsell1.html"

try:
    doc = fitz.open(input_pdf)
    num_pages = len(doc)
    last_page = doc[num_pages - 1]
    
    links = last_page.get_links()
    
    for link in links:
        if link["kind"] == fitz.LINK_URI:
            old_uri = link["uri"]
            if "emotional-upsell-booster" in old_uri:
                print(f"Substituindo link antigo: {old_uri}")
                # Atualiza o dicionário do link
                link["uri"] = new_link
                last_page.update_link(link)
                print(f"Novo link injetado: {new_link}")
    
    doc.save(output_pdf)
    doc.close()
    print(f"Sucesso! PDF salvo como {output_pdf}")
    
except Exception as e:
    print(f"Erro ao modificar o PDF: {e}")
