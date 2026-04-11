import os

for p in ['app.js', 'entregavel-mounjaro/app.js', 'novo-app-clonado/app.js']:
    with open(p, 'r') as f:
        c = f.read()
    
    # Substituir TODAS as ocorrências de duplicidade naquele ponto
    c = c.replace('}\n}\n// ----------------------------------------------------', '}\n// ----------------------------------------------------')
    
    with open(p, 'w') as f:
        f.write(c)
    print("Fixed ", p)
