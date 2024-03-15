const Bitacoras = require('../models/Bitacoras');
const Aprendices = require('../models/Aprendices');
const shortid = require('shortid');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../bitacoras/'));
    },
    filename: function (req, file, cb) {
        const uniqueFilename = shortid.generate() + '-' + file.originalname;
        cb(null, uniqueFilename);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        const allowedFileTypes = ['.xls', '.xlsx', '.gsheet'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (allowedFileTypes.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de Excel o hojas de cálculo de Google'));
        }
    }
}).single('archivo');


exports.cargarBitacora = async (req, res, next) => {
    upload(req, res, async function(err) {
        if (err) {
            return res.status(400).json({ mensaje: err.message });
        }
        
        try {
            // Primero sincroniza la tabla Bitacoras
            await Bitacoras.sync({ force: false });

            // Verificar si ya se ha subido una bitácora con el mismo número para el mismo aprendiz
            const existingBitacora = await Bitacoras.findOne({
                where: {
                    numero_de_bitacora: req.body.numero_de_bitacora,
                    id_aprendiz: req.params.id_aprendiz
                }
            });
            
            if (existingBitacora) {
                // Eliminar el archivo subido si ya existe una bitácora con el mismo número para este aprendiz
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ mensaje: 'Ya se ha subido una bitácora con el mismo número para este aprendiz' });
            }

            const aprendiz = await Aprendices.findOne({
                where: {
                    id_aprendiz: req.params.id_aprendiz
                }
            });

            if (!aprendiz) return res.status(404).json({ mensaje: 'El aprendiz no existe' });

            // Si no existe una bitácora existente, procede a crearla y guardar el archivo
            const nuevaBitacora = {
                numero_de_bitacora: req.body.numero_de_bitacora,
                archivo: req.file.filename,
                id_aprendiz: aprendiz.id_aprendiz,
                numero_documento: aprendiz.numero_documento,
                nombres: aprendiz.nombres,
                apellidos: aprendiz.apellidos,
                numero_ficha: aprendiz.numero_ficha,
                programa_formacion: aprendiz.programa_formacion,
            };

            // Establecer las observaciones como vacías después de crear la nueva bitácora
            nuevaBitacora.observaciones = '';

            await Bitacoras.create(nuevaBitacora);

            return res.json({ mensaje: 'Bitácora cargada exitosamente', bitacora: nuevaBitacora });
        } catch (error) {
            return res.status(500).json({ mensaje: 'Error al procesar la bitácora', error: error });
        }
    });
};

// Controlador para obtener todas las bitacoras de un aprendiz
exports.obtenerBitacorasPorAprendiz = async (req, res) => {
    try {
        const { id_aprendiz } = req.params;

        // Buscar todas las bitacoras asociadas al id_aprendiz
        const bitacoras = await Bitacoras.findAll({
            where: { id_aprendiz }
        });

        if (bitacoras.length === 0) {
            res.status(404).json({ mensaje: 'No hay bitacoras cargadas por ese aprendiz' });
        } else {
            res.status(200).json({ bitacoras });
        }
        
    } catch (error) {
        console.error('Error al obtener las bitacoras del aprendiz:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todos las bitacoras registradas en la Base de datos.
exports.obtenerBitacoras = async (req, res, next) => {
    try {
        const bitacoras = await Bitacoras.findAll();

        if (bitacoras.length < 0) return res.status(404).json({ message: 'No hay bitacoras registradas' });

        res.status(200).json({
            bitacoras: bitacoras
        });
    } catch (error) {
        console.error('Error al obtener las bitacoras', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


// Ruta para descargar un archivo por su nombre
exports.descargarBitacora = async (req, res) => {
    try {
        const nombreArchivo = req.params.nombreArchivo;
        const rutaArchivo = path.join(__dirname, '../bitacoras', nombreArchivo);
        
        // Verificar si el archivo existe
        if (!fs.existsSync(rutaArchivo)) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }

        // Enviar el archivo como respuesta
        res.download(rutaArchivo);
    } catch (error) {
        console.error('Error al descargar el archivo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Controlador para enviar observaciones a una bitácora
exports.enviarObservacion = async (req, res) => {
    try {
        const { id_bitacora } = req.params;
        const { observaciones } = req.body;

        // Buscar la bitácora por su ID
        const bitacora = await Bitacoras.findByPk(id_bitacora);

        if (!bitacora) {
            return res.status(404).json({ mensaje: 'La bitácora no existe' });
        }

        // Actualizar las observaciones de la bitácora
        bitacora.observaciones = observaciones;
        await bitacora.save();

        return res.status(200).json({ mensaje: 'Observaciones enviadas correctamente' });
    } catch (error) {
        console.error('Error al enviar observaciones:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Controlador para aprobar una bitácora
exports.aprobarBitacora = async (req, res) => {
    try {
        const { idBitacora } = req.params;

        // Buscar la bitácora por su ID
        const bitacora = await Bitacoras.findByPk(idBitacora);

        if (!bitacora) {
            return res.status(404).json({ mensaje: 'La bitácora no existe' });
        }

        // Cambiar el estado de aprobación de la bitácora a true
        bitacora.estado = true;
        // Borrar las observaciones asociadas a la bitácora
        bitacora.observaciones = '';
        await bitacora.save();

        return res.status(200).json({ mensaje: 'Bitácora aprobada correctamente' });
    } catch (error) {
        console.error('Error al aprobar la bitácora:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


exports.actualizarBitacora = async (req, res) => {
    try {
        // Obtener el id de la bitácora desde los parámetros de la solicitud
        const { idBitacora } = req.params;

        // Buscar la bitácora por su ID
        const bitacora = await Bitacoras.findByPk(idBitacora);

        // Verificar si la bitácora existe
        if (!bitacora) {
            return res.status(404).json({ mensaje: 'La bitácora no existe' });
        }

        // Verificar si la bitácora tiene observaciones
        if (!bitacora.observaciones || bitacora.observaciones.trim() === '') {
            return res.status(400).json({ mensaje: 'La bitácora no tiene observaciones, por lo que no puede ser actualizada' });
        }

        // Procesar la carga del archivo
        upload(req, res, async function(err) {
            if (err) {
                return res.status(400).json({ mensaje: err.message });
            }

            // Eliminar el archivo antiguo si existe
            const filePath = path.join(__dirname, '../bitacoras/', bitacora.archivo);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Actualizar los datos de la bitácora
            bitacora.numero_de_bitacora = req.body.numero_de_bitacora || bitacora.numero_de_bitacora;
            bitacora.archivo = req.file.filename; // Utilizar el nombre del archivo cargado
            
            // Establecer las observaciones como vacías después de la actualización
            bitacora.observaciones = '';

            // Guardar los cambios en la base de datos
            await bitacora.save();

            return res.status(200).json({ mensaje: 'Bitácora actualizada correctamente', bitacora });
        });
    } catch (error) {
        console.error('Error al actualizar la bitácora:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


exports.eliminarBitacora = async (req, res, next) => {
    try {
        // Buscar la bitácora por su ID
        const bitacora = await Bitacoras.findByPk(req.params.id_bitacora);

        // Verificar si la bitácora existe
        if (!bitacora) {
            return res.status(404).json({ mensaje: 'La bitácora no existe' });
        }

        // Eliminar la bitácora de la base de datos
        await bitacora.destroy();

        // Eliminar el archivo de la carpeta bitacoras
        const filePath = path.join(__dirname, '../bitacoras/', bitacora.archivo);
        fs.unlinkSync(filePath);

        return res.json({ mensaje: 'Bitácora eliminada exitosamente' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al eliminar la bitácora', error: error });
    }
};