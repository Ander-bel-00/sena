const nodemailer = require('nodemailer');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'beltrananderson283@gmail.com',
        pass: 'voql phpz zhvt akpn'
    }
});

module.exports = transporter;
