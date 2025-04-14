//RUTA
const express = require('express');
const { obtenerCiudades } = require('./controlCiudad');
const { validarPlaca } = require('./validarPlaca');
const { obtenerPlaca } = require('./vehiculo.controlador'); // NUEVO
const { obtenerVIM } = require('./vehiculo.controlador'); 
const { obtenerMarca } = require('./vehiculo.controlador');
const { obtenerModelo } = require('./vehiculo.controlador');
const { obtenerAnio } = require('./vehiculo.controlador');

const router = express.Router();

router.get('/ciudades', obtenerCiudades);
router.post('/validar-placa', validarPlaca);
router.get('/vehiculo/:id/placa', obtenerPlaca); // NUEVA RUTA
router.get('/vehiculo/:id/vim', obtenerVIM);
router.get('/vehiculo/:id/marca', obtenerMarca);
router.get('/vehiculo/:id/modelo', obtenerModelo);
router.get('/vehiculo/:id/anio', obtenerAnio);


module.exports = router;
