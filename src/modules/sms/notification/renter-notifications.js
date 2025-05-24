
const emailService = require('../envCorreo/email.controller');
const { createRenterTemplate } = require('../templantes/renter-templante');
const notificationsService = require('../prisma/notifications.service');

class RenterNotifications {
  async sendRenterNotification(data, notificationId) {
    const message = createRenterTemplate(data);
    
    await notificationsService.updateNotification(notificationId, { mensaje: message });

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