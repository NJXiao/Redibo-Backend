// filepath: d:\IS_proyect\Redibo-Backend\src\index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Configuración de CORS
app.use(cors({ origin: 'http://localhost:3000' }));

// Ruta base
app.get('/', (req, res) => {
  res.send('server is running');
});

// Ruta para departamentos
app.get('/departamento', async (req, res) => {
  try {
    const departamento = await prisma.departamento.findMany();
    res.json(departamento);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departamento' });
  }
});

// Importa y conecta las rutas de ciudades
const ciudadRoutes = require('./Sprinteros/Par_1/controlador/ciudadaRuta');
app.use('/api', ciudadRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});