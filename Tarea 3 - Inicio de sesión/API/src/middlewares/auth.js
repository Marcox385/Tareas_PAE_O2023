// IS727272 - Cordero Hernández, Marco Ricardo
// Módulos
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

function authenticateToken(req, res, next) {
    const allowedRoutes = ['/users/signup'];
    if (allowedRoutes.includes(req.path)) {
        return next();
    }

    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
            if (err) return res.status(403).send('Token de autorización inválido.');

            req.user = data;
            next();
        });
        return;
    }
    
    res.status(401).send('Token de autorización no encontrado.');
}

// Exportar funciones
module.exports = {
    authenticateToken
};
