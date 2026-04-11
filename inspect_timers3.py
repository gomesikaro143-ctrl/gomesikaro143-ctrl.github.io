import re

filepath = "assets/index-EKBqwSm3.js"
with open(filepath, "r") as f:
    text = f.read()

v1_idx = text.find("69da51c97beae73cea914a85")
print(text[max(0, v1_idx-2500):v1_idx])
