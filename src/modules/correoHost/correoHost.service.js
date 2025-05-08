const { PrismaClient } = require("@prisma/client/extension");
const {enviarCorreo, crearMensaje} = require('./notifications');

const prisma = new PrismaClient();

async function envCorreoHost(data) {
    const {renterEmail, hostEmail, subject} = data;

    const mensaje = crearMensaje(renterEmail, hostEmail, subject);

    try {
        await enviarCorreo(renterEmail, hostEmail, subject);

        const notificaion = await prisma.notificacion.create({
            data: {
                mensaje,
                id_carro:1
            }
        });

        return notificaion;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('Error al enviar el correo');
    }
}

module.exports = {
    envCorreoHost
};