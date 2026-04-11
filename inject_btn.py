import os

btn_html = """
            <button onclick="potencializarResultados()" style="width: 100%; margin-top: 15px; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 12px; padding: 12px; color: white; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); transition: 0.2s; text-transform: uppercase;">
                <i data-lucide="zap" style="width: 16px; height: 16px;"></i>
                POTENCIALIZAR RESULTADOS
            </button>
        </div>"""

for p in ['app.js', 'entregavel-mounjaro/app.js', 'novo-app-clonado/app.js']:
    try:
        with open(p, 'r') as f:
            content = f.read()
            
        # Add a dummy function right before getInitialState
        if 'window.potencializarResultados' not in content:
            content = content.replace('function getInitialState()', 'window.potencializarResultados = function() {\n    alert("Ação em breve!");\n};\n\nfunction getInitialState()')
            
        old_div_end = "${(isCurrent || isCompleted) ? recipesHTML : ''}\n        </div>"
        new_div_end = "${(isCurrent || isCompleted) ? recipesHTML : ''}" + btn_html
        
        content = content.replace(old_div_end, new_div_end)
        with open(p, 'w') as f:
            f.write(content)
        print(f"Patched {p}")
    except Exception as e:
        print(f"Erro {p}: {e}")
