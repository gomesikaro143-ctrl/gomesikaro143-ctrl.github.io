import os

filepath = "assets/index-EKBqwSm3.js"
with open(filepath, "r") as f:
    text = f.read()

# Vídeo 1 (De 70s para 50s)
text = text.replace("t+100/700", "t+100/500")

# Vídeo 2 (De 140s para 120s / 2mins)
text = text.replace("t+100/1400", "t+100/1200")

with open(filepath, "w") as f:
    f.write(text)

print("Timers dos botões atualizados: V1(50s), V2(120s)!")
