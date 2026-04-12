import os

filepath = "assets/index-EKBqwSm3.js"

with open(filepath, "r") as f:
    text = f.read()

# 1. Alteração de Preço Principal
# De R$ 37 para R$ 47
text = text.replace('children:"R$ 37"', 'children:"R$ 47"')

# 2. Ajuste do Pixel (Purchase Event)
# value: 37 -> value: 47
text = text.replace('value:37,currency:"BRL"', 'value:47,currency:"BRL"')
text = text.replace('value:37.00,currency:"BRL"', 'value:47.00,currency:"BRL"')

# 3. Ajuste das Parcelas
# 6x de R$5,32 -> 6x de R$7,83
text = text.replace('Ou 6x de R$5,32', 'Ou 6x de R$7,83')

# 4. Substituição do Vídeo 2 (ConverteAI) 
# ID Antigo: 69da63602db04b811710e21b
# ID Novo: 69db0ab5902df69f63eccdb2
text = text.replace('69da63602db04b811710e21b', '69db0ab5902df69f63eccdb2')

with open(filepath, "w") as f:
    f.write(text)

print("Funil atualizado com sucesso: Preço R$ 47 e Novo Vídeo 2 configurado.")
