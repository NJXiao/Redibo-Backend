import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para generar una calificación aleatoria entre 1 y 5
function generarCalificacion() {
  return Math.floor(Math.random() * 5) + 1;
}

// Función para generar una fecha aleatoria en los últimos 6 meses
function generarFechaAleatoria() {
  const ahora = new Date();
  const seisMesesAtras = new Date();
  seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
  return new Date(seisMesesAtras.getTime() + Math.random() * (ahora.getTime() - seisMesesAtras.getTime()));
}

async function main() {
  // Obtener todos los usuarios
  const usuarios = await prisma.usuario.findMany();
  
  // Obtener todos los carros
  const carros = await prisma.carro.findMany();

  // Obtener todos los UsuarioRol
  const usuarioRoles = await prisma.usuarioRol.findMany();

  console.log(`📊 Generando calificaciones para ${usuarios.length} usuarios y ${carros.length} carros...`);

  // Para cada usuario, generar calificaciones para algunos carros
  for (const usuario of usuarios) {
    // Seleccionar aleatoriamente entre 1 y 3 carros para que el usuario califique
    const numCarrosACalificar = Math.floor(Math.random() * 3) + 1;
    const carrosAleatorios = carros.sort(() => 0.5 - Math.random()).slice(0, numCarrosACalificar);

    for (const carro of carrosAleatorios) {
      // Obtener un UsuarioRol aleatorio para este usuario
      const usuarioRolAleatorio = usuarioRoles.find(ur => ur.id_usuario === usuario.id);
      if (!usuarioRolAleatorio) continue;

      // Crear calificación del carro
      await prisma.calificacion.create({
        data: {
          id_usuario_rol: usuarioRolAleatorio.id,
          calf_carro: generarCalificacion(),
          calf_usuario: generarCalificacion(),
          id_carro: carro.id,
          id_usuario: usuario.id
        }
      });
    }
  }

  // Generar calificaciones adicionales para usuarios (como conductores)
  for (const usuario of usuarios) {
    // Cada usuario recibirá entre 2 y 5 calificaciones adicionales
    const numCalificaciones = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < numCalificaciones; i++) {
      // Seleccionar un carro aleatorio
      const carroAleatorio = carros[Math.floor(Math.random() * carros.length)];
      
      // Obtener un UsuarioRol aleatorio para este usuario
      const usuarioRolAleatorio = usuarioRoles.find(ur => ur.id_usuario === usuario.id);
      if (!usuarioRolAleatorio) continue;

      // Crear calificación adicional
      await prisma.calificacion.create({
        data: {
          id_usuario_rol: usuarioRolAleatorio.id,
          calf_carro: generarCalificacion(),
          calf_usuario: generarCalificacion(),
          id_carro: carroAleatorio.id,
          id_usuario: usuario.id
        }
      });
    }
  }

  console.log('✅ Calificaciones generadas exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error al generar calificaciones:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 