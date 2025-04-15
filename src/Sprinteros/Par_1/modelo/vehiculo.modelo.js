//DEVUELVE TODOS LOS DATOS DE UN CARRO
/*const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const obtenerPlacaPorId = async (id) => {
  try {
    console.log('ID recibido:', id);
    const placa = await prisma.carro.findUnique({ // Cambiado a "carro"
      where: { id: parseInt(id) }, // Asegúrate de que el campo 'id' exista en el modelo
    });
    console.log('Placa encontrada:', placa);
    return placa;
  } catch (error) {
    console.error('Error al obtener la placa:', error);
    throw error;
  }
};

module.exports = { obtenerPlacaPorId };*/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const obtenerPlacaPorId = async (id) => {
  try {
    console.log('ID recibido:', id);
    const placa = await prisma.carro.findUnique({
      where: { id: parseInt(id) }, // Asegúrate de que el campo 'id' exista en el modelo
      select: { placa: true }, // Solo selecciona el campo "placa"
    });
    console.log('Placa encontrada:', placa);
    return placa;
  } catch (error) {
    console.error('Error al obtener la placa:', error);
    throw error;
  }
};


// Obtener solo el VIM del carro por ID
const obtenerVIMPorId = async (id) => {
    try {
      console.log('ID recibido para VIM:', id);
      const vim = await prisma.carro.findUnique({
        where: { id: parseInt(id) },
        select: { vim: true }, // Asegúrate de que el campo se llame exactamente "vim"
      });
      console.log('VIM encontrado:', vim);
      return vim;
    } catch (error) {
      console.error('Error al obtener el VIM:', error);
      throw error;
    }
  };


// Obtener solo la marca por ID
const obtenerMarcaPorId = async (id) => {
    try {
      const marca = await prisma.carro.findUnique({
        where: { id: parseInt(id) },
        select: { marca: true }
      });
      return marca;
    } catch (error) {
      console.error('Error al obtener la marca:', error);
      throw error;
    }
  };

// Obtener solo el modelo por ID
const obtenerModeloPorId = async (id) => {
    try {
      const modelo = await prisma.carro.findUnique({
        where: { id: parseInt(id) },
        select: { modelo: true } // Seleccionamos solo el campo "modelo"
      });
      return modelo;
    } catch (error) {
      console.error('Error al obtener el modelo:', error);
      throw error;
    }
  };

  // Obtener solo el año por ID
const obtenerAnioPorId = async (id) => {
    try {
      const anio = await prisma.carro.findUnique({
        where: { id: parseInt(id) },
        select: { año: true } // Seleccionamos solo el campo "ano"
      });
      return anio;
    } catch (error) {
      console.error('Error al obtener el año:', error);
      throw error;
    }
 };

 const obtenerVehiculoCompletoPorId = async (id) => {
  try {
    const vehiculo = await prisma.carro.findUnique({
      where: { id: parseInt(id) },
      select: {
        placa: true,
        vim: true,
        marca: true,
        modelo: true,
        año: true, // Asegúrate que en Prisma esté como "año"
      },
    });

    if (vehiculo) {
      // Reestructuramos el objeto para asegurarnos del orden deseado
      const vehiculoOrdenado = {
        vim: vehiculo.vim,
        año: vehiculo.año,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        placa: vehiculo.placa,
      };

      return vehiculoOrdenado;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener los datos completos del vehículo:', error);
    throw error;
  }
};


const obtenerCaracteristicasPorId = async (id) => {
  try {
    const caracteristicas = await prisma.carro.findUnique({
      where: { id: parseInt(id) },
      select: {
        puertas: true,
        transmicion: true,
        soat: true,
        combustiblesporCarro: {
          select: {
            combustible: {
              select: {
                tipoDeCombustible: true
              }
            }
          }
        }
      }
    });

    if (!caracteristicas) return null;

    // Extraer tipo(s) de combustible
    const tiposCombustible = caracteristicas.combustiblesporCarro.map(
      (c) => c.combustible.tipoDeCombustible
    );

    // Retornar datos en el orden solicitado
    return {
      tipoDeCombustible: tiposCombustible.join(', '),
      puertas: caracteristicas.puertas,
      transmision: caracteristicas.transmicion,
      soat: caracteristicas.soat
    };
  } catch (error) {
    console.error('Error al obtener características del vehículo:', error);
    throw error;
  }
};



module.exports = {
  obtenerPlacaPorId,
  obtenerVIMPorId,
  obtenerMarcaPorId,
  obtenerModeloPorId,
  obtenerAnioPorId,
  obtenerVehiculoCompletoPorId,
  obtenerCaracteristicasPorId,
};