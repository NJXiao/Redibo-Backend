const { sendHostNotification } = require('./correoHost/hostNotificacion');
const { sendRenterNotification } = require('./correoRenter/renterNotificacion');

async function handleReservationRequest(req, res) {
  try {
    const reservationData = req.body;
    
    await sendHostNotification({
      renterEmail: reservationData.renterEmail,
      hostEmail: reservationData.hostEmail,
      data: reservationData
    });
    
    await sendRenterNotification({
      renterEmail: reservationData.renterEmail,
      hostEmail: reservationData.hostEmail,
      data: reservationData
    });
    
    res.status(200).json({ message: 'Notificaciones enviadas correctamente' });
  } catch (error) {
    console.error('Error en el controlador de notificaciones:', error);
    res.status(500).json({ error: 'Error al enviar notificaciones' });
  }
}

module.exports = { handleReservationRequest };