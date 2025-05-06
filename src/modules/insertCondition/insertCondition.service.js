const prisma = require('../prisma/client');

async function crearCarroConCondiciones(data) {
  const { marca, modelo, año, condiciones_uso } = data;

  const condicionesGenerales = await prisma.condiciones_generales.create({
    data: condiciones_uso.condiciones_generales
  });

  const entregaAuto = await prisma.entrega_auto.create({
    data: {
      ...condiciones_uso.entrega_auto,
      herramientas_basicas: {
        create: condiciones_uso.entrega_auto.herramientas_basicas
      }
    }
  });

  const devolucionAuto = await prisma.devolucion_auto.create({
    data: condiciones_uso.devolucion_auto
  });

  const condicionesUso = await prisma.condiciones_uso.create({
    data: {
      id_condiciones_generales: condicionesGenerales.id,
      id_entrega_auto: entregaAuto.id,
      id_devolucion_auto: devolucionAuto.id
    }
  });

  const carro = await prisma.carro.create({
    data: {
      marca,
      modelo,
      año,
      id_condiciones_uso: condicionesUso.id
    },
    include: {
      condiciones_uso: {
        include: {
          condiciones_generales: true,
          entrega_auto: { include: { herramientas_basicas: true } },
          devolucion_auto: true
        }
      }
    }
  });

  return carro;
}

module.exports = {
  crearCarroConCondiciones
};
