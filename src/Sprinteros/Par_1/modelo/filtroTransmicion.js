const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Obtener todo los tipos de transmicion
const getTransmicion = async (ids ,tipoTransmision) => {
  const carros = await prisma.carro.findMany({
    where: {
        id : {in: ids},
        transmicion: tipoTransmision
    },
    select: {
        id : true
    }
  });

  return carros.map(carro => carro.id);
};

module.exports = {
    getTransmicion,
};
