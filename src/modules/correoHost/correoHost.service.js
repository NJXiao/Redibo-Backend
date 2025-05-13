const { PrismaClient } = require('@prisma/client');
const { enviarCorreo, crearMensaje } = require('./notifications');

const prisma = new PrismaClient();

async function envCorreoHost(data) {
    const {
        fecha,
        hostNombre,
        renterNombre,
        modelo,
        marca,
        precio,
        fechaRecogida,
        fechaDevolucion,
        lugarRecogida,
        lugarDevolucion,
        renterEmail,
        hostEmail,
        id_renter,
        id_host,
    } = data;

    const mensaje = crearMensaje({
        fecha,
        hostNombre,
        renterNombre,
        modelo,
        marca,
        precio,
        fechaRecogida,
        fechaDevolucion,
        lugarRecogida,
        lugarDevolucion,
    });

    try {
        await enviarCorreo({
            renterEmail,
            hostEmail,
            mensaje,
        });

        // Crear la notificación en la base de datos
        const notificacion = await prisma.notificaion_confirmacion.create({
            data: {
                mensaje,
                estado: true,
                id_renter,
                id_host,
            },
        });

        return notificacion;
    } catch (error) {
        console.error('Error al enviar el correo o guardar la notificación:', error);
        throw new Error('Error al procesar la solicitud');
    }
}

async function envCorreoExitoRenter(data) {
    const {
        fecha,
        hostNombre,
        renterNombre,
        modelo,
        marca,
        precio,
        fechaRecogida,
        fechaDevolucion,
        lugarRecogida,
        lugarDevolucion,
        renterEmail,
        id_renter,
        id_host,
    } = data;

    const mensaje = crearMensajeExitoRenter({
        fecha,
        hostNombre,
        renterNombre,
        modelo,
        marca,
        precio,
        fechaRecogida,
        fechaDevolucion,
        lugarRecogida,
        lugarDevolucion,
    });

    try {
        await enviarCorreo({
            renterEmail: 'sistema@tudominio.com', // Remitente (puedes poner el correo del sistema)
            hostEmail: renterEmail,               // Destinatario: el renter
            mensaje,
        });

        // Guardar la notificación si lo necesitas
        const notificacion = await prisma.notificaion_confirmacion.create({
            data: {
                mensaje,
                estado: true,
                id_renter,
                id_host,
            },
        });

        return notificacion;
    } catch (error) {
        console.error('Error al enviar el correo de éxito al renter:', error);
        throw new Error('Error al procesar la notificación de éxito');
    }
}

module.exports = {
    envCorreoHost,
    envCorreoExitoRenter,
};