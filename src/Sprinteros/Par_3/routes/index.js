const express = require('express');
const router = express.Router();
const carRoutes = require('./carRoutes');

// Monta todas las rutas bajo /api/v2/cars
router.use('/cars', carRoutes);

module.exports = router;