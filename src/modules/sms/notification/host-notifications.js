const emailService = require('../envCorreo/email.service');

class HostNotifications {
  async sendHostNotification(data) {
    const message = createHostTemplate(data);
    
    await emailService.sendEmail({
      from: data.renterEmail,
      to: data.hostEmail,
      subject: 'Solicitud de Reserva',
      html: message
    });

    return { message: 'Correo enviado al host con éxito' };
  }
}

module.exports = new HostNotifications();