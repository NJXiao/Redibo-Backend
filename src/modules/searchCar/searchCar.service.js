const prisma = require('../../config/prisma');

const findAll = async () => {
  try {
    const carros = await prisma.carro.findMany({
      select: {
        id: true,
        vim: true,
        año: true,
        marca: true,
        modelo: true,
        placa: true,
        asientos: true,
        puertas: true,
        soat: true,
        precio_por_dia: true,
        num_mantenimientos: true,
        transmicion: true,
        estado: true,
        descripcion: true,
        ingresoTotal: true,
        NumeroViajes: true,
        disponible_desde: true,
        disponible_hasta: true,
        direccion: {
          select: {
            calle: true,
            zona: true,
            num_casa: true,
            latitud: true,
            longitud: true,
            provincia: {
              select: {
                nombre: true,
                ciudad: {
                  select: {
                    nombre: true
                  }
                }
              }
            }
          }
        },
        usuario: {
          select: {
            nombre: true,
            correo: true,
            telefono: true
          }
        },
        combustiblesporCarro: {
          select: {
            combustible: {
              select: {
                tipoDeCombustible: true
              }
            }
          }
        },
        caracteristicasAdicionalesCarro: {
          select: {
            carasteristicasAdicionales: {
              select: {
                nombre: true
              }
            }
          }
        },
        imagenes: {
          take: 1,
          orderBy: {
            id: 'asc'
          },
          select: {
            id: true,
            data: true,
            public_id: true,
            width: true,
            height: true,
            format: true
          }
        },
        tipodeDescuento: {
          select: {
            nombre: true,
            porcentaje: true,
            fecha_inicio: true,
            fecha_fin: true
          }
        }
      }
    });

    if (!carros || carros.length === 0) {
      return null;
    }

    // Transformar características adicionales en una lista de strings
    const carrosTransformados = carros.map(carro => {
      const caracteristicas = carro.caracteristicasAdicionalesCarro.map(item => item.carasteristicasAdicionales.nombre);
      return {
        ...carro,
        caracteristicasAdicionales: caracteristicas,
        caracteristicasAdicionalesCarro: undefined 
      };
    });

    return carrosTransformados;

    //return carros;
  } catch (error) {
    console.error('Error al obtener los carros:', error);
    throw error;
  }
};

module.exports = { findAll };