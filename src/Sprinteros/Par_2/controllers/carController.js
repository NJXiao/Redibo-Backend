const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCar = async (req, res) => {
  try {
    const { 
      direccion,
      datosPrincipales,
      caracteristicas,
      caracteristicasAdicionales,
      finalizacion
    } = req.body;

    // Validación mejorada
    if (!datosPrincipales?.vin || datosPrincipales.vin.length !== 17) {
      return res.status(400).json({ error: "El VIN debe tener 17 caracteres" });
    }

    // Verificar tamaño de imágenes (ejemplo: máximo 2MB cada una)
    finalizacion.imagenes.forEach(img => {
      const base64Length = img.length - (img.indexOf(',') + 1);
      const sizeInBytes = 4 * Math.ceil(base64Length / 3) * 0.5624896334383812;
      if (sizeInBytes > 2 * 1024 * 1024) {
        throw new Error(`La imagen excede el tamaño máximo de 2MB`);
      }
    });

    // 1. Crear dirección
    const nuevaDireccion = await prisma.direccion.create({
      data: {
        calle: direccion.calle,
        num_casa: direccion.numCasa,
        provincia: {
          connectOrCreate: {
            where: { nombre: direccion.provincia },
            create: {
              nombre: direccion.provincia,
              ciudad: {
                connectOrCreate: {
                  where: { nombre: direccion.departamento },
                  create: {
                    nombre: direccion.departamento,
                    pais: {
                      connectOrCreate: {
                        where: { nombre: direccion.pais },
                        create: { nombre: direccion.pais }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // 2. Crear vehículo con transacción
    const [nuevoCarro] = await prisma.$transaction([
      prisma.carro.create({
        data: {
          vim: datosPrincipales.vin,
          año: parseInt(datosPrincipales.anio),
          marca: datosPrincipales.marca,
          modelo: datosPrincipales.modelo,
          placa: datosPrincipales.placa,
          id_direccion: nuevaDireccion.id,
          asientos: caracteristicas.asientos,
          puertas: caracteristicas.puertas,
          soat: caracteristicas.seguro,
          precio_por_dia: finalizacion.precioAlquiler,
          num_mantenimientos: finalizacion.mantenimientos,
          transmicion: caracteristicas.transmision,
          estado: "DISPONIBLE",
          id_usuario_rol: req.user.id,
          descripcion: finalizacion.descripcion,
          combustiblesporCarro: {
            create: caracteristicas.combustible.split(',').map(comb => ({
              combustible: {
                connectOrCreate: {
                  where: { tipoDeCombustible: comb.trim() },
                  create: { tipoDeCombustible: comb.trim() }
                }
              }
            }))
          },
          caracteristicasAdicionalesCarro: {
            create: Object.entries(caracteristicasAdicionales)
              .filter(([_, value]) => value)
              .map(([key]) => ({
                carasteristicasAdicionales: {
                  connectOrCreate: {
                    where: { nombre: key },
                    create: { nombre: key }
                  }
                }
              }))
          },
          imagenes: {
            create: finalizacion.imagenes.map(imgBase64 => ({
              data: Buffer.from(imgBase64.split(',')[1], 'base64')
            }))
          }
        },
        include: {
          combustiblesporCarro: { include: { combustible: true } },
          caracteristicasAdicionalesCarro: { 
            include: { carasteristicasAdicionales: true } 
          },
          imagenes: true
        }
      })
    ]);

    res.status(201).json({
      success: true,
      data: {
        ...nuevoCarro,
        imagenes: nuevoCarro.imagenes.map(img => ({
          ...img,
          data: img.data.toString('base64') // Convertir Buffer a base64 para respuesta
        }))
      }
    });

  } catch (error) {
    console.error("Error detallado:", error);
    
    if (error.code === 'P2002') {
      const field = error.meta?.target?.join(', ');
      return res.status(400).json({
        error: `El valor ya existe para el campo: ${field}`,
        field
      });
    }

    res.status(error.statusCode || 500).json({
      error: error.message || "Error interno del servidor",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { createCar };