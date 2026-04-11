import re

filepath = "assets/index-EKBqwSm3.js"
with open(filepath, "r") as f:
    text = f.read()

v2_idx = text.find("69da63602db04b811710e21b")
print(text[max(0, v2_idx-2500):v2_idx])
