// IS727272 - Cordero Hernández, Marco Ricardo
// Módulos
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Cargar variables de entorno
dotenv.config();

// Modelos
const userModel = require('./../models/user');
const tokenModel = require('./../models/refreshToken');

// Router de express
const router = require('express').Router();

// Rutas
router.get('', (req, res) => {
    res.status(200).send('Ruta de AUTH funcional.');
});

router.post('/login', (req, res) => {
    // Estos datos vienen del formulario del front
    const { mail, password } = req.body;
    const user = { mail };
    const reqPassword = password;

    userModel.findOne({ mail: mail }).lean().then(response => {
        if (response) { // El usuario existe en la base de de datos
            // Revisar si las contraseñas coinciden
            const { _id, username, password } = response;
            bcrypt.compare(reqPassword, password, function(err, data) {
                if (err) return res.status(503).send('No es posible el ingreso.');

                if (data) {
                    // Generar tokens de acceso y actualización
                    user.id = _id;
                    user.username = username;

                    const accessToken = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
                    const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_KEY, { expiresIn: '6d' });

                    tokenModel.create({token: refreshToken}); // Guardar el token de actualización en la base

                    res.status(200).send({accessToken, refreshToken});
                } else {
                    res.status(401).send('Contraseña incorrecta.');
                }
                return;
            });
        } else { // Usuario no registrado
            res.status(401).send('Usuario no registrado.');
        }
        return;
    }).catch(err => {
        console.log(err);
        return res.status(503).send('No es posible el ingreso.');
    });
});

router.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (refreshToken) {
        tokenModel.findOne({token: refreshToken}).lean().then(response => {
            if (response) { // Actualizar token en la base de datos
                jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, data) => {
                    if (err) return res.status(403).send('Token inválido.');

                    const { id, username, mail } = data;
                    const user = {id, username, mail};
                    accessToken = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
                    res.status(200).send({accessToken});
                });
            } else {
                res.status(403).send('Token inválido.');
            }
        });
        return;
    }

    res.status(401).send('Token de actualización no encontrado.');
});

router.delete('/logout', (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (refreshToken) {
        tokenModel.findOneAndDelete({token: refreshToken}).lean().then(response => {
            if (response) {
                res.status(200).send('Token eliminado con éxito.');
            } else {
                res.status(404).send('Token no encontrado. Proceder con precaución.');
            }
        });
        return;
    }

    res.status(503).send('No fue posible eliminar el token. Proceder con precaución.');
});

// Exportar router
module.exports = router;
