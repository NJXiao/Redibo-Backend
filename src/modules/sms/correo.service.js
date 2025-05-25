const HostNotifications = require('./notification/host-notifications');
const RenterNotifications = require('./notification/renter-notifications');

async function envCorreoHost(data) {
  try {
    return await HostNotifications.sendHostNotification(data);
  } catch (error) {
    console.error('Error al enviar el correo o guardar la notificación:', error);
    throw new Error('Error al procesar la solicitud');
  }
}

async function envCorreoRenter(data, notificationId) {
  try {
    return await RenterNotifications.sendRenterNotification(data, notificationId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('Error al procesar la solicitud');
  }
}

module.exports = {
  envCorreoHost,
  envCorreoRenter,
};