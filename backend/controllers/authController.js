const Aprendiz = require('../models/Aprendices');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createAccessToken = require('../libs/jwt');
const TOKEN_S = require('../config/config');

// Función para iniciar sesión
exports.iniciarSesion = async (req, res, next) => {
    try {
        const { numero_documento, contrasena, rol_usuario } = req.body;

        // Verificar si el número de documento y la contraseña están vacíos
        if (!numero_documento) {
            return res.status(400).json({ message: 'El número de documento es requerido' });
        }
        
        if ( numero_documento.length < 8 ) {
            return res.status(400).json({ message: 'El numero de documento debe contener al menos 8 dígitos' });
        }

        if (!contrasena) {
            return res.status(400).json({ message: 'La contraseña es requerida' });
        }

        if ( contrasena.length < 8 ) {
            return res.status(400).json({ message: 'La contraseña debe contener al menos 8 dígitos' });
        }


        // Buscar al usuario por número de documento y rol
        const usuario = await obtenerUsuarioPorNumeroDocumento(numero_documento, rol_usuario);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contrasenaValida) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT con el id, número de documento y rol del usuario
        const token = await createAccessToken(
            { id: usuario.id_aprendiz, numero_documento: usuario.numero_documento },
        );
        
        // Configurar la cookie con el token
        res.cookie('token', token, {
            httpOnly: true, // La cookie solo será accesible a través del protocolo HTTP
            secure: true, // La cookie solo se enviará a través de conexiones HTTPS en producción
            sameSite: 'strict' // La cookie solo se enviará en solicitudes del mismo sitio
        });

        // Enviar respuesta con token
        res.json({ message: `Inicio de sesión exitoso como ${usuario.rol_usuario}`, token });
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        res.status(500).json({ message: 'Hubo un error al procesar la solicitud', error });
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

exports.logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });

    return res.sendStatus(200);
}

exports.verifyToken = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, TOKEN_S, async (err, usuario) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });

        const userFound = await Aprendiz.findByPk(usuario.numero_documento);

        if (!userFound) return res.status(403).json({ message: "Unauthorized" });

        return res.json({
            id: userFound.id_aprendiz,
            numero_documento: userFound.numero_documento,
        });
    });
}
