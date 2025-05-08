const prisma = require('../../config/prisma');

const findAll = async () => {
  try {
    return await prisma.seguroCarro.findMany({
      select: {
        id: true,
        fechaInicio: true,
        fechaFin: true,
        Seguro: {
          select: {
            empresa: true,
            nombre: true,
            tipoSeguro: true,
            valides: true,
            descripcion: true,
          },
        },
        id_carro: true,
        enlace: true,
      },
    });
  } catch (error) {
    console.error('Error al obtener los seguros de carros:', error);
  }
};

module.exports = { findAll };
