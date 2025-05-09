const axios = require('axios');

// Crear el mensaje
function crearMensaje(renterEmail, hostEmail, subject) {
  return `Hola ${hostEmail},\n\n${renterEmail} ha solicitado alquilar tu auto.\n\nGracias,\nEl equipo de alquiler de autos`;
}

// Enviar el correo usando Resend
async function enviarCorreo(renterEmail, hostEmail, subject) {
  const mensaje = crearMensaje(renterEmail, hostEmail, subject);

  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: renterEmail, // El correo del renter como remitente
        to: [hostEmail], // El correo del host como destinatario
        subject: subject,
        text: mensaje,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`, // API Key de Resend
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Correo enviado del renter al host:', response.data);
  } catch (error) {
    console.error('Error al enviar el correo:', error.response?.data || error.message);
    throw new Error('Error al enviar el correo');
  }
}

module.exports = {
  enviarCorreo,
  crearMensaje,
};