filepath = "assets/index-EKBqwSm3.js"

with open(filepath, "r") as f:
    text = f.read()

# Troca o Vídeo 1 pelo Vídeo 2 com segurança usando temporário
text = text.replace("69da51c97beae73cea914a85", "TEMP_HASH")
text = text.replace("69da63602db04b811710e21b", "69da51c97beae73cea914a85")
text = text.replace("TEMP_HASH", "69da63602db04b811710e21b")

with open(filepath, "w") as f:
    f.write(text)

print("Posições dos vídeos invertidas com sucesso!")
