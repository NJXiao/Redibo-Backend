///controllers/imageController.js

const imageService = require('../services/imageService');

/**
 * Obtiene las imágenes de un carro por su ID.
 * @route GET /api/v2/images/:carId
 */
async function getImagesByCarId(req, res) {
  const carId = Number(req.params.carId);
  try {
    const { success, data, total } = await imageService.getCarImages(carId);
    return res
      .status(200)
      .json({ success, data, total });
  } catch (error) {
    console.error('Error en getImagesByCarId:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Crea una nueva imagen asociada a un carro.
 * @route POST /api/v2/images/:carId
 */
async function createImage(req, res) {
  const carId = Number(req.params.carId);
  const fileBuffer = req.file && req.file.buffer;
  if (!fileBuffer) {
    return res.status(400).json({ success: false, error: 'No se proporcionó una imagen válida.' });
  }

  try {
    const { success, data } = await imageService.uploadCarImage(fileBuffer, carId);
    return res.status(201).json({ success, data });
  } catch (error) {
    console.error('Error en createImage:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Actualiza una imagen existente (sube una nueva y reemplaza).
 * @route PUT /api/v2/images/:imageId
 */
async function updateImage(req, res) {
  const imageId = Number(req.params.imageId);
  const fileBuffer = req.file && req.file.buffer;
  if (!fileBuffer) {
    return res.status(400).json({ success: false, error: 'No se proporcionó una imagen válida para actualizar.' });
  }

  try {
    // borramos la antigua y subimos la nueva
    const { success: deleted } = await imageService.deleteCarImage(imageId);
    if (!deleted) throw new Error('No se pudo eliminar la imagen anterior.');

    // obtenemos el carId de la imagen borrada para re-subir
    const carId = Number(req.body.carId);
    const { success, data } = await imageService.uploadCarImage(fileBuffer, carId);

    return res.status(200).json({ success, data });
  } catch (error) {
    console.error('Error en updateImage:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Elimina una imagen por su ID.
 * @route DELETE /api/v2/images/:imageId
 */
async function deleteImage(req, res) {
  const imageId = Number(req.params.imageId);
  try {
    const { success, message } = await imageService.deleteCarImage(imageId);
    return res.status(200).json({ success, message });
  } catch (error) {
    console.error('Error en deleteImage:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getImagesByCarId,
  createImage,
  updateImage,
  deleteImage,
};
