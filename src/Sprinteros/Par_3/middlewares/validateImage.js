// backend/middlewares/validateImage.js

const multer = require('multer');

// Configuración de multer para manejar archivos en memoria
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('El archivo debe ser una imagen válida.'));
    }
    cb(null, true);
  },
}).single('image'); // El campo 'image'

/**
 * Middleware para validar imágenes antes de procesarlas.
 */
function validateImage(req, res, next) {
  upload(req, res, (err) => {
    if (err) {
      const msg =
        err instanceof multer.MulterError
          ? 'La imagen excede el tamaño máximo permitido de 2MB.'
          : err.message;
      return res.status(400).json({ success: false, error: msg });
    }
    next();
  });
}

module.exports = validateImage;
