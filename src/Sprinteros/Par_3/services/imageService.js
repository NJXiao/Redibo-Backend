// backend/services/imageService.js

const cloudinary = require('../../config/cloudinary');
const { PrismaClient } = require('@prisma/client');
const { Readable } = require('stream');

const prisma = new PrismaClient();

/**
 * Sube una imagen a Cloudinary y guarda la URL + public_id en la base de datos
 * @param {Buffer} imageBuffer
 * @param {number} carId
 * @returns {Promise<{ success: boolean, data: import('@prisma/client').Imagen }>}
 */
async function uploadCarImage(imageBuffer, carId) {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    throw new Error('Buffer de imagen inválido');
  }
  if (!Number.isInteger(carId)) {
    throw new Error('CarId inválido');
  }

  // subimos al folder /car-images/{carId}
  const folderPath = `car-images/${carId}`;
  let uploadResult;
  try {
    uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folderPath,
          resource_type: 'image',
        },
        (err, result) => err ? reject(err) : resolve(result)
      );
      Readable.from(imageBuffer).pipe(stream);
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw new Error('Error al subir imagen a Cloudinary');
  }

  // guardamos en BD con transacción por si falla algo luego
  let savedImage;
  try {
    await prisma.$transaction(async (tx) => {
      savedImage = await tx.imagen.create({
        data: {
          data: uploadResult.secure_url,
          public_id: uploadResult.public_id,   // NUEVO campo en el modelo
          id_carro: carId,
          width: uploadResult.width,           // opcional
          height: uploadResult.height,
          format: uploadResult.format,
        },
      });
    });
  } catch (err) {
    console.error('Prisma create error:', err);
    // opcional: limpiar asset subido en Cloudinary si falla la BD
    await cloudinary.uploader.destroy(uploadResult.public_id);
    throw new Error('Error al guardar imagen en base de datos');
  }

  return { success: true, data: savedImage };
}

/**
 * Obtiene imágenes de un carro (con opción de paginar)
 * @param {number} carId
 * @param {object} options { page: number, pageSize: number }
 */
async function getCarImages(carId, { page = 1, pageSize = 20 } = {}) {
  if (!Number.isInteger(carId)) {
    throw new Error('CarId inválido');
  }
  const skip = (page - 1) * pageSize;

  const [ total, data ] = await Promise.all([
    prisma.imagen.count({ where: { id_carro: carId } }),
    prisma.imagen.findMany({
      where: { id_carro: carId },
      orderBy: { id: 'asc' },
      skip,
      take: pageSize,
    })
  ]);

  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  };
}

/**
 * Elimina una imagen de Cloudinary (usando el public_id guardado) y de la BD
 * @param {number} imageId
 */
async function deleteCarImage(imageId) {
  if (!Number.isInteger(imageId)) {
    throw new Error('ImageId inválido');
  }

  // buscamos primero
  const image = await prisma.imagen.findUnique({
    where: { id: imageId },
    select: { public_id: true }
  });
  if (!image) {
    const msg = `Imagen con ID ${imageId} no encontrada`;
    console.warn(msg);
    throw new Error(msg);
  }

  // destruimos en Cloudinary y en BD dentro de una transacción
  try {
    await prisma.$transaction(async (tx) => {
      await cloudinary.uploader.destroy(image.public_id);
      await tx.imagen.delete({ where: { id: imageId } });
    });
  } catch (err) {
    console.error('Error al eliminar imagen:', err);
    throw new Error('Error al eliminar imagen');
  }

  return { success: true, message: 'Imagen eliminada correctamente' };
}

module.exports = {
  uploadCarImage,
  getCarImages,
  deleteCarImage,
};
