const express = require('express');
const morgan = require("morgan");
const cors = require("cors");

// Importamos la ruta de Par_1 (existente)
const rutasPar1 = require('./sprinteros/Par_1/controlador/rutas');
// Importamos la nueva ruta de Par_3
const rutasPar3 = require('./sprinteros/Par_3/routes');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(morgan("dev"));

// Configuración de CORS para desarrollo
app.use(cors({ origin: 'http://localhost:3000' }));

// Ruta base para verificar que el servidor esté funcionando
app.get('/', (req, res) => {
  res.send('server is running');
});

app.use('/api', rutasPar1); // Para Par_1
app.use('/api/v2', rutasPar3); 

// Inicia el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
