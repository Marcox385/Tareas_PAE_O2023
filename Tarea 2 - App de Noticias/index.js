// IS727272 - Cordero Hernández

// Módulos
const express = require('express');
const router = require('./src/routes');
const path = require('path');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars');

// Generar variables de entorno (antes de accederlas)
dotenv.config();

// Servidor
const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Archivos estáticos
const assetsUrl = path.join(__dirname, 'public');
app.use('/assets', express.static(assetsUrl));

// Rutas e inicialización
app.use(router);

app.listen(port, () => {
    console.log(`Aplicación corriendo en el puerto ${port}`);
});
