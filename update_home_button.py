import re

paths = ["app.js", "entregavel-mounjaro/app.js", "novo-app-clonado/app.js"]

target = """                <i data-lucide="book-open" style="width: 18px; height: 18px;"></i>
                ACESSAR RECEITAS COMPLETAS
            </button>"""

replacement = """                <i data-lucide="book-open" style="width: 18px; height: 18px;"></i>
                ACESSAR AS 3 RECEITAS MAIS FAMOSAS
            </button>
            <p style="text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-top: -8px; margin-bottom: 12px; font-style: italic;">✨ Rola pra baixo! Mais de 200 receitas bônus na aba inferior.</p>"""

for p in paths:
    try:
        with open(p, "r", encoding="utf-8") as f:
            content = f.read()
            
        new_content = content.replace(target, replacement)
        
        with open(p, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {p} successfully.")
    except Exception as e:
        print(f"Failed {p}: {str(e)}")
