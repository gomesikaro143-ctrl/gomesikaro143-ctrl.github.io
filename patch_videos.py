import os

filepath = "assets/index-EKBqwSm3.js"

with open(filepath, "r") as f:
    text = f.read()

# Troca o Vídeo 1 (Original -> Novo)
old_v1 = "69d4f18b95a1d0cd29f7f35d"
new_v1 = "69da51c97beae73cea914a85"
text = text.replace(old_v1, new_v1)

# Troca o Vídeo 2 (Original -> Novo)
old_v2 = "69d4f27ab88719b10eb6c0cc"
new_v2 = "69da63602db04b811710e21b"
text = text.replace(old_v2, new_v2)

with open(filepath, "w") as f:
    f.write(text)

print("Vídeos remendados com sucesso no código de produção!")
