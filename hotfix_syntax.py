import os
import re

for p in ['app.js', 'entregavel-mounjaro/app.js', 'novo-app-clonado/app.js']:
    with open(p, 'r') as f:
        c = f.read()

    # The buggy string is missing the closing div and ternary bracket
    # Current buggy part:
    # <p style="white-space: pre-line; color: var(--text-main); font-size: 0.95rem; margin-top: 6px; line-height: 1.6;">${recipe.instructions}</p>\n        \n        <button onclick="window.potencializarResultados()"
    
    buggy_str = '<p style="white-space: pre-line; color: var(--text-main); font-size: 0.95rem; margin-top: 6px; line-height: 1.6;">${recipe.instructions}</p>\n        \n        <button onclick="window.potencializarResultados()"'
    fixed_str = '<p style="white-space: pre-line; color: var(--text-main); font-size: 0.95rem; margin-top: 6px; line-height: 1.6;">${recipe.instructions}</p>\n        </div>` : \'\'}\n        \n        <button onclick="window.potencializarResultados()"'
    
    c = c.replace(buggy_str, fixed_str)
    
    with open(p, 'w') as f:
        f.write(c)
    
    print("Fixed ", p)
