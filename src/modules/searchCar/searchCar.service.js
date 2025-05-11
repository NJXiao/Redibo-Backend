const prisma = require('../../config/prisma');

const calcularPromedioCalificaciones = async (carros) => {
  try {
    // Procesar cada carro para calcular su promedio
    const carrosConPromedio = carros.map(carro => {
      const calificaciones = carro.Calificacion.map(cal => cal.calf_carro).filter(val => typeof val === 'number');
      let promedioCalificacion = 0;
      
      if (calificaciones.length > 0) {
        const sumaCalificaciones = calificaciones.reduce((acc, curr) => acc + curr, 0);
        promedioCalificacion = sumaCalificaciones / calificaciones.length;
      }

      return {
        id: carro.id,
        promedioCalificacion
      };
    });

    // Actualizar los promedios en la base de datos de manera eficiente
    await Promise.all(
      carrosConPromedio.map(carro => 
        prisma.carro.update({
          where: { id: carro.id },
          data: { calificacionpromedio: carro.promedioCalificacion }
        })
      )
    );

    return carrosConPromedio;
  } catch (error) {
    console.error('Error al calcular promedios de calificaciones:', error);
    throw error;
  }
};

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

    // Calcular y actualizar promedios de calificaciones
    const promediosActualizados = await calcularPromedioCalificaciones(carros);

    // Transformar características adicionales y agregar promedios actualizados
    const carrosTransformados = carros.map(carro => {
      const caracteristicas = carro.caracteristicasAdicionalesCarro.map(item => item.carasteristicasAdicionales.nombre);
      const promedioActualizado = promediosActualizados.find(p => p.id === carro.id)?.promedioCalificacion || 0;

      return {
        ...carro,
        caracteristicasAdicionales: caracteristicas,
        caracteristicasAdicionalesCarro: undefined,
        calificacionpromedio: promedioActualizado
      };
    });

    return carrosTransformados;
  } catch (error) {
    console.error('Error al obtener los carros:', error);
    throw error;
  }
};

module.exports = { findAll };