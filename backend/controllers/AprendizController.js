const Aprendices = require('../models/Aprendices');
const bcrypt = require('bcryptjs');


// Registrar nuevo aprendiz a la Base de datos.
exports.nuevoAprendiz = async (req, res, next) => {
    try{
        // Encriptar la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(req.body.contrasena, 10); // 10 es el número de rondas de hashing

        // Reemplazar la contraseña original por la contraseña encriptada
        req.body.contrasena = hashedPassword;

        // Crea la tabla Aprendices en la base de datos en caso de que no existir.
        await Aprendices.sync({ force: false });

        // Registar un aprendiz con los datos obtenidos del cuerpo de la solicitud HTTP.
        const aprendiz = await Aprendices.create(req.body);

        // Envíar un mensaje en pantalla con un objeto JSON si todo ha salido correctamente.
        res.json( {mensaje:'El aprendiz ha sido registrado exitosamente', aprendiz });

    }catch(error){
        // En caso de error envía un mensaje y los detalles del error al usuario.
        console.error('Error al crear un nuevo aprendiz', error);

        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud',error} );

        // Pasar al siguiente middleware. 
        next();
    }
};


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