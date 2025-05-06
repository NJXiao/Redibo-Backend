const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanOrphanUsers() {
  try {
    // Paso 1: Encontrar usuarios sin relaciones en otras tablas
    const usersToDelete = await prisma.usuario.findMany({
      where: {
        // Filtra usuarios que NO tienen registros en tablas relacionadas
        AND: [
          { favoritos: { none: {} } },
          { calificaciones: { none: {} } },
          { notificaciones: { none: {} } },
          { reservas: { none: {} } },
          { carros: { none: {} } },
          { busquedas: { none: {} } },
        ],
      },
      select: { id: true },
    });

    if (usersToDelete.length === 0) {
      console.log('⚠️ No hay usuarios huérfanos para eliminar');
      return;
    }
    // Paso 2: Eliminar en transacción
    await prisma.$transaction(async (prisma) => {
    // Eliminar registros en PasswordRecoveryCode antes de borrar usuarios
    await prisma.passwordRecoveryCode.deleteMany({
      where: {
        id_usuario: { in: usersToDelete.map(user => user.id) }
      }
    });

    
      // Eliminar UsuarioRol de estos usuarios
      await prisma.usuarioRol.deleteMany({
        where: {
          id_usuario: { 
            in: usersToDelete.map(user => user.id) 
          },
        },
      });

      // Eliminar los usuarios
      await prisma.usuario.deleteMany({
        where: { 
          id: { 
            in: usersToDelete.map(user => user.id) 
          } 
        },
      });
    });

    console.log(`✅ Eliminados ${usersToDelete.length} usuarios huérfanos`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}


async function cleanOneUser() {
  const id= 72
  try {
    // Paso 2: Eliminar en transacción
    await prisma.$transaction(async (prisma) => {
      // Eliminar UsuarioRol de estos usuarios
      await prisma.usuarioRol.deleteMany({
        where: {
          id_usuario: id
        },
      });

      // Eliminar los usuarios
      await prisma.usuario.deleteMany({
        where: { 
          id: id
        },
      });
    });

    console.log(`✅ Eliminados usuarios huérfanos`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}
// Ejecutar
cleanOrphanUsers();
//cleanOneUser();