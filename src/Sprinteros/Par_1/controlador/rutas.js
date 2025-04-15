//RUTA
const express = require('express');
const { 
    obtenerCiudadesPorPais, 
    obtenerProvinciasPorCiudad, 
    obtenerPaises, 
    obtenerDireccionPorAuto, 
    obtenerCiudadesPorCarro, // Asegúrate de importar esta función
    obtenerCarroConDireccion // Importa la función para manejar la nueva ruta
} = require('./controlCiudad');
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

// Rutas existentes
router.get('/direccion/auto/:idAuto', obtenerDireccionPorAuto);
router.get('/ciudades/:idPais', obtenerCiudadesPorPais);
router.get('/provincias/:idCiudad', obtenerProvinciasPorCiudad);
router.get('/paises', obtenerPaises);
router.get('/carro/direccion/:idCarro', obtenerCarroConDireccion);
router.get('/carro/ciudades/:idCarro', obtenerCiudadesPorCarro);

// Rutas relacionadas con vehículos
router.post('/validar-placa', validarPlaca);
router.get('/vehiculo/:id/placa', obtenerPlaca);
router.get('/vehiculo/:id/vim', obtenerVIM);
router.get('/vehiculo/:id/marca', obtenerMarca);
router.get('/vehiculo/:id/modelo', obtenerModelo);
router.get('/vehiculo/:id/anio', obtenerAnio);
router.get('/vehiculo/:id/completo', obtenerVehiculoCompleto);
router.get('/vehiculo/:id/caracteristicas', obtenerCaracteristicas);

module.exports = router;