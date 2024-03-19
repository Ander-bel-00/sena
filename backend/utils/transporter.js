const nodemailer = require('nodemailer');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL_SEND || 'seep.sena.edu@gmail.com',
        pass: process.env.PASS_USER_MAIL || 'rgjl jwlk iinc ouvv'
    }
});

module.exports = transporter;
