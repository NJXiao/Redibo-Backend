const express = require('express');
const { 
  listarSeguros, obtenerSeguro, crearSeguro, actualizarSeguro, eliminarSeguro,
  listarSegurosCarro, crearSeguroCarro, crearSegurosCarroBatch,
  obtenerSeguroCarro, actualizarSeguroCarro, eliminarSeguroCarro
} = require('../controllers/segurosController');
const { validateSeguro, validateSeguroCarro, validateSegurosBatch } = require('../middlewares/validateSeguro');

const router = express.Router();

// CRUD para tipos de Seguro
router.get('/seguros', listarSeguros);
router.get('/seguros/:id', validar => validar, obtenerSeguro);
router.post('/seguros', validateSeguro, crearSeguro);
router.put('/seguros/:id', validateSeguro, actualizarSeguro);
router.delete('/seguros/:id', eliminarSeguro);

// CRUD para pólizas individuales de carro
router.get('/carros/:id_carro/seguros', listarSegurosCarro);
router.post('/carros/:id_carro/seguros', validateSeguroCarro, crearSeguroCarro);
router.get('/carros/seguros/:id', obtenerSeguroCarro);
router.put('/carros/seguros/:id', validateSeguroCarro, actualizarSeguroCarro);
router.delete('/carros/seguros/:id', eliminarSeguroCarro);

// Batch: crear múltiples pólizas de seguro
router.post('/carros/:id_carro/seguros/batch', validateSegurosBatch, crearSegurosCarroBatch);

module.exports = router;