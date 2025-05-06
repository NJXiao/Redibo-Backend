// backend/middlewares/validateNewCarFull.js

const Joi = require('joi');

const seguroAdicionalSchemaFrontend = Joi.object({
  // Espera 'id' desde el frontend
  id: Joi.number().integer().required().messages({
    'number.base': 'El ID del seguro adicional debe ser un número.',
    'number.integer': 'El ID del seguro adicional debe ser un entero.',
    'any.required': 'El ID del seguro adicional es requerido.',
  }),
  // Estos campos vienen del frontend pero no son usados directamente por el servicio de creación.
  // Los incluimos para validar la estructura completa recibida.
  nombre: Joi.string().required().messages({ // Asumiendo que el nombre siempre viene
      'string.base': 'El nombre del seguro debe ser texto.',
      'string.empty': 'El nombre del seguro no puede estar vacío.',
      'any.required': 'El nombre del seguro es requerido.',
  }),
  tipoSeguro: Joi.string().required().messages({ // Asumiendo que el tipo siempre viene
      'string.base': 'El tipo del seguro debe ser texto.',
      'string.empty': 'El tipo del seguro no puede estar vacío.',
      'any.required': 'El tipo del seguro es requerido.',
  }),
  empresa: Joi.string().required().messages({ // Asumiendo que la empresa siempre viene
      'string.base': 'La empresa del seguro debe ser texto.',
      'string.empty': 'La empresa del seguro no puede estar vacía.',
      'any.required': 'La empresa del seguro es requerida.',
  }),
  // Fecha inicio es requerida y debe ser formato ISO
  fechaInicio: Joi.date().iso().required().messages({
    'date.base': 'La fecha de inicio del seguro debe ser una fecha válida.',
    'date.format': 'La fecha de inicio del seguro debe estar en formato ISO (YYYY-MM-DD).',
    'any.required': 'La fecha de inicio del seguro es requerida.',
  }),
  // Fecha fin es opcional '?' en el frontend, pero la base de datos la requiere.
  // La validación del frontend DEBERÍA asegurar que se envía si el seguro está presente.
  // Aquí lo marcamos como requerido y que sea posterior a fechaInicio.
  fechaFin: Joi.date().iso().required().greater(Joi.ref('fechaInicio')).messages({
    'date.base': 'La fecha de fin del seguro debe ser una fecha válida.',
    'date.format': 'La fecha de fin del seguro debe estar en formato ISO (YYYY-MM-DD).',
    'any.required': 'La fecha de fin del seguro es requerida (si el seguro es añadido).',
    'date.greater': 'La fecha de fin del seguro debe ser posterior a la fecha de inicio.',
  }),
});

/**
 * Middleware para validar el cuerpo de la petición
 * antes de crear un carro completo.
 */
function validateNewCarFull(req, res, next) {
  const { error } = newCarSchema.validate(req.body, {
    abortEarly: false,
    convert:    true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map(detail => ({
        field:   detail.path.join('.'),
        message: detail.message,
      })),
    });
  }

  next();
}

module.exports = validateNewCarFull;
