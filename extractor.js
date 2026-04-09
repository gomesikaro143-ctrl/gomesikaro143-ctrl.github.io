const fs = require('fs');
const content = fs.readFileSync('/Users/macbook/site gelatina moujaro/tmp_script.js', 'utf8');

const regex = /ingredients:\[(.*?)\]/g;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
    count++;
}
console.log("Total ingredients arrays found:", count);

// Try to find the structure of one recipe
const recipeRegex = /\{title:"([^"]+)",(?:image:"[^"]*",)?ingredients:\[(.*?)\],instructions:"([^"]+)"\}/g;
const recipes = [];
let r;
while ((r = recipeRegex.exec(content)) !== null) {
    recipes.push({
        title: r[1],
        ingredients: r[2],
        instructions: r[3]
    });
}
console.log("Total fully matched recipes:", recipes.length);

if (recipes.length > 0) {
    console.log("Sample:", JSON.stringify(recipes[0]));
    fs.writeFileSync('/Users/macbook/site gelatina moujaro/extracted_recipes.json', JSON.stringify(recipes, null, 2));
} else {
    // Let's get a loose match around "ingredients"
    const loose = content.match(/.{0,80}ingredients:\[.{0,100}/);
    if (loose) console.log("Loose match:", loose[0]);
}

// Let's also look for id:, title:, items:
const categories = content.match(/\{id:"[^"]+",title:"[^"]+",items:\[(.*?)\]\}/g);
if (categories) {
    console.log("Found categories:", categories.length);
}
