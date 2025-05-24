// src/Par_Insurance/controllers/insuranceController.js
const asyncHandler = require('express-async-handler');
const insuranceService = require('../services/insuranceService'); // Importa el servicio de seguros

/**
 * @desc    Obtener todos los tipos de seguro disponibles
 * @route   GET /api/(version)/insurance/types  (ej. /api/v4/insurance/types)
 * @access  Public (o Privado)
 */
const getInsuranceTypesHandler = asyncHandler(async (req, res) => {
  const seguros = await insuranceService.getAvailableInsuranceTypes();

  res.status(200).json({
    success: true,
    count: seguros.length,
    data: seguros,
  });
});

// Puedes añadir más handlers aquí si necesitas otras operaciones de seguros
// ej. getInsuranceForCarHandler(req, res) -> obtener los seguros de un carro específico

module.exports = {
  getInsuranceTypesHandler,
};