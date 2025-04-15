//RUTA
const express = require('express');
const { 
    obtenerCiudadesPorPais, 
    obtenerProvinciasPorCiudad, 
    obtenerPaises, 
    obtenerDireccionPorAuto 
} = require('./controlCiudad');
const { validarPlaca } = require('./validarPlaca');
const {
    obtenerVehiculoCompleto, obtenerCaracteristicas // 👈 nuevo import
  } = require('./vehiculo.controlador');

const router = express.Router();

router.get('/direccion/auto/:idAuto', obtenerDireccionPorAuto);
router.get('/ciudades/:idPais', obtenerCiudadesPorPais);
router.get('/provincias/:idCiudad', obtenerProvinciasPorCiudad);
router.get('/paises', obtenerPaises);

router.post('/validar-placa', validarPlaca);
router.get('/vehiculo/:id/completo', obtenerVehiculoCompleto);
router.get('/vehiculo/:id/caracteristicas', obtenerCaracteristicas);

module.exports = router;