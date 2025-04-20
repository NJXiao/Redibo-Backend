const express = require('express');
const { createCar } = require('../controllers/carController');
const router = express.Router();

// Configuración específica para la ruta de cars
router.post('/cars', (req, res, next) => {
  console.log('Body recibido:', req.body); // Log para depuración
  next();
}, createCar);

// Agrega más rutas si es necesario
router.get('/cars', (req, res) => {
  res.status(200).json({ message: 'Lista de carros' });
});

module.exports = router;