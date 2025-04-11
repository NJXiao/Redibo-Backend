
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const morgan = require("morgan");
const cors = require("cors");
const rutas = require('./Sprinteros/Par_1/controlador/rutas'); // Importa el archivo de rutas generales

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(morgan("dev"));

// Configuración de CORS
app.use(cors({ origin: 'http://localhost:3000' }));

// Ruta base
app.get('/', (req, res) => {
  res.send('server is running');
});


// Conecta las rutas generales
app.use('/api', rutas);


// Inicia el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});