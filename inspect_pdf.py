import fitz
import sys

filename = "ebook_gelatina_mounjaro_final.pdf"
try:
    doc = fitz.open(filename)
    num_pages = len(doc)
    print(f"O PDF tem {num_pages} páginas.")
    
    last_page = doc[num_pages - 1]
    
    links = last_page.get_links()
    print(f"Foram encontrados {len(links)} links na última página.")
    
    for idx, link in enumerate(links):
        if link["kind"] == fitz.LINK_URI:
            print(f"Link {idx+1}: {link['uri']}")
            
except Exception as e:
    print(f"Erro ao analisar o PDF: {e}")
