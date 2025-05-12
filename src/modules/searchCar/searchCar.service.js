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
        calificacionpromedio: true,
        Calificacion: {
          select: {
            calf_carro: true
          }
        },
        Direccion: {
          select: {
            calle: true,
            zona: true,
            num_casa: true,
            latitud: true,
            longitud: true,
            Provincia: {
              select: {
                nombre: true,
                Ciudad: {
                  select: {
                    nombre: true
                  }
                }
              }
            }
          }
        },
        Usuario: {
          select: {
            nombre: true,
            correo: true,
            telefono: true
          }
        },
        CombustibleCarro: {
          select: {
            TipoCombustible: {
              select: {
                tipoDeCombustible: true
              }
            }
          }
        },
        caracteristicasAdicionalesCarro: {
          select: {
            CarasteristicasAdicionales: {
              select: {
                nombre: true
              }
            }
          }
        },
        Imagen: {
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

    // Transformar características adicionales y calcular calificaciones promedio
    const carrosTransformados = carros.map(carro => {
      const caracteristicas = carro.caracteristicasAdicionalesCarro.map(item => item.CarasteristicasAdicionales.nombre);
      
      // Calcular promedio de calificaciones
      const calificaciones = carro.Calificacion.map(cal => cal.calf_carro).filter(val => typeof val === 'number');
      let promedioCalificacion = 0;
      
      if (calificaciones.length > 0) {
        const sumaCalificaciones = calificaciones.reduce((acc, curr) => acc + curr, 0);
        promedioCalificacion = sumaCalificaciones / calificaciones.length;
      }

      return {
        ...carro,
        caracteristicasAdicionales: caracteristicas,
        caracteristicasAdicionalesCarro: undefined,
        calificacionpromedio: promedioCalificacion
      };
    });

    // Actualizar los promedios en la base de datos
    await Promise.all(
      carrosTransformados.map(carro =>
        prisma.carro.update({
          where: { id: carro.id },
          data: { calificacionpromedio: carro.calificacionpromedio }
        })
      )
    );

    return carrosTransformados;
  } catch (error) {
    console.error('Error al obtener los carros:', error);
    throw error;
  }
};

module.exports = { findAll };