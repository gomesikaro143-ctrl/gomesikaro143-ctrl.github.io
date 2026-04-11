filepath = "assets/index-EKBqwSm3.js"
with open(filepath, "r") as f:
    text = f.read()

v1_idx = text.find("69da51c97beae73cea914a85")
v2_idx = text.find("69da63602db04b811710e21b")

print("V1 context:")
print(text[max(0, v1_idx-300):v1_idx+500])
print("\n---\n")
print("V2 context:")
print(text[max(0, v2_idx-300):v2_idx+500])
