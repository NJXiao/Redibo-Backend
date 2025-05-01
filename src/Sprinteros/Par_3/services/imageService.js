// backend/services/imageService.js

import cloudinary from '../config/cloudinary';
import { PrismaClient } from '@prisma/client';
import { Readable } from 'stream';
import { URL } from 'url';

const prisma = new PrismaClient();

/**
 * Extrae el public_id de Cloudinary a partir de la URL
 * @param {string} imageUrl 
 * @returns {string} publicId (p. ej. 'car-images/abc123_def')
 */
function extractPublicId(imageUrl) {
  try {
    const parsed = new URL(imageUrl);
    // path: '/di86sws6b/image/upload/v1610000000/car-images/abc123_def.jpg'
    const parts = parsed.pathname.split('/');
    // eliminar 'v{timestamp}'
    const withoutVersion = parts.filter(p => !/^v\d+$/.test(p));
    // quedarnos desde 'car-images/...'
    const idx = withoutVersion.indexOf('car-images');
    const publicPath = withoutVersion.slice(idx).join('/');
    // quitar extensión
    return publicPath.replace(/\.[a-zA-Z]+$/, '');
  } catch {
    return null;
  }
}

/**
 * Sube una imagen a Cloudinary y guarda la URL en la base de datos
 * @param {Buffer} imageBuffer - Buffer de la imagen
 * @param {number} carId - ID del carro asociado a la imagen
 * @returns {Promise<{ success: boolean, data: import('@prisma/client').Imagen }>}
 */
export async function uploadCarImage(imageBuffer, carId) {
  try {
    // 1. Subir la imagen a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'car-images',
          resource_type: 'image',
        },
        (error, res) => {
          if (error) return reject(error);
          resolve(res);
        }
      );

      Readable.from(imageBuffer).pipe(uploadStream);
    });

    // 2. Guardar sólo la URL en la base de datos
    const savedImage = await prisma.imagen.create({
      data: {
        data: result.secure_url, 
        id_carro: carId,
      },
    });

    return { success: true, data: savedImage };
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw new Error('Error al procesar la imagen');
  }
}

/**
 * Obtiene las imágenes de un carro específico
 * @param {number} carId 
 * @returns {Promise<{ success: boolean, data: import('@prisma/client').Imagen[], total: number }>}
 */
export async function getCarImages(carId) {
  try {
    const images = await prisma.imagen.findMany({
      where: { id_carro: carId },
      orderBy: { id: 'asc' },
    });
    return { success: true, data: images, total: images.length };
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    throw new Error('Error al recuperar las imágenes');
  }
}

/**
 * Elimina una imagen de Cloudinary y de la base de datos
 * @param {number} imageId 
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteCarImage(imageId) {
  try {
    // 1. Obtener la imagen para conseguir la URL
    const image = await prisma.imagen.findUnique({
      where: { id: imageId },
    });
    if (!image) {
      throw new Error('Imagen no encontrada');
    }

    // 2. Extraer public_id y eliminar de Cloudinary (si lo logramos)
    const publicId = extractPublicId(image.data || '');
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // 3. Eliminar la referencia de la base de datos
    await prisma.imagen.delete({ where: { id: imageId } });

    return { success: true, message: 'Imagen eliminada correctamente' };
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw new Error('Error al eliminar la imagen');
  }
}
