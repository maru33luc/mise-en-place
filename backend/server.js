const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const recipesRoutes = require('./routes/practices');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const prepListRoutes = require('./routes/prepList');
const RecipesController = require('./controllers/practicesController');

const PORT             = Number(process.env.PORT);
const ALLOWED_ORIGIN  = process.env.ALLOWED_ORIGIN                 || 'http://localhost:4200';
const RATE_WINDOW_MS  = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000;
const RATE_MAX        = parseInt(process.env.RATE_LIMIT_MAX, 10)   || 100;
const BODY_LIMIT      = process.env.BODY_LIMIT                     || '5mb';

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
  message: { success: false, message: 'Too many requests, try again later' }
}));

app.use(express.json({ limit: BODY_LIMIT }));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/prep-list', prepListRoutes);
app.get('/api/health', RecipesController.health);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

function startServer(port = PORT) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535 in backend/.env');
  }

  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${server.address().port}`);
  });

  server.on('error', (error) => {
    console.error(`Unable to bind to configured port ${port}.`, error);
    process.exitCode = 1;
  });

  return server;
}

if (require.main === module) {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535 in backend/.env');
  }
  startServer();
}

module.exports = { app, startServer };
