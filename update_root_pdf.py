import fitz
import os

input_pdf = "ebook_gelatina_mounjaro_final.pdf"
output_pdf = "ebook_gelatina_mounjaro_final_updated.pdf"

# Link para o Botão 2 (Acompanhamento Exclusivo)
checkout_link = "https://vip-mentoria-site.vercel.app"

try:
    doc = fitz.open(input_pdf)
    num_pages = len(doc)
    last_page = doc[num_pages - 1]
    
    links = last_page.get_links()
    print(f"Encontrados {len(links)} links na última página.")
    
    # Vamos atualizar apenas o segundo link (índice 1) se houver pelo menos 2 links
    # Ou se houver 1 link, atualizar ele se for o de acompanhamento.
    # Baseado na inspeção anterior, temos 2 links, ambos eram upsell1.html
    
    if len(links) >= 2:
        # Segundo link (Botão de baixo/direita geralmente é o segundo retornado)
        link = links[1]
        link["uri"] = checkout_link
        last_page.update_link(link)
        print(f"Botão 2 atualizado para: {checkout_link}")
    elif len(links) == 1:
        # Se só tiver um, atualizamos ele mesmo
        link = links[0]
        link["uri"] = checkout_link
        last_page.update_link(link)
        print(f"Botão único atualizado para: {checkout_link}")

    doc.save(output_pdf)
    doc.close()
    
    # Sobrescreve o original
    os.replace(output_pdf, input_pdf)
    print(f"Sucesso! PDF original atualizado.")
    
except Exception as e:
    print(f"Erro ao processar o PDF: {e}")
