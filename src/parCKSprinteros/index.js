// index.js (raíz del proyecto)
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar rutas
const { userRoutes, authRoutes } = require('./routes');

// Middlewares
app.use(express.json());

// Usar rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
