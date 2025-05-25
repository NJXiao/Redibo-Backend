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

    return notificationsService.createHostNotification({
      ...data,
      mensaje: message
    });
  }
}

module.exports = new HostNotifications();