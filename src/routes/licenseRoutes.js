const express = require('express');
const licenseController = require('../controllers/licenseController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');


const router = express.Router();

router.post('/request',authenticateToken,  upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 }
]),
licenseController.crearSolicitud
);

module.exports = router;