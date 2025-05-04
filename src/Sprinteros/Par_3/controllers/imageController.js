// backend/controllers/imageController.js

const {
    uploadCarImage,
    getCarImages,
    deleteCarImage,
  } = require('../services/imageService');
  const asyncHandler = require('../middlewares/asyncHandler');
  
  exports.getImagesByCarId = asyncHandler(async (req, res) => {
    const carId = Number(req.params.carId);
    // opcional: paginación vía query ?page=1&pageSize=20
    const page     = parseInt(req.query.page)     || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
  
    const result = await getCarImages(carId, { page, pageSize });
    res.json(result);
  });
  
  exports.createImage = asyncHandler(async (req, res) => {
    const carId = Number(req.params.carId);
    // validateImage ya llenó req.file.buffer
    const { success, data: image } = await uploadCarImage(req.file.buffer, carId);
    res.status(201).json({ success, image });
  });
  
  /**
   * Reemplaza una imagen existente:
   * 1. Sube la nueva
   * 2. Actualiza ese registro en BD con la URL y public_id nuevos
   * 3. Elimina el asset antiguo de Cloudinary
   */
  exports.updateImage = asyncHandler(async (req, res) => {
    const imageId = Number(req.params.imageId);
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'No hay archivo en la petición' });
    }
  
    // 1) obtenemos la fila actual para recuperar public_id y carId
    const existing = await require('../services/imageService').prisma.imagen.findUnique({
      where: { id: imageId },
      select: { public_id: true, id_carro: true }
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada' });
    }
  
    // 2) subimos la nueva
    const { data: uploadResult } = await uploadCarImage(req.file.buffer, existing.id_carro);
  
    // 3) actualizamos el registro
    const updated = await require('../services/imageService').prisma.imagen.update({
      where: { id: imageId },
      data: {
        data:      uploadResult.data,
        public_id: uploadResult.public_id,
        width:     uploadResult.width,
        height:    uploadResult.height,
        format:    uploadResult.format,
      },
    });
  
    // 4) eliminamos el asset antiguo
    await require('../config/cloudinary').uploader.destroy(existing.public_id);
  
    res.json({ success: true, image: updated });
  });
  
  exports.deleteImage = asyncHandler(async (req, res) => {
    const imageId = Number(req.params.imageId);
    await deleteCarImage(imageId);
    res.status(204).end();
  });
  