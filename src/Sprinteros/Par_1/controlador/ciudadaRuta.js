const express = require('express');
const { obtenerCiudades } = require('../controlador/controlCiudad');

const router = express.Router();

// Ruta para obtener las ciudades
router.get('/ciudades', obtenerCiudades);

module.exports = router;