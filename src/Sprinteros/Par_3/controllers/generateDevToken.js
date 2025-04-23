const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Carga las variables de entorno desde .env
dotenv.config();

/**
 * Controlador para generar un token de desarrollo
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const generateDevToken = (req, res) => {
  console.log('Generando token de desarrollo...');
  const userId = 1; // ID del usuario estático para desarrollo
  console.log('ID del usuario:', userId);

  // Crear el payload para el token
  const payload = {
    id_usuario: userId,
    id_usuario_rol: 2, // Rol de host
  };
  console.log('Payload:', payload);

  // Obtener la clave secreta para firmar el token
  const secretKey = process.env.JWT_SECRET || 'dev-secret-key'; // Clave secreta con respaldo
  const options = {
    expiresIn: '1h', // Token válido por 1 hora
  };

  if (!secretKey) {
    return res.status(500).json({
      success: false,
      message: 'JWT_SECRET no está definida en las variables de entorno',
    });
  }

  try {
    // Generar el token
    const token = jwt.sign(payload, secretKey, options);
    console.log('Token generado:', token);
    res.status(200).json({
      success: true,
      token,
      message: 'Token de desarrollo generado exitosamente',
    });
  } catch (error) {
    console.error('Error al generar el token:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el token de desarrollo',
      error: error.message,
    });
  }
};

module.exports = {
  generateDevToken,
};
