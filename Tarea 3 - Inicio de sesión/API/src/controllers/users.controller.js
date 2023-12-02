// IS727272 - Cordero Hernández, Marco Ricardo
// Módulos
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Modelo de entidad
const model = require('./../models/user');

module.exports = {
    // GET
    getUser: (req, res) => {
        const user_id = req.user.id;

        model.findById(user_id).lean().then(response => {
            if (response)
                return res.status(200).send(response);
            return res.status(404).send('Usuario no encontrado.');
        });
    },

    // POST
    newUser: (req, res) => {
        const userData = req.body;

        // Revisar si el usuario existe
        if (userData) {
            if (!userData.username)
                return res.status(400).send('Username no encontrado.');

            if (!userData.mail)
                return res.status(400).send('Correo no encontrado.');

            model.findOne({
                $or: [
                    { username: userData.username },
                    { mail: userData.mail }
                ]
            }).lean().then(response => {
                if (response) // Usuario ya registrado
                    return res.status(409).send('El usuario ya existe.');

                // Usuario aún no registrado
                // Ignorar todos los otros campos
                const newUserData = {
                    username: userData.username,
                    mail: userData.mail,
                    password: userData.password // Manejado en el modelo del usuario
                };

                const result = model.create(newUserData);

                if (result) return res.status(201).send('Usuario registrado con éxito.');
                return res.status(409).send('Error en registro de usuario.');
            });

            return;
        }

        res.status(400).send('Datos de usuario no encontrados.');
    },

    // PUT
    modifyUser: (req, res) => {
        const user_id = req.user.id;
        const data = req.body;

        if (data) {
            // Ignorar los otros campos
            const newData = {
                username: data.username,
                mail: data.mail,
                password: data.password
            };

            // Revisar si los datos ya están en la base
            model.findOne({
                $or: [
                    { username: newData.username },
                    { mail: newData.mail }
                ]
            }).lean().then(async response => {
                if (response) {
                    dataInUse = {};

                    if (response.mail) dataInUse.mail = true;
                    if (response.phone) dataInUse.phone = true;
                    if (response.username) dataInUse.username = true;

                    return res.status(409).send(dataInUse);
                }

                // Hashear contraseña antes de actualizarla
                if (newData.password)
                    newData.password = await bcrypt.hash(newData.password, parseInt(process.env.SALT_ROUNDS, 10));
                
                // Ignorar campos vacíos y regresar documento actualizado
                opts = { new: true, omitUndefined: true };
                doc = await model.findByIdAndUpdate(user_id, newData, opts);

                if (doc) {
                    res.status(200).send(doc);
                } else res.status(404).send('Usuario no encontrado.');
            });
            return;
        }

        return res.status(400).send('Nuevos datos no encontrados.');
    },

    // DELETE
    deleteUser: async (req, res) => {
        const user_id = req.user.id;
        const success = await model.deleteOne({ user_id });
        
        if (!success) return res.status(404).send('Couldn\'t delete user.');
        res.status(200).send('Successfully deleted user.');
    }
}
