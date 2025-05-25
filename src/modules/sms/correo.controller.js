const { enviarCorreoHost, enviarCorreoRenter } = require('./envCorreo/email.service');
const { correo } = require('./correo.service');
const { Router } = require('express');

const router = Router();

router.post('/', async (req, res) => {
  try {
  
    const mensajeHost = await enviarCorreoHost(req.body);
    const mensajeRenter = await enviarCorreoRenter(req.body);

    await correo(mensajeHost, req.body);

    res.status(201).json({
      notificacion: mensajeHost,
      confirmacionRenter: mensajeRenter,
    });
  } catch (error) {
    console.error('Error en el controlador:', error);
    res.status(500).json({
      message: 'Error al procesar la solicitud',
      error: error.message
    });
  }
});
module.exports = router;