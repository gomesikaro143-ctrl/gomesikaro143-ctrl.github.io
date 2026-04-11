import json
import re

categories = ["Todas","FIT","Gelatinas","Detox","Beleza","Relaxantes","Shakes","Almoço","Jantar"]

recipes = []
id_counter = 1

fruits = ["Morango", "Limão", "Abacaxi", "Maracujá", "Uva", "Mirtilo", "Maçã", "Kiwi", "Framboesa", "Amora"]
herbs = ["Hortelã", "Gengibre", "Canela", "Camomila", "Hibisco", "Erva-Doce", "Alecrim", "Capim-Limão", "Cidreira", "Matchá"]
benefits = ["Acelera Metabolismo", "Queima Gordura", "Efeito Diurético", "Zero Inchaço", "Mais Saciedade", "Ação Antioxidante", "Detox Corporal", "Seca Barriga", "Ação Termogênica", "Reduz Fome Noturna"]

# 30-Day Plan (60 recipes)
for day in range(1, 31):
    f_idx = day % len(fruits)
    h_idx = day % len(herbs)
    b_idx = day % len(benefits)
    
    recipes.append({
        "id": id_counter,
        "name": f"Gelatina Especial de {fruits[f_idx]} e {herbs[h_idx]}",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": f"✨ Receita Oficial - Dia {day}: {benefits[b_idx]}. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": f"1 sachê (12g) de gelatina incolor, 250ml de chá de {herbs[h_idx]}, Adoçante natural stevia, Pedaços frescos de {fruits[f_idx]}",
        "instructions": f"1. Prepare o chá de {herbs[h_idx]} quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de {fruits[f_idx]}.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": f"• Gelatina incolor sem sabor\n• {herbs[h_idx]} para chá\n• {fruits[f_idx]}\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": day
    })
    id_counter += 1
    
    recipes.append({
        "id": id_counter,
        "name": f"Chá Detox Noturno de {herbs[(h_idx+1)%len(herbs)]}",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": f"✨ Complemento - Dia {day}: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": f"1 colher de sopa de {herbs[(h_idx+1)%len(herbs)]}, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": f"1. Ferva a água e desligue o fogo.\n2. Adicione a {herbs[(h_idx+1)%len(herbs)]} e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": f"• Erva {herbs[(h_idx+1)%len(herbs)]}\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": day
    })
    id_counter += 1

# Extras (10 Shakes, 5 Almoço, 5 Jantar)
for i in range(10):
    recipes.append({
        "id": id_counter,
        "name": f"Shake Saciedade de {fruits[i%len(fruits)]}",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": f"200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de {fruits[i%len(fruits)]}, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• " + fruits[i%len(fruits)],
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    })
    id_counter += 1

for i in range(5):
    recipes.append({
        "id": id_counter,
        "name": f"Almoço Low-Carb {'Grelhado' if i%2==0 else 'Assado'}",
        "category": "Almoço",
        "time": "30 min",
        "emoji": "🥗",
        "desc": "Proteína magra para reconstrução e pele firme enquanto emagrece.",
        "ingredients": "150g de peito de frango ou peixe branco, 1 xícara de vegetais verdes, Azeite, Sal e Ervas finas",
        "instructions": "Tempere a proteína apenas com sal, limão e ervas. Grelhe com 1 fio de azeite. Acompanhe com salada de folhas.",
        "shoppingList": "• Proteína Magra\n• Folhas Verdes\n• Azeite Extra Virgem",
        "schedule": "Almoço"
    })
    id_counter += 1

for i in range(5):
    recipes.append({
        "id": id_counter,
        "name": f"Caldo Seca Barriga Noturno",
        "category": "Jantar",
        "time": "25 min",
        "emoji": "🥘",
        "desc": "Um jantar levíssimo que te fará acordar desinchada.",
        "ingredients": "1 chuchu, 1/2 cenoura rasa, 1 pitada de gengibre, 100g de frango desfiado, Pimenta preta",
        "instructions": "Cozinhe o chuchu e a cenoura até derreter, bata no liquidificador. Volte pra panela, adicione o frango e os temperos.",
        "shoppingList": "• Chuchu e Cenoura\n• Gengibre\n• Peito de frango",
        "schedule": "Jantar (até as 20h00)"
    })
    id_counter += 1

