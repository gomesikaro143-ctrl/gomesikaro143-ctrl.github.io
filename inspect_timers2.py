import re

filepath = "assets/index-EKBqwSm3.js"
with open(filepath, "r") as f:
    text = f.read()

# Find all timeouts around 1e4, 2e4, 3e4, etc.
matches = re.finditer(r'(.{0,200}setTimeout[^\;]+;.{0,200})', text)
for i, m in enumerate(matches):
    if "1e4" in m.group(1):
        print(f"Match {i}: {m.group(1)}")
