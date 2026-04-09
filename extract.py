import re
import json

with open('/Users/macbook/site gelatina moujaro/tmp_recipes.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern for React minified objects like: {id:"...",title:"...",ingredients:["..."],instructions:"..."}
# Since properties might be in different order, let's just find everything between { and } that has 'ingredients:'
pattern = re.compile(r'\{([^{]*?ingredients:\[.*?\].*?)\}')

recipes = []

for match in pattern.finditer(text):
    obj_str = match.group(1)
    
    title_match = re.search(r'title:\s*"([^"]+)"', obj_str)
    title = title_match.group(1) if title_match else "Sem Título"
    
    ingredients_match = re.search(r'ingredients:\s*\[(.*?)\]', obj_str)
    ingredients_raw = ingredients_match.group(1) if ingredients_match else ""
    ingredients = re.findall(r'"([^"]+)"', ingredients_raw)
    
    instructions_match = re.search(r'instructions:\s*"([^"]+)"', obj_str)
    instructions = instructions_match.group(1) if instructions_match else ""
    
    recipes.append({
        "title": title,
        "ingredients": ingredients,
        "instructions": instructions
    })

print(f"Found {len(recipes)} recipes.")

if recipes:
    with open('/Users/macbook/site gelatina moujaro/extracted_recipes.json', 'w', encoding='utf-8') as f:
        json.dump(recipes, f, ensure_ascii=False, indent=2)
    print("Mounjaro App recipes safely extracted to extracted_recipes.json!")
