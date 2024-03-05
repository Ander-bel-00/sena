const Instructores = require('../models/Instructor');
const Fichas = require('../models/Fichas');
const InstructorFicha = require('../models/InstructorFicha');
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

        // Buscar las fichas correspondientes a los números de ficha proporcionados
        const numerosFicha = req.body.fichas_asignadas;
        const fichas = await Fichas.findAll({
            where: {
                numero_ficha: numerosFicha
            }
        });

        // Si no se encuentran las fichas, retornar un error
        if (!fichas || fichas.length !== numerosFicha.length) {
            return res.status(404).json({ mensaje: 'No se encontraron todas las fichas correspondientes a los números proporcionados' });
        }

        await Instructores.sync({ force: false});

        // Crear el instructor con los datos de las fichas asignadas
        const instructorData = {
            ...req.body,
            // Incluir los IDs de las fichas asignadas en el campo 'fichas_asignadas'
            fichas_asignadas: fichas.map(ficha => ficha.numero_ficha)
        };

        // Verificar si el instructor existe antes de crearlo
        const instructorExistente = await Instructores.findOne({
            where: {
                numero_documento: req.body.numero_documento
            }
        });

        // Si el instructor existe, enviar un mensaje de error; de lo contrario, crear el instructor
        if (instructorExistente) {
            res.status(500).json({ mensaje: 'El instructor ya se encuentra registrado'});
        } else {
            // Crear el instructor en la base de datos
            const instructor = await Instructores.create(instructorData);

            // Enviar mensaje de respuesta con los datos del instructor creado
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
};

// Obtener todas las fichas asociadas a un instructor.
exports.obtenerFichasAsignadas = async (req, res, next) => {
    try {
        // Obtener el número de documento del instructor de los parámetros de la solicitud
        const { numero_documento } = req.params;

        // Buscar al instructor por su número de documento
        const instructor = await Instructores.findOne({
            where: {
                numero_documento
            }
        });

        // Si no se encuentra al instructor, enviar un mensaje de error
        if (!instructor) {
            return res.status(404).json({ mensaje: 'Instructor no encontrado' });
        }

        // Obtener los números de ficha asignados al instructor
        const numerosFichaAsignados = instructor.fichas_asignadas;

        // Buscar las fichas correspondientes a los números de ficha asignados
        const fichasAsignadas = await Fichas.findAll({
            where: {
                numero_ficha: numerosFichaAsignados
            }
        });

        // Enviar las fichas asignadas como respuesta
        res.json({ fichasAsignadas });
    } catch (error) {
        console.error('Error al obtener las fichas asignadas del instructor', error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud', error });
        next();
    }
};

