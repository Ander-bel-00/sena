const Fichas = require('../models/Fichas');
const Aprendices = require('../models/Aprendices');
const Instructores = require('../models/Instructor');
const { Op } = require('sequelize');


// Controlador para crear fichas en la base de datos.
exports.nuevaFicha = async (req, res, next) => {
    try {
        // Crea la tabla fichas en la base de datos si no existe.
        await Fichas.sync({ force: false });

        const fichaExistente = await Fichas.findOne({
            where: {
                numero_ficha: req.body.numero_ficha
            }
        });

        if (fichaExistente) {
            res.status(500).json({ mensaje: 'La ficha ya se encuentra registrada' });
        } else {
            // Crea la ficha con los datos proporcionados desde el cuerpo del formulario.
            const ficha = await Fichas.create(req.body);

            // Actualizar el campo fichas_asignadas del instructor que está creando la ficha
            const instructor = await Instructores.findOne({
                where: {
                    id_instructor: req.body.id_instructor
                }
            });

            if (instructor) {
                let nuevasFichasAsignadas = instructor.fichas_asignadas || '';
                nuevasFichasAsignadas += (nuevasFichasAsignadas ? ',' : '') + req.body.numero_ficha;
                await instructor.update({ fichas_asignadas: nuevasFichasAsignadas });
            }

            // Envíar un mensaje con los datos de la ficha que se ha creado.
            res.status(201).json({ mensaje: 'La ficha se ha registrado exitosamente', ficha });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Hubo un error en la solicitud', error });
    }
};

// Controlador para crear fichas en la base de datos.
exports.nuevaFichaAdmin = async (req, res, next) => {
    try {
        // Crea la tabla fichas en la base de datos si no existe.
        await Fichas.sync({ force: false });

        const fichaExistente = await Fichas.findOne({
            where: {
                numero_ficha: req.body.numero_ficha
            }
        });

        if (fichaExistente) {
            res.status(500).json({ mensaje: 'La ficha ya se encuentra registrada' });
        } else {
            // Crea la ficha con los datos proporcionados desde el cuerpo del formulario.
            const ficha = await Fichas.create(req.body);
            // Envíar un mensaje con los datos de la ficha que se ha creado.
            res.status(201).json({ mensaje: 'La ficha se ha registrado exitosamente', ficha });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Hubo un error en la solicitud', error });
    }
};

// Controlador para mostar todas las fichas alamcenadas en la base de datos.
exports.mostrarFichas = async (req, res, next) => {
    try {

        const fichas = await Fichas.findAll();

        // Si no se encuentra ninguna ficha, envíar un mensaje de error.
        if (fichas.length === 0 ) {

            res.status(404).json({ mensaje: 'No se han encontrado fichas registradas' });
        }else{
            // Mostrar todas las fichas registradas en la base de datos.
            res.status(200).json({ fichas: fichas});
        }
    } catch (error) {
        
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error en la solicitud', error});
    }
};

// Controlador para mostrar una ficha por su número de ficha.
exports.MostrarPorNumeroFicha = async (req, res, next) => {
    try {
        const ficha = await Fichas.findOne({
            where: {
                numero_ficha: req.params.numero_ficha
            }
        });
        if (ficha) return res.status(200).json({ ficha: ficha });
        return res.status(404).json({ mensaje: 'No se ha podido encontrar la ficha solicitada por ese número de ficha'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud', error})
    }
};

// Mostrar los aprendices asociados a una Ficha por su número de Ficha.
exports.aprendicesPorNumeroFicha = async (req, res, next) => {
    try {
        // Número de ficha que se pasa comoaprametro en la solicitud.
        const numeroFicha = req.params.numero_ficha;

        // Buscar la ficha por su número de ficha
        const ficha = await Fichas.findOne({
            where: {
                numero_ficha: numeroFicha
            }
        });

        // Si no se encuentra la ficha, retornar un mensaje de error
        if (!ficha) {
            return res.status(404).json({ mensaje: 'No se encontró la ficha correspondiente al número proporcionado' });
        }

        // Obtener los aprendices asociados a esa ficha
        const aprendices = await Aprendices.findAll({
            where: {
                numero_ficha: numeroFicha
            }
        });

        // Retornar los aprendices asociados a la ficha encontrada
        res.json({ mensaje: `Aprendices asociados a la ficha ${numeroFicha}`, aprendices });
    } catch (error) {
        console.error('Error al obtener los aprendices asociados a la ficha', error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud', error });
        next();
    }
};

// Actualizar los datos de una ficha por su número de ficha.
exports.actualizarFicha = async (req, res, next) => {
    try {
        // Número de ficha que se pasa como parámetro en la solicitud.
        const numeroFicha = req.params.numero_ficha;

        // Buscar la Ficha en la base de datos.
        const ficha = await Fichas.findOne({
            where: {
                // Compara el numero de ficha almacenado en la BD con el enviado en la solicitud.
                numero_ficha: numeroFicha
            }
        });

        // Si no se encuentra la ficha enviar un mensaje de error.
        if (!ficha) {
            return res.status(404).json({ mensaje: 'No se ha podido encontrar la ficha' });
        } else {
            // Si se encuentra la ficha se actualizan sus datos con lo enviado en el formulario.
            const fichaActualizada = await ficha.update(req.body);

            // Actualizar los datos de los aprendices asociados a esta ficha
            await Aprendices.update(req.body, {
                where: {
                    numero_ficha: numeroFicha
                }
            });

            // Si todo sale bien se envía un código de estado 201(creado) y se muestran los nuevos datos.
            res.status(201).json({
                mensaje: 'La ficha se ha actualizado correctamente',
                ficha: fichaActualizada
            });
        }
        
    } catch (error) {
        // Mostrar mensaje en caso de error en el servidor o la base de datos.
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud', error});
    }
}


// Eliminar ficha por su numero de ficha.
exports.eliminarFicha = async (req, res, next) => {
    try {
        const numeroFicha = req.params.numero_ficha;

        // Buscar la ficha que se va a eliminar
        const ficha = await Fichas.findOne({
            where: {
                numero_ficha: numeroFicha
            }
        });

        if (!ficha) {
            return res.status(404).json({ mensaje: 'No se ha podido encontrar esa ficha' });
        } else {
            // Eliminar la ficha de la base de datos
            await ficha.destroy();

            // Actualizar el campo fichas_asignadas en la tabla de instructores
            const instructores = await Instructores.findAll({
                where: {
                    fichas_asignadas: {
                        [Op.like]: `%${numeroFicha}%` // Buscar instructores que tengan asignada la ficha que se está eliminando
                    }
                }
            });

            // Actualizar el campo fichas_asignadas en cada instructor encontrado
            for (const instructor of instructores) {
                let nuevasFichasAsignadas = instructor.fichas_asignadas;
                if (Array.isArray(nuevasFichasAsignadas)) {
                    nuevasFichasAsignadas = nuevasFichasAsignadas.filter(f => f !== numeroFicha).join(',');
                } else {
                    nuevasFichasAsignadas = nuevasFichasAsignadas.split(',').filter(f => f !== numeroFicha).join(',');
                }
                await instructor.update({ fichas_asignadas: nuevasFichasAsignadas });
            }

            res.status(200).json({ mensaje: 'La ficha se ha eliminado correctamente' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud', error });
    }
};