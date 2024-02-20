const Instructores = require('../models/Instructor');

exports.nuevoInstructor = async (req, res, next) => {
    try {

        // Crear el aprendiz en la base de datos
        await Instructores.sync({ force: false });
        const instructor = await Instructores.create(req.body);



        // Enviar respuesta con token
        res.json({ mensaje: 'El instructor ha sido registrado exitosamente', instructor});
    } catch (error) {
        console.error('Error al crear un nuevo instructor', error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud', error });
        next();
    }
};

