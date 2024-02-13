const Aprendices = require('../models/Aprendices');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar nuevo aprendiz a la Base de datos y generar token JWT
exports.nuevoAprendiz = async (req, res, next) => {
    try {
        // Encriptar la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(req.body.contrasena, 10);

        // Reemplazar la contraseña original por la contraseña encriptada
        req.body.contrasena = hashedPassword;

        // Crear el aprendiz en la base de datos
        await Aprendices.sync({ force: false });
        const aprendiz = await Aprendices.create(req.body);

        // Generar token JWT
        const token = jwt.sign(
            { id: aprendiz.id_aprendiz, numero_documento: aprendiz.numero_documento },
            'secret_token_secret', // Cadena para el secret token.
            { expiresIn: '1h' } // Tiempo de expiración del token.
        );

        // Enviar respuesta con token
        res.json({ mensaje: 'El aprendiz ha sido registrado exitosamente', token, aprendiz });
    } catch (error) {
        console.error('Error al crear un nuevo aprendiz', error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud', error });
        next();
    }
};

// Iniciar sesión y generar token JWT
exports.iniciarSesion = async (req, res, next) => {
    try {
        const { numero_documento, contrasena, rol_usuario } = req.body;

        // Buscar al usuario por número de documento
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
            { id: usuario.id, numero_documento: usuario.numero_documento, rol_usuario: usuario.rol_usuario },
            'secreto', // Aquí deberías usar una cadena aleatoria y segura como tu secreto
            { expiresIn: '1h' } // Tiempo de expiración del token
        );

        // Configurar la cookie con el token
        res.cookie('token', token, { httpOnly: true });

        // Enviar respuesta con el rol del usuario
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
            usuario = await Aprendices.findOne({ where: { numero_documento } });
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



// Obtener los datos de todos los aprendices almacenados en la base de datos.
exports.mostrarAprendices = async (req, res, next) => {
    try {
        // Obtener los aprendices de la base de datos.
        const aprendices = await Aprendices.findAll({});
        // Devolver todos los aprendices en un json.
        res.json(aprendices);
    } catch (err) {
        // En caso de error envía un mensaje y los detalles del error al usuario.
        console.error(err);
        res.status(500).json({ mensaje: 'error en la solicitud', error: err });
        
        next();
    }
};


// Obtener un aprendiz almacenado en la base de datos por medio de su número de documento.
exports.mostrarAprendizByDocument = async (req, res) => {
    try{
        // Obtener el numero de documento enviado en la cabecera de la solicitud.
        const documento = req.params.numero_documento;
        
        // Comparar si el numero de documento enviado es igual al almacenado en la base de datos.
        const aprendiz = await Aprendices.findOne({
            where: {
                numero_documento: documento
            }
        });
        // En caso de no encontrar el aprendiz envía un mensaje de error al usuario.
        if(!aprendiz){
            return res.status(404).json({ mensaje: 'No se ha encontrado ese aprendiz',aprendiz });
        }
        // Si encuentra el aprendiz lo muestra en un JSON.
        res.json(aprendiz);
    }catch(error){
        // En caso de error envía un mensaje y los detalles del error al usuario.
        res.status(500).json(error);
    }
};

// Actualizar los datos de un aprendiz registrado en la base de datos.
exports.actualizarAprendiz = async (req, res, next) => {
    try{
        // Obtener el numero de documento enviado en la cabecera de la solicitud.
        const documento = req.params.numero_documento;

        // Comparar si el numero de documento enviado es igual al almacenado en la base de datos.
        const aprendizExistente = await Aprendices.findOne({
            where: {
                numero_documento: documento
            }
        });

        // En caso de no encontrar el aprendiz envía un mensaje de error al usuario.
        if(!aprendizExistente){
            return res.status(404).json({ mensaje: 'No se ha encontrado ese aprendiz',aprendiz });
        }

        // Si el aprendiz es encontrado se podrá actualizar sus datos.
        const aprendizActualizado = await aprendizExistente.update(req.body);

        // Se envía al usuario un JSON con el aprendiz y sus datos actualizados.
        res.json({
            mensaje: 'el aprendiz se ha actualizado correctamente',
            aprendiz: aprendizActualizado
        });
    }catch(err) {
        // En caso de error envía un mensaje y los detalles del error al usuario.
        res.status(500).json(err);
    }
};

// Eliminar un aprendiz almacenado en la base de datos por medio de su número de documento.
exports.eliminarAprendiz = async (req,res,) => {
    // Obtener el numero de documento enviado en la cabecera de la solicitud.
    const documento = req.params.numero_documento;

    // Comparar si el numero de documento enviado es igual al almacenado en la base de datos.
    const Aprendiz = await Aprendices.findOne({
        where: {
            numero_documento: documento
        }
    });

    // En caso de no encontrar el aprendiz envía un mensaje de error al usuario.
    if(!Aprendiz){
        return res.status(404).json({ mensaje: 'No se ha encontrado ese aprendiz', Aprendiz });
    };

    // Si el aprendiz se encuentra podrá eliminarse correctamente.
    const eliminarAprendiz = await Aprendices.destroy({
        where: {
            numero_documento: documento
        }
    });

    // Envía mensaje al usuario si el aprendiz se ha eliminado correctamente.
    res.status(200).json({ mensaje: 'El aprendiz ha sido eliminado correctamente'});
    
}; 