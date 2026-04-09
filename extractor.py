import re
import json

with open('/Users/macbook/site gelatina moujaro/tmp_script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Look for all occurrences of ingredients array pattern
ingredients_matches = re.finditer(r'ingredients:\[(.*?)\]', content)
print(f"Total ingredients arrays found: {sum(1 for _ in ingredients_matches)}")

# Try to find objects that have 'title' or 'nome', 'ingredients', and 'instructions'
# The data might be like: {title:"Omelete",ingredients:["Ovo","Sal"],instructions:"Misture e frite"}
recipe_regex = r'\{[^{]*?title:"([^"]+)"[^{]*?ingredients:\[(.*?)\][^{]*?\}'
recipes = []

for match in re.finditer(recipe_regex, content):
    recipes.append({
        "title": match.group(1),
        "ingredients": match.group(2)
    })

print(f"Total fully matched recipes: {len(recipes)}")

if recipes:
    print("Sample:", recipes[0])
    with open('/Users/macbook/site gelatina moujaro/extracted_recipes.json', 'w', encoding='utf-8') as f:
        json.dump(recipes, f, ensure_ascii=False, indent=2)
else:
    loose_match = re.search(r'.{0,80}ingredients:\[.{0,100}', content)
    if loose_match:
        print("Loose match around ingredients:")
        print(loose_match.group(0))

# Try looking for "categories"
categories_regex = r'id:"([^"]+)",title:"([^"]+)",items:\[(.*?)\]'
cats = list(re.finditer(categories_regex, content))
print(f"Found categories strings: {len(cats)}")
if cats:
    print("Category sample:",Cats[0].group(2))
