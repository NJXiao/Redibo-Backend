const nodemailer = require('nodemailer');

// Crear el mensaje en formato HTML
function crearMensaje(datos) {
  return `
    <h1>Solicitud de Reserva</h1>
    <p><strong>Fecha:</strong> ${datos.fecha}</p>
    <p><strong>Host:</strong> ${datos.hostNombre}</p>
    <p>El renter <strong>${datos.renterNombre}</strong> solicita la renta del auto <strong>${datos.modelo} (${datos.marca})</strong>. A continuación, los detalles de la solicitud:</p>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Precio</th>
        <td>${datos.precio}</td>
      </tr>
      <tr>
        <th>Fecha y hora de recogida</th>
        <td>${datos.fechaRecogida}</td>
      </tr>
      <tr>
        <th>Fecha y hora de devolución</th>
        <td>${datos.fechaDevolucion}</td>
      </tr>
      <tr>
        <th>Lugar de recogida</th>
        <td>${datos.lugarRecogida}</td>
      </tr>
      <tr>
        <th>Lugar de devolución</th>
        <td>${datos.lugarDevolucion}</td>
      </tr>
    </table>
    <br>
    <button style="background-color: green; color: white; padding: 10px; border: none; cursor: pointer;">Aceptar</button>
    <button style="background-color: red; color: white; padding: 10px; border: none; cursor: pointer;">Rechazar</button>
  `;
}

// Enviar el correo usando SMTP
async function enviarCorreo({ renterEmail, hostEmail, mensaje }) {
  try {
    // Configuración del transporte SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'edmilzon.luna@gmail.com', // Tu correo de Gmail
        pass: 'nbzv tvnd uody qswc', // Contraseña de aplicación generada
      },
    });

    const mailOptions = {
      from: hostEmail, // El correo del host como remitente
      to: renterEmail, // El correo del renter como destinatario
      subject: 'Solicitud de Reserva',
      html: mensaje, // Mensaje en formato HTML
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Correo enviado del host al renter:', result);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('Error al enviar el correo');
  }
}

module.exports = {
  enviarCorreo,
  crearMensaje,
};