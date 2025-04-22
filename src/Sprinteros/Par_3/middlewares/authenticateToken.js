const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticar al usuario mediante un token JWT.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraer el token del encabezado

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  try {
    // Verificar el token y extraer los datos del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id_usuario: decoded.id_usuario, // ID del usuario
      id_usuario_rol: decoded.id_usuario_rol, // Rol del usuario
    };
    next(); // Continuar con la siguiente capa de middleware o controlador
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
  }
};

module.exports = authenticateToken;