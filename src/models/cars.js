const prisma = require("../config/prisma");


class CarModel {
  static async getHostOfCarro({id_carro}){
    const host = await prisma.carro.findFirst({
      where:{
        id:id_carro,
        Usuario:{
          roles:{
            some:{
              id_rol:2
            }
          }
        }
      },
      select:{
        id_usuario_rol:true
      }
    })
    return host;
  }
  static async getRenderOfCarro({id_carro}){
    const renter = await prisma.carro.findFirst({
      where:{
        id:id_carro,
        Usuario:{
          roles:{
            some:{
              id_rol:1
            }
          }
        }
      },
      select:{
        id_usuario_rol:true
      }
    })
    return renter;
  }
  static async getMostRented() {
    try {
      const cars = await prisma.carro.findMany({
        where: {
          Reserva: {
            some: {
              estado: "confirmado",
            }
          }
        },
        include: {
          Imagen: true,
          _count: {
            select: {
              Reserva: {
                where: {
                  estado: "confirmado",
                }
              }
            }
          }
        },
        orderBy: {
          Reserva: {
            _count: 'desc'
          }
        },
        take: 15
      })

      return cars.map(car => ({
        marca: car.marca,
        modelo: car.modelo,
        anio: car.año,
        precio_por_dia: car.precio_por_dia,
        imagenes: car.Imagen && car.Imagen.length > 0 ? car.Imagen[0].data : '',
        veces_alquilado: car._count.Reserva,
      }))
    } catch (error) {
      console.error('Error al obtener los autos más alquilados: ', error);
      throw new Error('Error al obtener los autos más alquilados');
    }
  }
}

module.exports = { CarModel }

