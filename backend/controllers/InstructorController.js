const Instructores = require('../models/Instructor');
const Fichas = require('../models/Fichas');
const bcrypt = require('bcryptjs');

exports.nuevoInstructor = async (req, res, next) => {
    try {
        // Verificar si la contraseña cumple con los requisitos
        const contrasena = req.body.contrasena;
        if (!esContrasenaValida(contrasena)) {
            return res.status(400).json({ mensaje: 'La contraseña debe contener al menos una letra minuscula, una mayuscula, un caracter especial y 5 números' });
        }

        // Encriptar la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(req.body.contrasena, 10);
        req.body.contrasena = hashedPassword;

        // Buscar la ficha correspondiente al número de ficha proporcionado
        const ficha = await Fichas.findOne({
            where: {
                numero_ficha: req.body.ficha_asignada
            }
        });

        // Si no se encuentra la ficha, retornar un error
        if (!ficha) {
            return res.status(404).json({ mensaje: 'No se encontró la ficha correspondiente al número proporcionado' });
        }

        await Instructores.sync({ force: false });

        // Crear el instructor con los datos de la ficha
        const instructorData = {
            ...req.body,
            // Incluye los campos de la ficha en los datos del instructor
            programa_formacion: ficha.programa_formacion,
            nivel_formacion: ficha.nivel_formacion,
            titulo_obtenido: ficha.titulo_obtenido,
            fecha_fin_lectiva: ficha.fecha_fin_lectiva
        };

        // Verificar si el instructorexiste antes de crearlo.
        const instructorExistente = await Instructores.findOne({
            where: {
                numero_documento: req.body.numero_documento
            }
        });

        // Si el instructor existe me envia un mensaje de error, de lo contrario me crea el instructor.
        if (instructorExistente) {
            res.status(500).json({ mensaje: 'El instructor ya se encuentra registrado'});
        }else{
            // Crea el instructor en la base de datos
            const instructor = await Instructores.create(instructorData);

            // Enviar mesnaje de respuesta con los datos de el instructor creado.
            res.json({ mensaje: 'El instructor ha sido registrado exitosamente', instructor });
        }
    } catch (error) {
        console.error('Error al crear un nuevo instructor', error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud', error });
        next();
    }
};

function esContrasenaValida(contrasena) {
    // Longitud mínima de 8 caracteres
    if (contrasena.length < 8) {
        return false;
    }

    // Al menos una letra mayúscula
    if (!/[A-Z]/.test(contrasena)) {
        return false;
    }

    // Al menos una letra minúscula
    if (!/[a-z]/.test(contrasena)) {
        return false;
    }

    // Al menos un número
    if (!/\d/.test(contrasena)) {
        return false;
    }

    // Al menos un caracter especial.
    if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(contrasena)) {
        return false;
    }

    // Si pasa todas las verificaciones, la contraseña es válida
    return true;
}

