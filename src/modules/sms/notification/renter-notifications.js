const emailService = require('../envCorreo/email.service');

class RenterNotifications {
  async sendRenterNotification(data, notificationId) {
    const message = createRenterTemplate(data);
    
    await emailService.sendEmail({
      from: data.hostEmail,
      to: data.renterEmail,
      subject: 'Notificación enviada con éxito',
      html: message
    });

    return { message: 'Correo enviado al renter con éxito' };
  }
}

module.exports = new RenterNotifications();