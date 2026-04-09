import fitz

input_pdf = "ebook_gelatina_mounjaro_final.pdf"
output_pdf = "ebook_gelatina_mounjaro_final_v3.pdf"
# Link final para a URL do Vercel que já está no ar
new_link = "https://protocolo-gelatina-app.vercel.app/upsell1.html"

try:
    doc = fitz.open(input_pdf)
    num_pages = len(doc)
    last_page = doc[num_pages - 1]
    
    links = last_page.get_links()
    print(f"Limpando e reconfigurando links na última página...")
    
    for link in links:
        if link["kind"] == fitz.LINK_URI:
            old_uri = link["uri"]
            
            # Botão 1: Flacidez
            if "emotional-upsell-booster" in old_uri or "upsell1.html" in old_uri:
                print(f"Ativando Botão 1: {new_link}")
                link["uri"] = new_link
                last_page.update_link(link)
            
            # Botão 2: Acompanhamento (Desativar)
            elif "docu-funnel-magic" in old_uri:
                print(f"Desativando Botão 2 (Saindo OFF).")
                last_page.delete_link(link)
    
    doc.save(output_pdf)
    doc.close()
    print(f"PDF finalizado e salvo!")
    
except Exception as e:
    print(f"Erro no PDF: {e}")
