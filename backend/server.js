const express = require('express');
const cors = require('cors');
const recipesRoutes = require('./routes/practices');
const RecipesController = require('./controllers/practicesController');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/recipes', recipesRoutes);
app.get('/api/health', RecipesController.health);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
