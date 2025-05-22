const { body, param, validationResult } = require('express-validator');

/** Reglas para tipo Seguro */
const seguroRules = () => [
  body('empresa').isString().notEmpty(),
  body('nombre').isString().notEmpty(),
  body('tipoSeguro').isString().notEmpty()
];

/** Reglas para póliza individual */
const seguroCarroRules = () => [
  param('id_carro').isInt(),
  body('id_seguro').isInt(),
  body('fechaInicio').isISO8601(),
  body('fechaFin').isISO8601(),
  body('enlace').optional().isURL()
];

/** Reglas para batch */
const batchSegurosRules = () => [
  param('id_carro').isInt(),
  body().isArray({ min: 1 }).withMessage('Se requiere al menos un seguro'),
  body('*.id_seguro').isInt(),
  body('*.fechaInicio').isISO8601(),
  body('*.fechaFin').isISO8601(),
  body('*.enlace').optional().isURL()
];

const validate = (rules) => async (req, res, next) => {
  await Promise.all(rules().map(rule => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

module.exports = {
  validateSeguro: validate(seguroRules),
  validateSeguroCarro: validate(seguroCarroRules),
  validateSegurosBatch: validate(batchSegurosRules)
};

