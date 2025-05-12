const prisma = require('../../config/prisma');

// Obtener lista inicial con datos limitados
const getFiltrosIniciales = async () => {
  try {
    const carros = await prisma.carro.findMany({
      select: {
        id: true,
        precio_por_dia: true,
        NumeroViajes: true,
        calificaciones: {
          select: {
            calf_carro: true
          }
        }
      }
    });

    if (!carros || carros.length === 0) {
      return null;
    }

    // Transformar los datos para incluir el promedio de calificaciones
    const carrosTransformados = carros.map(carro => ({
      id: carro.id,
      precio_por_dia: carro.precio_por_dia,
      NumeroViajes: carro.NumeroViajes,
      calificaciones: carro.calificaciones.map(cal => cal.calf_carro).filter(Boolean)
    }));

    return carrosTransformados;
  } catch (error) {
    console.error('Error al obtener filtros iniciales:', error);
    throw error;
  }
};

// Filtrar por rango de precio
const filtrarPorPrecio = async (minPrecio, maxPrecio, idsCarros) => {
  try {
    const carros = await prisma.carro.findMany({
      where: {
        AND: [
          {
            id: {
              in: idsCarros
            }
          },
          {
            precio_por_dia: {
              gte: minPrecio,
              lte: maxPrecio
            }
          }
        ]
      },
      select: {
        id: true,
        precio_por_dia: true,
        NumeroViajes: true,
        calificaciones: {
          select: {
            calf_carro: true
          }
        }
      }
    });

    return carros.map(carro => ({
      id: carro.id,
      precio_por_dia: carro.precio_por_dia,
      NumeroViajes: carro.NumeroViajes,
      calificaciones: carro.calificaciones.map(cal => cal.calf_carro).filter(Boolean)
    }));
  } catch (error) {
    console.error('Error al filtrar por precio:', error);
    throw error;
  }
};

// Filtrar por número de viajes
const filtrarPorViajes = async (minViajes, idsCarros) => {
  try {
    const carros = await prisma.carro.findMany({
      where: {
        AND: [
          {
            id: {
              in: idsCarros
            }
          },
          {
            NumeroViajes: {
              gte: minViajes
            }
          }
        ]
      },
      select: {
        id: true,
        precio_por_dia: true,
        NumeroViajes: true,
        calificaciones: {
          select: {
            calf_carro: true
          }
        }
      }
    });

    return carros.map(carro => ({
      id: carro.id,
      precio_por_dia: carro.precio_por_dia,
      NumeroViajes: carro.NumeroViajes,
      calificaciones: carro.calificaciones.map(cal => cal.calf_carro).filter(Boolean)
    }));
  } catch (error) {
    console.error('Error al filtrar por viajes:', error);
    throw error;
  }
};

// Filtrar por calificación mínima
const filtrarPorCalificacion = async (minCalificacion, idsCarros) => {
  try {
    const carros = await prisma.carro.findMany({
      where: {
        AND: [
          {
            id: {
              in: idsCarros
            }
          },
          /*{
            calificaciones: {
              some: {
                calf_carro: {
                  gte: minCalificacion
                }
              }
            }
          }*/
        ]
      },
      select: {
        id: true,
        precio_por_dia: true,
        NumeroViajes: true,
        calificaciones: {
          select: {
            calf_carro: true
          }
        }
      }
    });
    if (!carros || carros.length === 0) {
      return [];
    }

    const carrosFiltrados = carros.map(carro => {
      const calsNumericas = carro.calificaciones.map(cal => cal.calf_carro).filter(val => typeof val === 'number');
      let promedioCalificacion = 0; // Default si no hay calificaciones
      if (calsNumericas.length > 0) {
        const sumaCalificaciones = calsNumericas.reduce((acc, curr) => acc + curr, 0);
        promedioCalificacion = sumaCalificaciones / calsNumericas.length;
      }
      return {
        carroOriginal: {
            id: carro.id,
            precio_por_dia: carro.precio_por_dia,
            NumeroViajes: carro.NumeroViajes,
            calificaciones: calsNumericas, // Lista de calificaciones individuales
        },
        _promedioCalculado: promedioCalificacion // Guardamos el promedio para filtrar
      };
    })
    .filter(item => item._promedioCalculado >= minCalificacion) // FILTRADO POR PROMEDIO
    .map(item => item.carroOriginal);
    return carrosFiltrados;
  } catch (error) {
    console.error('Error al filtrar por calificación:', error);
    throw error;
  }
};

module.exports = {
  getFiltrosIniciales,
  filtrarPorPrecio,
  filtrarPorViajes,
  filtrarPorCalificacion
}; 