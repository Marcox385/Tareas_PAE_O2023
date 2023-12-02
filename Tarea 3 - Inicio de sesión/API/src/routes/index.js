// IS727272 - Cordero Hernández, Marco Ricardo
// Módulos
const express = require('express');
const router = express.Router();

// Rutas locales
const api = require('./api');
const auth = require('./auth');

// Middleware de autenticación
const { authenticateToken } = require('../middlewares/auth');

// Ruta base
router.get('', (req, res) => {
    res.status(200).send('Servidor de API corriendo.');
});

router.use('/auth', auth);
router.use('/api', authenticateToken, api);

// Exportar router
module.exports = router;
