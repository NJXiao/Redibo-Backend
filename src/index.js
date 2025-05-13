const express = require('express');
const cors = require('cors'); // <--- IMPORTANTE
const dotenv = require('dotenv');
const sprinterosRoutes = require('./Sprinteros'); // Importar las rutas de sprinteros
const app = require('./core/server');
const { config } = require('./config');

dotenv.config();

app.use(cors()); // <--- Habilita CORS para todas las rutas

// Middleware para parsear JSON
app.use(express.json());

// Montar las rutas de sprinteros
app.use('/api', sprinterosRoutes);  // <<-- esto es importante para 

// Middleware global para manejar errores no capturados
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

// Iniciar el servidor
app.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port}`);
});