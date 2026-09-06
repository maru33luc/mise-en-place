const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const recipesRoutes = require('./routes/practices');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const prepListRoutes = require('./routes/prepList');
const RecipesController = require('./controllers/practicesController');

const BASE_PORT       = parseInt(process.env.PORT, 10)             || 3000;
const ALLOWED_ORIGIN  = process.env.ALLOWED_ORIGIN                 || 'http://localhost:4200';
const RATE_WINDOW_MS  = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000;
const RATE_MAX        = parseInt(process.env.RATE_LIMIT_MAX, 10)   || 100;
const BODY_LIMIT      = process.env.BODY_LIMIT                     || '10kb';

const app = express();

app.use(helmet());
app.disable('x-powered-by');

app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use('/api/', rateLimit({
  windowMs: RATE_WINDOW_MS,
  max: RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas solicitudes, intenta más tarde' }
}));

app.use(express.json({ limit: BODY_LIMIT }));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/prep-list', prepListRoutes);
app.get('/api/health', RecipesController.health);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

function startServer(port) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      throw err;
    }
  });
}

startServer(BASE_PORT);
