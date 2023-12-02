// IS727272 - Cordero Hernández, Marco Ricardo
// Router de express
const router = require('express').Router();

// Rutas locales
const users = require('./users');

// Ruta base
router.get('', (req, res) => {
    res.status(200).send('Ruta de API funcional.');
});

router.use('/users', users);

// Exportar router
module.exports = router;
