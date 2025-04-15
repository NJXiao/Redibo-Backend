//RUTA
const express = require('express');
const { obtenerCiudades } = require('./controlCiudad');
const { validarPlaca } = require('./validarPlaca');
const {
    obtenerPlaca,
    obtenerVIM,
    obtenerMarca,
    obtenerModelo,
    obtenerAnio,
    obtenerVehiculoCompleto, obtenerCaracteristicas // 👈 nuevo import
  } = require('./vehiculo.controlador');

const router = express.Router();

router.get('/ciudades', obtenerCiudades);
router.post('/validar-placa', validarPlaca);
router.get('/vehiculo/:id/placa', obtenerPlaca); // NUEVA RUTA
router.get('/vehiculo/:id/vim', obtenerVIM);
router.get('/vehiculo/:id/marca', obtenerMarca);
router.get('/vehiculo/:id/modelo', obtenerModelo);
router.get('/vehiculo/:id/anio', obtenerAnio);
router.get('/vehiculo/:id/completo', obtenerVehiculoCompleto);
router.get('/vehiculo/:id/caracteristicas', obtenerCaracteristicas);


module.exports = router;
