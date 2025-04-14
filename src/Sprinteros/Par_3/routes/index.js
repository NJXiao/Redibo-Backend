const express = require('express');
const router = express.Router();
const carRoutes = require('./carRoutes');
const direcRoutes = require('./direcRoutes');

// Monta todas las rutas bajo /api/v2/cars
router.use('/cars', carRoutes);
// Monta todas las rutas bajo /api/v2/direc
router.use('/direc', direcRoutes);

module.exports = router;