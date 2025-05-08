const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function crearMensaje(renterEmail, hostEmail, subject) {
  return `Hola ${hostEmail},\n\n${renterEmail} ha solicitado alquilar tu auto.\n\nGracias,\nEl equipo de alquiler de autos`;
}

async function enviarCorreo(renterEmail, hostEmail, subject) {
  const msg = {
    to: hostEmail,
    from: renterEmail,
    subject: subject,
    text: crearMensaje(renterEmail, hostEmail, subject).text,s
  };
 
  try {
    await sgMail.send(msg);
    console.log('Correo enviado al host ');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('Error al enviar el correo');
  }
}

module.exports = {
  enviarCorreo,
  crearMensaje,
};

// Ejemplo de uso
//enviarCorreo('renter@example.com', 'host@example.com', 'Solicitud de alquiler', 'Hola, me interesa alquilar tu auto.');
