// src/Par_Insurance/services/insuranceService.js
const prisma = require('../../../config/prisma'); // Ajusta la ruta a tu config/prisma
const { Prisma } = require('@prisma/client');

// Define o importa tus errores personalizados si los tienes
class InsuranceServiceError extends Error {
    constructor(message, code, cause) {
        super(message);
        this.name = 'InsuranceServiceError';
        this.code = code; // e.g., 'NOT_FOUND', 'DB_ERROR', 'VALIDATION_ERROR'
        this.cause = cause; // Original error
        Error.captureStackTrace(this, this.constructor); // Captura el stack trace correctamente
    }
}

/**
 * Obtiene todos los tipos de seguro disponibles desde la base de datos.
 * @returns {Promise<Array<{id: number, nombre: string, tipoSeguro: string, empresa: string}>>}
 * @throws {InsuranceServiceError} Si ocurre un error en la base de datos.
 */
async function getAvailableInsuranceTypes() {
  console.info("Fetching available insurance types...");
  try {
    const seguros = await prisma.seguro.findMany({
      select: {
        id: true,
        nombre: true,
        tipoSeguro: true,
        empresa: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    console.info(`Found ${seguros.length} insurance types.`);
    return seguros;
  } catch (error) {
    console.error("Database error fetching insurance types:", error);
    throw new InsuranceServiceError('Error al obtener los tipos de seguro desde la base de datos.', 'DB_ERROR', error);
  }
}


/**
 * Vincula una lista de seguros adicionales a un carro existente dentro de una transacción Prisma.
 * @param {Prisma.TransactionClient} tx - El cliente de transacción de Prisma.
 * @param {number} carId - El ID del carro al que se vincularán los seguros.
 * @param {Array<{seguroId: number, fechaInicio: Date | string, fechaFin: Date | string}>} segurosData - Datos de los seguros (ya mapeados con seguroId).
 * @throws {InsuranceServiceError} Si ocurre un error durante la creación o validación.
 */
async function linkInsurancesToCar(tx, carId, segurosData) {
  if (!segurosData || !Array.isArray(segurosData) || segurosData.length === 0) {
    console.info(`No valid insurance data provided to link for car ID: ${carId}`);
    return; // No hay nada que hacer si no hay datos o no es un array
  }

  console.info(`Attempting to link ${segurosData.length} insurances to car ID: ${carId}`);

  try {
    const dataToCreate = segurosData.map((seguro, index) => {
      // Validación robusta de cada objeto de seguro
      if (!seguro || typeof seguro !== 'object') {
          throw new InsuranceServiceError(`Elemento inválido encontrado en el índice ${index} de segurosData.`, 'VALIDATION_ERROR');
      }
      if (!Number.isInteger(seguro.seguroId) || seguro.seguroId <= 0) {
        throw new InsuranceServiceError(`ID de seguro inválido (${seguro.seguroId}) en el índice ${index}.`, 'VALIDATION_ERROR');
      }
      if (!seguro.fechaInicio || !seguro.fechaFin) {
         throw new InsuranceServiceError(`Fechas de inicio o fin faltantes para el seguro ID ${seguro.seguroId} en el índice ${index}.`, 'VALIDATION_ERROR');
      }

      // Asegurarse que las fechas son objetos Date válidos para Prisma
      const fechaInicioDate = typeof seguro.fechaInicio === 'string' ? new Date(seguro.fechaInicio) : seguro.fechaInicio;
      const fechaFinDate = typeof seguro.fechaFin === 'string' ? new Date(seguro.fechaFin) : seguro.fechaFin;

       // Verificar si las fechas son válidas después de la conversión
       if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
             throw new InsuranceServiceError(`Fechas inválidas proporcionadas para el seguro ID ${seguro.seguroId} en el índice ${index}. Inicio: ${seguro.fechaInicio}, Fin: ${seguro.fechaFin}`, 'VALIDATION_ERROR');
        }
       // Verificar que fechaFin sea posterior a fechaInicio
        if (fechaFinDate <= fechaInicioDate) {
            throw new InsuranceServiceError(`La fecha de fin debe ser posterior a la fecha de inicio para el seguro ID ${seguro.seguroId} en el índice ${index}.`, 'VALIDATION_ERROR');
        }


      return {
        id_carro: carId,
        id_seguro: seguro.seguroId,
        fechaInicio: fechaInicioDate,
        fechaFin: fechaFinDate,
      };
    });

    // Usar createMany para insertar todos los registros de una vez
    const result = await tx.seguroCarro.createMany({
      data: dataToCreate,
      skipDuplicates: false, // Importante: Falla si intentas insertar un duplicado (misma combinación carro-seguro)
    });

    console.info(`Successfully created ${result.count} SeguroCarro records for car ID: ${carId}`);

  } catch (error) {
    console.error(`Error linking insurances for car ID ${carId}:`, error);
    if (error instanceof InsuranceServiceError) throw error; // Re-lanzar si ya es nuestro error

    // Manejo específico de errores Prisma
    if (error.code === 'P2003' && error.meta?.field_name?.includes('id_seguro')) {
        // Error de clave foránea: el id_seguro no existe en la tabla Seguro
        throw new InsuranceServiceError(`Error al vincular seguro: Uno o más tipos de seguro proporcionados no existen en la base de datos. Verifique los IDs. Código Prisma: ${error.code}`, 'NOT_FOUND_RELATED', error);
    }
     if (error.code === 'P2002') {
        // Violación de constraint único (ej. intentar añadir el mismo seguro al mismo carro dos veces en la misma llamada)
         throw new InsuranceServiceError(`Error al vincular seguro: Se intentó añadir el mismo seguro al vehículo más de una vez. Código Prisma: ${error.code}`, 'CONFLICT_ERROR', error);
     }

    // Error genérico
    throw new InsuranceServiceError(`Error inesperado al crear los registros de seguros para el carro ${carId}.`, 'DB_LINK_ERROR', error);
  }
}


module.exports = {
    getAvailableInsuranceTypes,
    linkInsurancesToCar,
    InsuranceServiceError // Exportar el error personalizado si es necesario en otros lugares
};