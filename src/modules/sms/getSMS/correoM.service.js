const prisma = require('../../config/prisma');

const findAll = async () => {
    try {
        return await prisma.notificaion_confirmacion.findAll({
            select: {
                id: true,
                mensaje: true,
                fecha: true,
                estado: true,
                id_renter: true,
                id_host: true,
            }
        })        
    } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
        throw new Error('Error al obtener las notificaciones');
    }
}

module.exports = {findAll}