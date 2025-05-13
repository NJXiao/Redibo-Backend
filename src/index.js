
const app = require('./core/server');
/*
const express = require('express');
const cors = require('cors'); // <--- IMPORTANTE
const dotenv = require('dotenv');
const sprinterosRoutes = require('./Sprinteros'); // Importar las rutas de sprinteros

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors()); // <--- Habilita CORS para todas las rutas

// Middleware para parsear JSON
app.use(express.json());

// Montar las rutas de sprinteros
app.use('/api', sprinterosRoutes);

// Middleware global para manejar errores no capturados
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

<<<<<<< HEAD

app.get('/departamento', async (req, res) => {
  try {
    const departamento = await prisma.departamento.findMany();
    res.json(departamento);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departamento' });
  }
});*/

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
=======
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
>>>>>>> sprinteros
});