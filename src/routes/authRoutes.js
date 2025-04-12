const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para iniciar el flujo de OAuth de Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }),
  userController.googleCallback
);

// Completar registro con Google (desde frontend)
router.post('/complete-google-registration', userController.completeGoogleRegistration);

// Login con correo y contraseña
router.post('/login', userController.loginUser);

// Obtener perfil del usuario (protegido con JWT)
router.get('/profile', authenticate, userController.getUserProfile);

module.exports = router;