const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { generateToken } = require('../services/jwtService');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

const prisma = new PrismaClient();

const generateRecoveryCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errores: errors.array()[0] });
  }
  try {
    const userData = req.body;
    let { nombre, correo, fechaNacimiento, genero, ciudad, contrasena, telefono, rol } = userData;
    // Validar rol recibido
    const rolesValidos = ['HOST', 'RENTER', 'DRIVER'];
    if (!rol || !rolesValidos.includes(rol)) {
      return res.status(400).json({ error: 'El rol debe ser HOST, RENTER o DRIVER' });
    }
    // Buscar ID del rol en la base de datos
    const rolData = await prisma.rol.findFirst({ where: { rol } });
    if (!rolData) {
      return res.status(400).json({ error: 'Rol no encontrado en base de datos' });
    }
    // Verificar si el correo ya existe
    const existingEmail = await prisma.usuario.findFirst({
      where: { correo }
    });
    
    if (existingEmail) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    
    // Verificar si el teléfono ya existe
    const existingPhone = await prisma.usuario.findFirst({
      where: { telefono }
    });
    
    if (existingPhone) {
      return res.status(400).json({ error: 'El teléfono ya está registrado' });
    }
    
    // Validar edad (mayor de 18)
    const birthDate = new Date(userData.fechaNacimiento);
    // Determinar tipo de registro
    const isGoogleAuth = userData.contrasena == undefined;
    
    let newUser;

    if (isGoogleAuth) {
      // Registro con Google
      newUser = await prisma.usuario.create({
        data: {
          nombre,
          correo,
          fecha_nacimiento: birthDate,
          genero,
          id_ciudad: parseInt(userData.ciudad),
          foto: userData.foto,
          telefono
        }
      });
    } else {
      // Validar contraseña para registro normal
      const { contrasena } = userData;
      
      if (!contrasena) {
        return res.status(400).json({ error: 'La contraseña es obligatoria' });
      }
      
      
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      const usuario = {}; // Inicializar objeto usuario
      usuario.primer_nombre = userData.nombre.split(" ")[0]; // Solo el primer nombre
      usuario.primer_apellido = userData.nombre.split(" ")[1]; // Solo el primer apellido
      // Crear usuario normal
      newUser = await prisma.usuario.create({
        data: {
          nombre,
          correo,
          fecha_nacimiento: new Date(userData.fechaNacimiento),
          genero,
          id_ciudad: parseInt(userData.ciudad),
          contraseña: hashedPassword,
          telefono,
          foto: `https://ui-avatars.com/api/?name=${usuario.primer_nombre}+${usuario.primer_apellido}`
        }
      });
    }
    
    // Asignar el rol al usuario
     await prisma.usuarioRol.create({
      data: {
        id_usuario: newUser.id,
        id_rol: rolData.id
      }
    });
    
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: newUser.id
    });
    
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Función para completar registro con Google
exports.completeGoogleRegistration = async (req, res) => {
  const { nombre, correo, fechaNacimiento, genero, ciudad, foto, telefono, rol } = req.body;

  try {
    // Validar rol recibido
    const rolesValidos = ['HOST', 'RENTER', 'DRIVER'];
    if (!rol || !rolesValidos.includes(rol)) {
      return res.status(400).json({ error: 'El rol debe ser HOST, RENTER o DRIVER' });
    }
    // Buscar ID del rol
    const rolData = await prisma.rol.findFirst({ where: { rol } });
    if (!rolData) {
      return res.status(400).json({ error: 'Rol no encontrado en base de datos' });
    }
    // Verificar si el correo ya está registrado
    const correoExistente = await prisma.usuario.findFirst({
      where: { correo }
    });

    if (correoExistente) {
      return res.status(400).json({ 
        error: 'El correo ya está registrado', 
        campo: 'correo' 
      });
    }

    // Verificar si el teléfono ya está registrado
    const telefonoExistente = await prisma.usuario.findFirst({
      where: { telefono }
    });

    if (telefonoExistente) {
      return res.status(400).json({ 
        error: 'El teléfono ya está registrado', 
        campo: 'telefono' 
      });
    }
    
    // Validar edad (mayor de 18)
    console.log("🔍 Datos recibidos en el backend:", {
      nombre, correo, fechaNacimiento, genero, ciudad, foto, telefono, rol
    });
    
    const birthDate = new Date(fechaNacimiento);
    if (isNaN(birthDate.getTime())) {
      console.error("❌ Fecha inválida:", fechaNacimiento);
      return res.status(400).json({ error: 'La fecha de nacimiento no es válida' });
    }

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        fecha_nacimiento: birthDate,
        genero,
        id_ciudad: parseInt(ciudad),
        foto,
        telefono
      }
    });

    // Asignar rol al usuario
    const usuarioRol = await prisma.usuarioRol.create({
      data: {
        id_usuario: nuevoUsuario.id,
        id_rol: rolData.id
      }
    });

    // Generar token con el nombre del rol
    const token = generateToken({
      id: nuevoUsuario.id,
      correo: nuevoUsuario.correo,
      roles: [rolData.rol]
    });

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo
      },
      token
    });
  } catch (error) {
    console.error('Error al completar registro con Google:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para iniciar sesión con correo y contraseña
exports.loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await prisma.usuario.findFirst({
      where: { correo },
      select: {
        id: true,
        nombre: true,
        correo: true,
        contraseña: true,
        telefono: true,
        fecha_nacimiento: true,
        genero: true,
        foto: true,
        google_id: true,
        ciudad: {
          select: {
            nombre: true
          }
        },
        roles: {
          select: {
            rol: {
              select: {
                rol: true
              }
            }
          }
        }
      }
    });

    if (!usuario || !usuario.contraseña) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordMatch = await bcrypt.compare(contrasena, usuario.contraseña);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Obtener roles del usuario
    const roles = usuario.roles.map(userRole => userRole.rol.rol);
    console.log("Roles del usuario:", roles);
    // Generar token JWT
    const token = generateToken({
      id: usuario.id,
      correo: usuario.correo,
      roles
    });
    return res.json({
      usuario: {
        // id: usuario.id,
        nombre: usuario.nombre,
        // correo: usuario.correo,
        // telefono: usuario.telefono || "No especificado",
        // fecha_nacimiento: usuario.fecha_nacimiento 
        //   ? new Date(usuario.fecha_nacimiento).toISOString()
        //   : "No especificada",
        // genero: usuario.genero || "No especificado",
        // ciudad: usuario.ciudad.nombre,
        foto: usuario.foto
        // roles: roles || []
      },
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.googleCallback = (req, res) => {
  try {
    //console.log("Google callback ejecutado", req.user);
    
    // Verificar si tenemos datos de usuario
    if (!req.user) {
      console.error("No se recibieron datos de usuario en el callback de Google");
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user_data`);
    }
    
    // Si el usuario necesita completar su perfil
    if (req.user.isIncomplete) {
      //console.log("Usuario con perfil incompleto:", req.user.correo);
      
      const nombre = req.user.nombre;
      const email = req.user.correo;
      const foto = req.user.foto;
      
      // Crear token para completar registro
      const token = jwt.sign(
        { nombre, email, foto },
        process.env.JWT_SECRET, 
        { expiresIn: '15m' } // Aumentamos a 15 minutos
      );
      const cookieOptions = {
        httpOnly: true, // Previene acceso desde JS
        secure: process.env.NODE_ENV === 'production', // true en producción
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 900000, // 5 minutos
        //path: '/',
        domain: process.env.COOKIE_DOMAIN || 'localhost' // Define COOKIE_DOMAIN en .env
      };
  
      // Establecer cookie con el token
      res.cookie('temp_auth', token, cookieOptions);
      
      // También pasar token como parámetro de URL como respaldo
      return res.redirect(`${process.env.FRONTEND_URL}/login/completeRegister?token=${token}`);
    }
    
    // Usuario existente con perfil completo
    //console.log("Usuario con perfil completo:", req.user.correo);
    console.log("Datos del rol:", req.user.roles);
    const userData = {
      nombre: req.user.nombre,
      // correo: req.user.correo,
      // telefono: req.user.telefono || "No especificado",
      // fecha_nacimiento: req.user.fecha_nacimiento 
      //   ? new Date(req.user.fecha_nacimiento).toISOString()
      //   : "No especificada",
      // genero: req.user.genero || "No especificado",
      // ciudad: req.user.ciudad,
      foto: req.user.foto
      // roles: req.user.roles || []
    };
    //console.log(userData)
    const token = generateToken({
      id: req.user.id,
      correo: req.user.correo,
      roles: req.user.roles
    });

    // 2. Codificar datos para URL
    const encodedData = Buffer.from(JSON.stringify(userData)).toString('base64');

    // 3. Redirigir con parámetros
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?token=${token}&data=${encodedData}`
    );

    
  } catch (error) {
    console.error("Error en Google callback:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_error`);
  }
};

// Obtener perfil del usuario autenticado
exports.getUserProfile = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        correo: true,
        fecha_nacimiento: true,
        genero: true,
        telefono: true,
        foto: true,
        id_ciudad: true,
        ciudad: {
          select: {
            nombre: true
          }
        },
        roles: {
          select: {
            rol: {
              select: {
                rol: true
              }
            }
          }
        }
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const roles = usuario.roles.map(userRole => userRole.rol.rol);
    return res.json({ ...usuario, roles });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Función para completar perfil de usuario (Google u otros métodos)
exports.completeUserProfile = async (req, res) => {
  try {
    console.log('Datos recibidos' , req.body)
    const { 
      correo,          // ID del usuario existente a actualizar
      fechaNacimiento, 
      genero, 
      ciudad, 
      telefono, 
      rol 
    } = req.body;

    // Validar rol
    const rolesValidos = ['HOST', 'RENTER', 'DRIVER'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ error: 'El rol debe ser HOST, RENTER o DRIVER' });
    }
    //console.log(req.body)
    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { correo: correo }
    });
    console.log('Perfil completado exitosamente')
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Verificar si el teléfono ya existe en otro usuario
    const telefonoExistente = await prisma.usuario.findFirst({
      where: { 
        telefono,
        id: { not: usuario.id } // Excluir el usuario actual
      }
    });
    
    if (telefonoExistente) {
      return res.status(400).json({ error: 'El teléfono ya está registrado' });
    }
    // Buscar ID del rol en la base de datos
    const rolData = await prisma.rol.findFirst({ where: { rol } });
    if (!rolData) {
      return res.status(400).json({ error: 'Rol no encontrado en base de datos' });
    }
    const birthDate = new Date(fechaNacimiento);
    // Actualizar perfil del usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: usuario.id },
      data: { 
        fecha_nacimiento: birthDate,
        genero,
        ciudad: {
          connect: { id: ciudad }
        },
        telefono
        //perfil_completo: true
      }
    });

    // Verificar si ya tiene el rol asignado
    const rolExistente = await prisma.usuarioRol.findFirst({
      where: {
        id_usuario: usuario.id,
        id_rol: rolData.id
      }
    });

    // Asignar rol al usuario si no lo tiene
    if (!rolExistente) {
      await prisma.usuarioRol.create({
        data: {
          id_usuario: usuario.id,
          id_rol: rolData.id
        }
      });
    }

    // Obtener todos los roles del usuario
    const usuarioRoles = await prisma.usuarioRol.findMany({
      where: { id_usuario: usuario.id },
      include: { rol: true }
    });
    const roles = usuarioRoles.map(userRole => userRole.rol.rol);
    if (!roles || roles.length === 0) {
      console.error("❌ El usuario no tiene roles asignados");
      return res.status(400).json({ error: "El usuario no tiene roles asignados" });
    }
    // Generar token con los roles
    const token = generateToken({
      id: usuarioActualizado.id,
      correo: usuarioActualizado.correo,
      roles: roles
    });
    const nombreCiudad = await prisma.ciudad.findFirst({
      where: { 
        id: ciudad // Excluir el usuario actual
      }
    });
    console.log(nombreCiudad)
    return res.status(200).json({
      mensaje: 'Perfil completado exitosamente',
      usuario: {
        nombre: usuarioActualizado.nombre,
        correo: usuarioActualizado.correo,
        fecha_nacimiento: usuarioActualizado.fecha_nacimiento,
        genero: usuarioActualizado.genero,
        ciudad: nombreCiudad.nombre,
        foto: usuarioActualizado.foto,
        telefono: usuarioActualizado.telefono
      },
      token
    });
  } catch (error) {
    console.error('Error al completar perfil de usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Endpoint para verificar si un usuario específico necesita completar su perfil
exports.checkProfileStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        nombre: true,
        correo: true,
        foto: true,
        fecha_nacimiento: true,
        genero: true,
        telefono: true,
        id_ciudad: true,
        roles: {
          select: {
            id: true // o el campo que necesites validar
          }
        }
      }
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Verificar si hay campos vacíos o nulos

    const camposRequeridos = [
      usuario.fecha_nacimiento,
      usuario.genero,
      usuario.telefono,
      usuario.id_ciudad
    ];
    
    const isIncomplete = camposRequeridos.some(campo => campo === null || campo === "" || campo === undefined) || !usuario.roles?.length;
    return res.status(200).json({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      foto: usuario.foto,
      isIncomplete
    });
  } catch (error) {
    console.error('Error al verificar estado del perfil:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
// Verificar si el perfil está completo usando el correo electrónico
exports.checkProfileByEmail = async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);

    const usuario = await prisma.usuario.findUnique({
      where: { correo: email },
      select: {
        id: true,
        nombre: true,
        correo: true,
        foto: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ perfilCompleto: false });
    }

    // ✅ El usuario existe = perfil completo
    return res.status(200).json({ perfilCompleto: true });
  } catch (error) {
    console.error("Error al verificar perfil por email:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// función checkTokenCompleteRegister
exports.checkTokenCompleteRegister = async (req, res) => {
  try {
    //console.log("Validando token para completar registro");
    //console.log("Cookies recibidas:", req.cookies);
    //console.log("Query params:", req.query);
    
    // Intentar obtener el token de varias fuentes
    const token = req.cookies.temp_auth || req.query.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      //console.log("No se encontró token en la solicitud");
      return res.status(401).json({
        success: false,
        message: 'No se encontró token de autenticación'
      });
    }
    
    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Token verificado correctamente:", decoded);
    //res.header('Access-Control-Allow-Credentials', 'true');
    // Devolver datos del usuario
    res.json({
      success: true,
      nombre: decoded.nombre,
      email: decoded.email,
      foto: decoded.foto
    });
    
  } catch (error) {
    console.error('Error al validar token:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

exports.requestRecoveryCode = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ error: 'El correo electrónico es requerido' });
    }

    // Verificar si el correo existe
    const usuario = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Correo electrónico no registrado' });
    }

    const codigo = generateRecoveryCode();
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Invalidar códigos anteriores
    await prisma.passwordRecoveryCode.updateMany({
      where: { id_usuario: usuario.id, used: false },
      data: { used: true }
    });

    // Crear nuevo código
    await prisma.passwordRecoveryCode.create({
      data: {
        id_usuario: usuario.id,
        correo,
        codigo,
        expires_at: expiresAt,
      }
    });

    await emailService.sendRecoveryCode(correo, codigo);

    return res.status(200).json({
      success: true,
      message: 'Código de verificación enviado correctamente'
    });
  } catch (error) {
    console.error('Error al solicitar código de recuperación:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Verificar código de recuperación
exports.verifyRecoveryCode = async (req, res) => {
  try {
    const { correo, codigo } = req.body;

    if (!correo || !codigo) {
      return res.status(400).json({ error: 'Correo y código son requeridos' });
    }

    // Buscar el código válido más reciente
    const recoveryCode = await prisma.passwordRecoveryCode.findFirst({
      where: {
        correo,
        codigo,
        used: false,
        expires_at: {
          gt: new Date()
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (!recoveryCode) {
      return res.status(400).json({ error: 'Código inválido o expirado' });
    }

    return res.status(200).json({
      success: true,
      message: 'Código verificado correctamente'
    });
  } catch (error) {
    console.error('Error al verificar código:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Restablecer contraseña
exports.resetPassword = async (req, res) => {
  try {
    const { correo, codigo, nuevaContrasena } = req.body;

    if (!correo || !codigo || !nuevaContrasena) {
      return res.status(400).json({ 
        error: 'Correo, código y nueva contraseña son requeridos' 
      });
    }

    if (nuevaContrasena.length < 8) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 8 caracteres' 
      });
    }

    if (!/[A-Z]/.test(nuevaContrasena)) {
      return res.status(400).json({
        error: 'La contraseña debe contener al menos una letra mayúscula'
      });
    }

    if (!/[0-9]/.test(nuevaContrasena)) {
      return res.status(400).json({
        error: 'La contraseña debe contener al menos un número'
      });
    }

    if (!/[^A-Za-z0-9]/.test(nuevaContrasena)) {
      return res.status(400).json({
        error: 'La contraseña debe contener al menos un carácter especial'
      });
    }

    // Código es válido
    const recoveryCode = await prisma.passwordRecoveryCode.findFirst({
      where: {
        correo,
        codigo,
        used: false,
        expires_at: {
          gt: new Date()
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      include: {
        usuario: true
      }
    });

    if (!recoveryCode) {
      return res.status(400).json({ error: 'Código inválido o expirado' });
    }

    // Verificar que la nueva contraseña no sea igual a la actual
    const isCurrentPassword = await bcrypt.compare(nuevaContrasena, recoveryCode.usuario.contraseña);
    if (isCurrentPassword) {
      return res.status(400).json({
        error: 'La nueva contraseña no puede ser igual a la actual'
      });
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    await prisma.usuario.update({
      where: { id: recoveryCode.id_usuario },
      data: { contraseña: hashedPassword }
    });

    // Marcar código como usado
    await prisma.passwordRecoveryCode.update({
      where: { id: recoveryCode.id },
      data: { used: true }
    });

    await emailService.sendPasswordChangedNotification(correo);

    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para agregar un nuevo rol de usuario
exports.addUserRole = async (req, res) => {
  try {
    const  rolToAdd = req.body.rol;
    const id_usuario = req.user.id; // ID del usuario autenticado
    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: id_usuario }
    });
    // Verificar si el rol existe
    const rolData = await prisma.rol.findFirst({
      where: { rol: rolToAdd }
    });
    if (!rolData) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Asignar el nuevo rol al usuario
    await prisma.usuarioRol.create({
      data: {
        id_usuario,
        id_rol: rolData.id
      }
    });

    return res.status(200).json({
      message: 'Rol agregado exitosamente',
      userId: id_usuario,
      roleId: rolData.id
    });
  } catch (error) {
    console.error('Error al agregar rol de usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};