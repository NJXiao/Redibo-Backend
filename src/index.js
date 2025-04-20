const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Importamos las rutas de los módulos
const rutasPar1 = require('./sprinteros/Par_1/controlador/rutas');
const rutasPar3 = require('./sprinteros/Par_3/routes');

const app = express();

// Middlewares globales
app.use(express.json({ limit: '10mb' })); // o más si hace falta
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Configuración de CORS para desarrollo y despliegue
const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
}));

// Ruta base para verificar que el servidor esté funcionando
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Montar las rutas de los módulos
app.use('/api', rutasPar1); // Rutas para Par_1
app.use('/api/v2', rutasPar3); // Rutas para Par_3

// Middleware para manejar rutas no definidas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Middleware global para manejar errores no capturados
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

// Validar variables de entorno antes de iniciar el servidor
const PORT = process.env.PORT || 4000;
if (!PORT) {
  console.error('Error: La variable de entorno PORT no está configurada.');
  process.exit(1);
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
