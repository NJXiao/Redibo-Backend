
const express = require('express');
const cors = require('cors'); // <--- IMPORTANTE
const dotenv = require('dotenv');
const sprinterosRoutes = require('./Sprinteros'); // Importar las rutas de sprinteros
const app = require('./core/server');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors()); // <--- Habilita CORS para todas las rutas

// Middleware para parsear JSON
app.use(express.json());

// Montar las rutas de sprinteros
app.use('/api', sprinterosRoutes);  // <<-- esto es importante para sprinteros no modificar

// Middleware global para manejar errores no capturados
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});