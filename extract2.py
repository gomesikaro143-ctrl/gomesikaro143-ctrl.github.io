import re
import json

with open('/Users/macbook/site gelatina moujaro/tmp_recipes.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract all item arrays
matches = re.finditer(r'items:\[(.*?)\]', text)
items = []

for match in matches:
    array_content = match.group(1)
    # Extract titles and texts from this array
    item_matches = re.finditer(r'\{[^{]*?title:\s*"([^"]+)"[^{]*?\}', array_content)
    for im in item_matches:
        title = im.group(1)
        # Try to find text or instructions
        text_m = re.search(r'text:\s*"([^"]+)"', im.group(0))
        instructions_m = re.search(r'instructions:\s*"([^"]+)"', im.group(0))
        desc = text_m.group(1) if text_m else (instructions_m.group(1) if instructions_m else "")
        items.append({"title": title, "desc": desc})

print(f"Total items found across all categories: {len(items)}")
with open('/Users/macbook/site gelatina moujaro/extracted_items.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

