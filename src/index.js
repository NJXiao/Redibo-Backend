const express = require('express');
const { PrismaClient } = require('@prisma/client');
const morgan = require("morgan");
const cors = require("cors");
const passport = require('./config/passport');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const cityRoutes = require('./routes/cityRoutes');
const authRoutes = require('./routes/authRoutes');
const OrdenPagoRoutes = require('./routes/paymentOrderRoutes');

const app = express();
const prisma = new PrismaClient();
app.use(cors());
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
app.use('/api', OrdenPagoRoutes);

// Puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});