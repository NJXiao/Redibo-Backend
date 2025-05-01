// backend/services/fullCarService.js

const prisma = require('../../../config/prisma');
const { CarServiceError } = require('../errors/customErrors');
const direccionService = require('./direccionService');
const imageService = require('./imageService');

/**
 * Crea un carro junto con sus imágenes asociadas.
 * @param {Object} carData - Datos del carro.
 * @param {Array<string>} imagesBase64 - Lista de imágenes en Base64.
 * @returns {Object} El carro creado junto con sus imágenes.
 */
async function createCarWithImages(carData, imagesBase64) {
  try {
    // 1. Crear solo el carro
    const newCar = await prisma.carro.create({
      data: carData,
    });

    // 2. Subir cada imagen a Cloudinary y guardar la URL en DB
    const uploadedImages = await Promise.all(
      imagesBase64.map(async (base64) => {
        const buffer = Buffer.from(base64, 'base64');
        const { data: savedImage } = await imageService.uploadCarImage(buffer, newCar.id);
        return savedImage;
      })
    );

    return { car: newCar, images: uploadedImages };
  } catch (error) {
    throw new CarServiceError(
      `Error al crear el carro con imágenes: ${error.message}`,
      'TRANSACTION_ERROR',
      error
    );
  }
}

/**
 * Crea un carro completo desde un DTO, gestionando todas las entidades y relaciones necesarias.
 * @param {Object} dto - Datos del carro y sus relaciones.
 * @returns {Object} El carro creado junto con sus relaciones e imágenes.
 */
async function createFullCar(dto) {
  const {
    direccion,
    carro,
    imagesBase64 = [],
    combustibles = [],
    caracteristicas = [],
  } = dto;

  // Validaciones básicas
  if (!Array.isArray(combustibles) || combustibles.some((id) => !Number.isInteger(id))) {
    throw new CarServiceError('Combustibles inválidos.', 'VALIDATION_ERROR');
  }
  if (!Array.isArray(caracteristicas) || caracteristicas.some((id) => !Number.isInteger(id))) {
    throw new CarServiceError('Características inválidas.', 'VALIDATION_ERROR');
  }

  console.info(`Iniciando creación de carro ${carro.vim}`);
  const start = Date.now();

  let newDireccion, newCar;
  try {
    // 1. Transacción para crear dirección + carro + relaciones sin imágenes
    const txResult = await prisma.$transaction(async (tx) => {
      const dir = await tx.direccion.create({ data: direccion });
      const c = await tx.carro.create({
        data: {
          ...carro,
          id_direccion: dir.id,
          combustiblesporCarro: {
            create: combustibles.map((idComb) => ({ id_combustible: idComb })),
          },
          caracteristicasAdicionalesCarro: {
            create: caracteristicas.map((idCar) => ({
              id_carasteristicasAdicionales: idCar,
            })),
          },
        },
        include: {
          combustiblesporCarro: { include: { combustible: true } },
          caracteristicasAdicionalesCarro: {
            include: { carasteristicasAdicionales: true },
          },
        },
      });
      return { dir, c };
    });

    newDireccion = txResult.dir;
    newCar = txResult.c;
  } catch (error) {
    console.error('Error en transacción fullCar:', error);
    if (error.code === 'P2002') {
      throw new CarServiceError('Violación de restricción única.', 'CONFLICT_ERROR', error);
    }
    throw new CarServiceError('Error al crear el carro completo.', 'TRANSACTION_ERROR', error);
  }

  // 2. Subir imágenes solo si la creación anterior fue exitosa
  let uploadedImages = [];
  if (imagesBase64.length) {
    try {
      uploadedImages = await Promise.all(
        imagesBase64.map(async (base64) => {
          const buffer = Buffer.from(base64, 'base64');
          const { data: img } = await imageService.uploadCarImage(buffer, newCar.id);
          return img;
        })
      );
    } catch (error) {
      // Aquí podrías decidir si revertir el carro/dirección o solo reportar el fallo
      console.error('Error al subir imágenes post-transaction:', error);
      throw new CarServiceError('Error al subir las imágenes del carro.', 'IMAGE_UPLOAD_ERROR', error);
    }
  }

  console.info(`fullCar completado en ${Date.now() - start} ms`);
  return {
    direccion: newDireccion,
    carro: newCar,
    images: uploadedImages,
  };
}

module.exports = { createCarWithImages, createFullCar };
