const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function filtrarCoches({ ciudad, fecha_inicio, fecha_fin }) {
  const coches = await prisma.carro.findMany({
    where: {
      direccion: {
        provincia: {
          ciudad: {
            nombre: ciudad,
          },
        },
      },
      disponible_desde: {
        lte: new Date(fecha_inicio),
      },
      disponible_hasta: {
        gte: new Date(fecha_fin),
      },
    },
    include: {
      direccion: {
        include: {
          provincia: {
            include: {
              ciudad: true,
            },
          },
        },
      },
      imagenes: true,
    },
  });
  return coches;
}

module.exports = { filtrarCoches };