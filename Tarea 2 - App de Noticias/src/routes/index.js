// IS727272 - Cordero Hernández

// Módulos
const express = require('express');
const router = express.Router();

// Rutas
const noticias = require('./noticias');

router.get('', (req, res) => {
    res.render('index');
});

router.use(express.json());
router.use('/noticias', noticias);

module.exports = router;
