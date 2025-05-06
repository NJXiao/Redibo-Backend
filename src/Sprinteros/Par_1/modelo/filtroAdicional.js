const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCaracteristicasAdicionales = async (ids, caracteristica) => {
  const carros = await prisma.carro.findMany({
    where: {
      id: { in: ids },
      caracteristicasAdicionalesCarro: {
        some: {
          carasteristicasAdicionales: {
            nombre: caracteristica // Filtrar por nombre de características adicionales
          }
        }
      }
    },
    select: {
      id: true
    }
  });

  return carros.map(carro => carro.id);
};

module.exports = { getCaracteristicasAdicionales };
