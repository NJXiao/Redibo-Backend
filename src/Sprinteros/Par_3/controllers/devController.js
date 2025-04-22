const jwt = require('jsonwebtoken');

/**
 * Controlador para generar tokens de desarrollo
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const generateDevToken = (req, res) => {
  try {
    // Usar un valor de respaldo para JWT_SECRET si no está definido
    const jwtSecret = process.env.JWT_SECRET || 'dev-secret-key';

    const token = jwt.sign(
      {
        id_usuario: 1,      // Usuario estático para desarrollo
        id_usuario_rol: 2,  // Rol de host
      },
      jwtSecret,
      { expiresIn: '24h' }  // Token válido por 24 horas
    );

    res.json({ 
      success: true, 
      token,
      message: 'Token de desarrollo generado exitosamente'
    });
  } catch (error) {
    console.error('Error al generar token de desarrollo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al generar token de desarrollo',
      error: error.message 
    });
  }
};

module.exports = {
  generateDevToken
};