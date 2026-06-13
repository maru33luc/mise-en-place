let recipes = [
  {
    id: 1,
    title: "Pasta Carbonara",
    description: "Pasta italiana clásica con salsa de huevo y queso",
    difficulty: "medium",
    ingredients: [
      { name: "pasta", amount: 400, unit: "g" },
      { name: "huevos", amount: 3, unit: "unidad" },
      { name: "queso parmesano", amount: 100, unit: "g" },
      { name: "panceta", amount: 200, unit: "g" }
    ]
  },
  {
    id: 2,
    title: "Ensalada César",
    description: "Ensalada fresca con aderezo Caesar casero",
    difficulty: "easy",
    ingredients: [
      { name: "lechuga romana", amount: 1, unit: "unidad" },
      { name: "queso parmesano", amount: 50, unit: "g" },
      { name: "pan tostado", amount: 100, unit: "g" }
    ]
  }
];

let nextId = 3;

class Recipe {
  static getAll() {
    return recipes;
  }

  static getById(id) {
    return recipes.find(r => r.id === id) || null;
  }

  static create(data) {
    const newRecipe = {
      id: nextId++,
      ...data
    };
    recipes.push(newRecipe);
    return newRecipe;
  }

  static update(id, data) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return null;
    
    Object.assign(recipe, data);
    return recipe;
  }

  static delete(id) {
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    const deleted = recipes[index];
    recipes.splice(index, 1);
    return deleted;
  }
}

module.exports = Recipe;
