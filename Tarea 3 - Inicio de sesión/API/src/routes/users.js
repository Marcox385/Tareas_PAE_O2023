// IS727272 - Cordero Hernández, Marco Ricardo
// Router de express
const router = require('express').Router();

// Controlador
const controller = require('./../controllers/users.controller');

// Métodos
router.get('/', controller.getUser); // Obtener información del usuario actual
router.post('/signup', controller.newUser); // Nuevo usuario
router.put('/modify', controller.modifyUser); // Editar usuario
router.delete('/delete', controller.deleteUser); // Eliminar usuario

// Exportar router
module.exports = router;

