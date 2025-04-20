const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

// Importamos las rutas de los módulos
const carRoutes = require('./Sprinteros/Par_2/routes/carRoutes');
app.use('/api/v3', carRoutes);
const rutasPar1 = require('./Sprinteros/Par_1/controlador/rutas');
app.use('/api', rutasPar1);
const rutasPar3 = require('./Sprinteros/Par_3/routes');
app.use('/api/v2', rutasPar3);

const bodyParser = require('body-parser');

const { PrismaClient } = require('@prisma/client');


const app = express();
const prisma = new PrismaClient();

app.use(express.json({ limit: '10mb' })); // o más si hace falta
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


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

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 4000;
if (!PORT) {
  console.error('Error: La variable de entorno PORT no está configurada.');
  process.exit(1);
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});