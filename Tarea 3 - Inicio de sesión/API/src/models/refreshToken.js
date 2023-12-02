// IS727272 - Cordero Hernández, Marco Ricardo
// Módulos
const { Schema, model } = require('mongoose');

const refreshTokenSchema = new Schema({
    token : { type: String, required: true, maxLength: 512 }
}, { timestamps: true });

// Exportar modelo
module.exports = model('refreshToken', refreshTokenSchema);
