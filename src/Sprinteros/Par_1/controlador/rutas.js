//RUTA
const express = require('express');
const router = express.Router();
const { 
    obtenerCiudadesPorPais, 
    obtenerProvinciasPorCiudad, 
    obtenerPaises, 
    obtenerDireccionPorAuto, 
    obtenerCiudadesPorCarro, // Asegúrate de importar esta función
    obtenerCarroConDireccion // Importa la función para manejar la nueva ruta
} = require('./controlCiudad');
const { validarPlaca } = require('./validarPlaca');
const {  obtenerVehiculoCompleto,
         obtenerCaracteristicas, 
         obtenerCaracteristicasAdicionales} = require('./vehiculo.controlador');


const { actualizarVehiculo } = require('./vehiculo.controlador');
// Rutas existentes
router.get('/direccion/auto/:idAuto', obtenerDireccionPorAuto);
router.get('/ciudades/:idPais', obtenerCiudadesPorPais);
router.get('/provincias/:idCiudad', obtenerProvinciasPorCiudad);
router.get('/paises', obtenerPaises);
router.get('/carro/direccion/:idCarro', obtenerCarroConDireccion);
router.get('/carro/ciudades/:idCarro', obtenerCiudadesPorCarro);

// Rutas relacionadas con vehículos GET
router.post('/validar-placa', validarPlaca);
router.get('/vehiculo/:id/completo', obtenerVehiculoCompleto);
router.get('/vehiculo/:id/caracteristicas', obtenerCaracteristicas);
router.get('/vehiculo/:id/caracteristicas-adicionales', obtenerCaracteristicasAdicionales);
//PUT
router.put('/vehiculo/:id', actualizarVehiculo);
module.exports = router;