db_json = "const recipesCategories = " + json.dumps(categories, ensure_ascii=False) + ";\nconst recipesDatabase = " + json.dumps(recipes, indent=4, ensure_ascii=False) + ";"

new_dialog_func = """window.openRecipeDialog = function(id) {
    const recipe = recipesDatabase.find(r => r.id === id);
    if(!recipe) return;

    const overlay = document.getElementById('recipe-sheet-overlay');
    const sheet = document.getElementById('recipe-sheet-content');

    sheet.innerHTML = `
        <div class="sheet-drag-handle"></div>
        <div class="sheet-emoji-circle">${recipe.emoji}</div>
        <h2 class="sheet-title">${recipe.name}</h2>
        
        <div class="sheet-meta-badges">
            <span class="badge"><i data-lucide="clock" style="width:14px;height:14px;"></i> ${recipe.time}</span>
            <span class="badge">${recipe.category}</span>
            ${recipe.dayOfPlan ? '<span class="badge" style="background: linear-gradient(135deg, hsl(330, 80%, 55%), hsl(270, 91%, 65%)); color: white; border: none; font-weight: bold;"><i data-lucide="calendar" style="width:14px;height:14px; color: white;"></i> DIA ' + recipe.dayOfPlan + '</span>' : ''}
        </div>

        ${recipe.desc ? '<p class="sheet-desc" style="font-size: 0.95rem; line-height: 1.5; color: var(--text-muted); margin-bottom: 20px;">' + recipe.desc + '</p>' : ''}
        
        ${recipe.schedule ? `
        <div class="sheet-box" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.4); margin-bottom: 12px; padding: 16px;">
            <span class="box-label" style="color: #10b981; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.5px;">⏰ MELHOR HORÁRIO PARA TOMAR</span>
            <p style="font-weight: 600; font-size: 0.95rem; color: var(--foreground); margin-top: 6px;">${recipe.schedule}</p>
        </div>` : ''}

        ${recipe.shoppingList ? `
        <div class="sheet-box" style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.4); margin-bottom: 12px; padding: 16px;">
            <span class="box-label" style="color: #38bdf8; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.5px;">🛒 LISTA DE COMPRAS</span>
            <p style="white-space: pre-line; color: var(--text-main); font-size: 0.95rem; margin-top: 6px; line-height: 1.6;">${recipe.shoppingList}</p>
        </div>` : ''}

        ${recipe.ingredients ? `
        <div class="sheet-box" style="margin-bottom: 12px; padding: 16px;">
            <span class="box-label" style="color: #d946ef; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.5px;">INGREDIENTES</span>
            <p style="color: var(--text-main); font-size: 0.95rem; margin-top: 6px; line-height: 1.6;">${recipe.ingredients}</p>
        </div>` : ''}

        ${recipe.instructions ? `
        <div class="sheet-box" style="margin-bottom: 20px; padding: 16px;">
            <span class="box-label" style="color: #facc15; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.5px;">MODO DE PREPARO (COMO FAZER)</span>
            <p style="white-space: pre-line; color: var(--text-main); font-size: 0.95rem; margin-top: 6px; line-height: 1.6;">${recipe.instructions}</p>
        </div>` : ''}
    `;

    overlay.classList.add('show');
    if (window.lucide) lucide.createIcons();
};"""

def patch_file(p):
    with open(p, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Replace categories and database
    pattern_db = r'const recipesCategories = \[.*?\];\nconst recipesDatabase = \[.*?\];'
    content = re.sub(pattern_db, lambda x: db_json, content, flags=re.DOTALL)
    
    # 2. Replace openRecipeDialog function
    pattern_fn = r'window\.openRecipeDialog = function\(id\) \{.*?(?=window\.closeRecipeDialog = function)'
    content = re.sub(pattern_fn, lambda x: new_dialog_func + '\n\n', content, flags=re.DOTALL)
    
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)

patch_file("app.js")
patch_file("entregavel-mounjaro/app.js")

print("Banco de dados substituído!")
