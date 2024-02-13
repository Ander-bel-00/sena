// authController.js
const Aprendiz = require('../models/Aprendices');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para iniciar sesión
exports.iniciarSesion = async (req, res, next) => {
    try {
        const { numero_documento, contrasena, rol_usuario } = req.body;

        // Buscar al usuario por número de documento y rol
        const usuario = await obtenerUsuarioPorNumeroDocumento(numero_documento, rol_usuario);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contrasenaValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Generar token JWT con el id, número de documento y rol del usuario
        const token = jwt.sign(
            { id: usuario.id_aprendiz, numero_documento: usuario.numero_documento },
            'secreto', // Aquí deberías usar una cadena aleatoria y segura como tu secreto
            { expiresIn: '1h' } // Tiempo de expiración del token
        );

        // Configurar la cookie con el token
        res.cookie('token', token );

        // Enviar respuesta con token
        res.json({ mensaje: `Inicio de sesión exitoso como ${usuario.rol_usuario}`, token });
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud', error });
        next();
    }
};

// Función para obtener usuario por número de documento y rol
async function obtenerUsuarioPorNumeroDocumento(numero_documento, rol_usuario) {
    let usuario;
    switch (rol_usuario) {
        case 'aprendiz':
            usuario = await Aprendiz.findOne({ where: { numero_documento } });
            break;
        case 'admin':
            // Lógica para obtener admin
            break;
        case 'instructor':
            // Lógica para obtener instructor
            break;
        default:
            usuario = null;
    }
    return usuario;
}
