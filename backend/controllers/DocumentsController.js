const Documentos = require('../models/Documentos');
const Aprendices = require('../models/Aprendices');
const shortid = require('shortid');
const multer = require('multer');
const fs = require('fs'); // Importar el módulo fs para trabajar con el sistema de archivos
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/')); 
    },
    filename: function (req, file, cb) {
        const uniqueFilename = shortid.generate() + '-' + file.originalname;
        cb(null, uniqueFilename);
    }
});

const upload = multer({ storage: storage }).single('archivo');

exports.cargarDocumento = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: 'Error al cargar el archivo', error: err });
            } else if (err) {
                return res.status(500).json({ message: 'Error al cargar el archivo', error: err });
            }

            const { tipo_documento } = req.body;

            await Documentos.sync({ force: false });

            const aprendiz = await Aprendices.findOne({
                where: {
                    id_aprendiz: req.params.id_aprendiz
                }
            });

            if (!aprendiz) {
                fs.unlinkSync(req.file.path); // Eliminar el archivo si el aprendiz no existe
                return res.status(404).json({ mensaje: 'El aprendiz no existe' });
            }

            const nuevoDocumento = await Documentos.create({ 
                tipo_documento, 
                archivo: req.file.filename,
                id_aprendiz: aprendiz.id_aprendiz,
                numero_documento: aprendiz.numero_documento,
                nombres: aprendiz.nombres,
                apellidos: aprendiz.apellidos,
                numero_ficha: aprendiz.numero_ficha,
                programa_formacion: aprendiz.programa_formacion,
            
            });

            res.status(201).json({ message: 'Documento cargado exitosamente', documento: nuevoDocumento });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar el documento', error: error.message });
    }
};


// Controlador para obtener todos los documentos de un aprendiz
exports.obtenerDocumentosPorAprendiz = async (req, res) => {
    try {
        const { id_aprendiz } = req.params;

        // Buscar todos los documentos asociados al id_aprendiz
        const documentos = await Documentos.findAll({
            where: { id_aprendiz }
        });

        res.status(200).json({ documentos });
    } catch (error) {
        console.error('Error al obtener los documentos del aprendiz:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todos los documentos registrados en la Base de datos.
exports.obtenerDocumentos = async (req, res, next) => {
    try {
        const documentos = await Documentos.findAll();

        if (documentos.length < 0) return res.status(404).json({ message: 'No hay documentos registrados' });

        res.status(200).json({
            documentos: documentos
        });
    } catch (error) {
        console.error('Error al obtener los documentos', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Ruta para descargar un archivo por su nombre
exports.descargarDocumento = async (req, res) => {
    try {
        const nombreArchivo = req.params.nombreArchivo;
        const rutaArchivo = path.join(__dirname, '../uploads', nombreArchivo);
        
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


// Ruta para eliminar un documento por su ID
exports.eliminarDocumento = async (req, res, next) => {
    try {
        // Obtener el ID del documento a eliminar
        const { id_documento } = req.params;

        // Buscar el documento en la base de datos por su ID
        const documento = await Documentos.findByPk(id_documento);

        // Verificar si el documento existe
        if (!documento) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        // Eliminar el archivo de la carpeta de uploads
        eliminarArchivo(documento.archivo);

        // Eliminar el documento de la base de datos
        await documento.destroy();

        res.status(200).json({ message: 'Documento eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Función para eliminar un archivo de la carpeta de uploads
const eliminarArchivo = (nombreArchivo) => {
    const rutaArchivo = path.join(__dirname, '../uploads', nombreArchivo);
    fs.unlink(rutaArchivo, (error) => {
        if (error) {
            console.error('Error al eliminar el archivo:', error);
        } else {
            console.log('Archivo eliminado exitosamente');
        }
    });
};
