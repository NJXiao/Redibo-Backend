const Joi = require('joi');

/*const seguroAdicionalSchemaFrontend = Joi.object({
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
 * Esquema de validación para un carro completo con Joi.
 */
const newCarSchema = Joi.object({
  id_provincia: Joi.number().integer().required(),
  calle: Joi.string().required(),
  zona: Joi.string().required(),
  num_casa: Joi.string().allow(null, ''),

  vim: Joi.string().required(),
  año: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  marca: Joi.string().required(),
  modelo: Joi.string().required(),
  placa: Joi.string().required(),
 
  combustibleIds: Joi.array().items(Joi.number().integer()).min(1).required(),
  extraIds: Joi.array().items(Joi.number().integer()).min(0).required(),

  asientos: Joi.number().integer().min(1).required(),
  puertas:  Joi.number().integer().min(1).required(),
  soat:     Joi.boolean().required(),
  precio_por_dia: Joi.number().precision(2).required(),
  num_mantenimientos: Joi.number().integer().min(0).required(),
  transmicion: Joi.string().valid('Manual', 'Automatica').required(),
  estado: Joi.string().required(),
  descripcion: Joi.string().allow(null, ''),
  //segurosAdicionales: Joi.array()
   // .items(
      //Joi.object({
        //id: Joi.number().integer().required().messages({ /* ... */ }),
        //nombre: Joi.string().required().messages({ /* ... */ }),
        //tipoSeguro: Joi.string().required().messages({ /* ... */ }),
        //empresa: Joi.string().required().messages({ /* ... */ }),
       // fechaInicio: Joi.date().iso().required().messages({ /* ... */ }),
        //fechaFin: Joi.date().iso().required().greater(Joi.ref('fechaInicio')).messages({ /* ... */ }),
      //})
    //)
    //.optional()
    //.default([]),*/
});

/**
 * Middleware para validar que el objeto recibido cumple con el esquema definido.
 */
const validateNewCarFull = (req, res, next) => {
  const { error } = newCarSchema.validate(req.body, { abortEarly: false, convert: true });

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }

  next();
};

module.exports = validateNewCarFull;