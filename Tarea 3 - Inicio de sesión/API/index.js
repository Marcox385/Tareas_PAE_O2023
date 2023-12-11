// IS727272 - Cordero Hernández, Marco Ricardo
// Módulos
const cors = require('cors');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const express = require('express');
const mongoose = require('mongoose');

// Express router
const router = require('./src/routes');

// Variables de entorno
dotenvExpand.expand(dotenv.config());

// Configuración del servidor
const app = express();
const port = process.env.PORT || 3200;
app.use('', express.json());
app.use(cors());
app.disable('x-powered-by');

// Rutas
app.use(router);

// Conexión a la base de datos primero
mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true }).then(() => {
    console.log(`Conectado a MongoDB en la base ${process.env.TARGET_DB}`);

    app.listen(port, () => {
        console.log(`Aplicación corriendo en el puerto ${port}`);
    });
}).catch(err => {
    console.log('Error en conexión hacía MongoDB: ', err);
});
