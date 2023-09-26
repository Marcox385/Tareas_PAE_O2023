// IS727272 - Cordero Hernández

// Módulos
const router = require('express').Router();

// Controlador
const controller = require('./../controllers/noticias.controller');

router.get('', controller.list);

module.exports = router;
