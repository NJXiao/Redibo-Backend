const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { generateToken } = require('../services/jwtService');
const { use } = require('passport');

const prisma = new PrismaClient();

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errores: errors.array() });
  }
  try {
    console.log('Datos recibidos en req.body:', req.body);
    const userData = req.body;
    let { nombre, correo, fecha_nacimiento, genero, ciudad, contrasena, telefono, rol } = userData;
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
      
      // Validar requisitos de contraseña
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
      if (!passwordRegex.test(contrasena)) {
        return res.status(400).json({ 
          error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un símbolo' 
        });
      }
      
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      
      // Crear usuario normal
      newUser = await prisma.usuario.create({
        data: {
          nombre,
          correo,
          fecha_nacimiento: new Date(userData.fechaNacimiento),
          genero,
          id_ciudad: parseInt(userData.ciudad),
          contraseña: hashedPassword,
          telefono
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
    const birthDate = new Date(fechaNacimiento);

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
      where: { correo }
    });

    if (!usuario || !usuario.contraseña) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordMatch = await bcrypt.compare(contrasena, usuario.contraseña);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Obtener roles del usuario
    const usuarioRoles = await prisma.usuarioRol.findMany({
      where: { id_usuario: usuario.id },
      include: { rol: true }
    });

    const roles = usuarioRoles.map(ur => ur.rol.rol);

    // Generar token JWT
    const token = generateToken({
      id: usuario.id,
      correo: usuario.correo,
      roles
    });

    return res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      },
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.googleCallback = (req, res) => {
  // usuario nuevo
  if (req.user.isIncomplete) {
    const mensaje = encodeURIComponent("Usuario nuevo. Perfil incompleto.");
    // Redireccionamos al frontend con el ID del usuario y el mensaje
    return res.redirect(`${process.env.FRONTEND_URL}/complete-profile/${req.user.id}?message=${mensaje}`);
  }

  // Usuario existente con perfil completo, generamos token JWT y redireccionamos
  const token = generateToken({
    id: req.user.id,
    correo: req.user.correo,
    roles: req.user.roles || []
  });

  // Redirigir a frontend con token
  return res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
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
        }
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Función para completar perfil de usuario (Google u otros métodos)
exports.completeUserProfile = async (req, res) => {
  try {
    const { 
      id,          // ID del usuario existente a actualizar
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

    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el teléfono ya existe en otro usuario
    const telefonoExistente = await prisma.usuario.findFirst({
      where: { 
        telefono,
        id: { not: parseInt(id) } // Excluir el usuario actual
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
      where: { id: parseInt(id) },
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
        id_usuario: parseInt(id),
        id_rol: rolData.id
      }
    });

    // Asignar rol al usuario si no lo tiene
    if (!rolExistente) {
      await prisma.usuarioRol.create({
        data: {
          id_usuario: parseInt(id),
          id_rol: rolData.id
        }
      });
    }

    // Obtener todos los roles del usuario
    const usuarioRoles = await prisma.usuarioRol.findMany({
      where: { id_usuario: parseInt(id) },
      include: { rol: true }
    });

    const roles = usuarioRoles.map(userRole => userRole.rol.rol);

    // Generar token con los roles
    const token = generateToken({
      id: usuarioActualizado.id,
      correo: usuarioActualizado.correo,
      roles: roles
    });
    
    return res.status(200).json({
      mensaje: 'Perfil completado exitosamente',
      usuario: {
        nombre: usuarioActualizado.nombre,
        correo: usuarioActualizado.correo,
        fecha_nacimiento: usuarioActualizado.fecha_nacimiento,
        genero: usuarioActualizado.genero,
        id_ciudad: usuarioActualizado.ciudad,
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
    const userId = parseInt(req.params.id);
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        correo: true,
        foto: true,
        perfil_completo: true
      }
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    return res.status(200).json({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      foto: usuario.foto,
      perfil_completo: usuario.perfil_completo
    });
  } catch (error) {
    console.error('Error al verificar estado del perfil:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};