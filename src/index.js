const express = require('express');
const { PrismaClient } = require('@prisma/client');
const morgan = require("morgan");
const cors = require("cors");
const passport = require('./config/passport');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const cityRoutes = require('./routes/cityRoutes');
const authRoutes = require('./routes/authRoutes');
const sprinterosRoutes = require('./Sprinteros'); // Importar las rutas de sprinteros


const app = express();
const prisma = new PrismaClient();
app.use(cookieParser(process.env.COOKIE_SECRET || 'redibo-secret'));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ['Set-Cookie', 'Cookie', 'Date', 'ETag']
}));
app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());

// Ruta principal
app.get('/', (req, res) => {
  res.send('server is running');
});

// Rutas de la API
app.use('/api', userRoutes);
app.use('/api', cityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', sprinterosRoutes);

// Puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

});