// IS727272 - Cordero Hernández, Marco Ricardo
// Módulos
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const userSchema = new Schema({
    username: { type: String, required: true },
    mail: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS, 10));
    this.password = hash;
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

// Exportar modelo
module.exports = model('user', userSchema);
