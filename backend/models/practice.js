/** In-memory recipe store — scoped per user */
const recipesByUser = {};
let nextId = 10; // start at 10 to avoid collision with demo data

/** Seed data (global, unowned — visible to all users on first load) */
const SEED = [
  {
    id: 1, userId: null,
    title: 'Butter-Poached Lobster',
    description: 'Maine lobster tail gently poached in clarified butter with tarragon and a whisper of saffron.',
    difficulty: 'hard',
    season: 'summer',
    tags: ['protein', 'shellfish'],
    servings: 2,
    ingredients: [
      { name: 'Lobster tail', amount: 2, unit: 'unit' },
      { name: 'Clarified butter', amount: 200, unit: 'g' },
      { name: 'Fresh tarragon', amount: 10, unit: 'g' },
      { name: 'Saffron threads', amount: 0.5, unit: 'g' },
    ],
  },
  {
    id: 2, userId: null,
    title: 'Truffle Risotto',
    description: 'Arborio rice slow-cooked to perfection, finished with black Périgord truffle and aged Parmigiano.',
    difficulty: 'medium',
    season: 'fall',
    tags: ['vegetable', 'gluten-free'],
    servings: 4,
    ingredients: [
      { name: 'Arborio rice', amount: 320, unit: 'g' },
      { name: 'Black truffle', amount: 20, unit: 'g' },
      { name: 'Parmigiano Reggiano', amount: 80, unit: 'g' },
      { name: 'Dry white wine', amount: 120, unit: 'ml' },
      { name: 'Chicken stock', amount: 1200, unit: 'ml' },
    ],
  },
  {
    id: 3, userId: null,
    title: 'Crème Brûlée',
    description: 'Silky vanilla custard beneath a perfectly torched caramel crust. A timeless finisher.',
    difficulty: 'medium',
    season: 'winter',
    tags: ['dessert', 'dairy', 'gluten-free'],
    servings: 6,
    ingredients: [
      { name: 'Heavy cream', amount: 500, unit: 'ml' },
      { name: 'Egg yolks', amount: 6, unit: 'unit' },
      { name: 'Caster sugar', amount: 100, unit: 'g' },
      { name: 'Vanilla bean', amount: 1, unit: 'unit' },
    ],
  },
];

class Recipe {
  static _store(userId) {
    const key = userId ?? 'public';
    if (!recipesByUser[key]) recipesByUser[key] = [];
    return recipesByUser[key];
  }

  static getAll(userId) {
    // Return seed (public) + user's own recipes
    return [...SEED, ...Recipe._store(userId)];
  }

  static getById(userId, id) {
    return Recipe.getAll(userId).find(r => r.id === id) || null;
  }

  static create(userId, data) {
    const recipe = {
      id: nextId++,
      userId,
      title: data.title,
      description: data.description,
      difficulty: data.difficulty || 'medium',
      season: data.season || 'all',
      tags: data.tags || [],
      servings: data.servings || 2,
      ingredients: data.ingredients || [],
      createdAt: new Date().toISOString(),
    };
    Recipe._store(userId).push(recipe);
    return recipe;
  }

  static update(userId, id, data) {
    const store = Recipe._store(userId);
    const recipe = store.find(r => r.id === id);
    if (!recipe) return null;
    Object.assign(recipe, data);
    recipe.updatedAt = new Date().toISOString();
    return recipe;
  }

  static delete(userId, id) {
    const store = Recipe._store(userId);
    const idx = store.findIndex(r => r.id === id);
    if (idx === -1) return null;
    return store.splice(idx, 1)[0];
  }
}

module.exports = Recipe;
