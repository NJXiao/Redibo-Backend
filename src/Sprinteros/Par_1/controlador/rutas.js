const express = require('express');
const { obtenerCiudades } = require('./controlCiudad');
const { validarPlaca } = require('./validarPlaca'); // Importa el controlador de validarPlaca


const router = express.Router();

// Ruta para obtener las ciudades
router.get('/ciudades', obtenerCiudades);
// Ruta para validar una placa
router.post('/validar-placa', validarPlaca); // POST porque probablemente envíes datos para validar


module.exports = router;