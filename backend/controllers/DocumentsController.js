const Documentos = require('../models/Documentos');
const multer = require('multer');
const fs = require('fs'); // Importar el módulo fs para trabajar con el sistema de archivos
const path = require('path');

// Configurar el storage para multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/')); // Utiliza path.join para construir la ruta de destino
    },
    filename: function (req, file, cb) {
        // Define el nombre del archivo cargado
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Inicializar multer con la configuración de storage
const upload = multer({ storage: storage }).single('archivo');

// Controlador para cargar un documento
exports.cargarDocumento = async (req, res) => {
    try {
        // Usa multer para cargar el archivo
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Si hay un error de Multer, envía una respuesta de error
                return res.status(500).json({ message: 'Error al cargar el archivo', error: err });
            } else if (err) {
                // Si hay otro tipo de error, envía una respuesta de error
                return res.status(500).json({ message: 'Error al cargar el archivo', error: err });
            }

            // Si no hay errores, crea un nuevo documento en la base de datos
            const { tipo_documento } = req.body;
            const archivo = req.file.filename;
            const id_aprendiz = req.params.id_aprendiz;

            await Documentos.sync({ force: false });

            // Guarda el documento en la base de datos, incluyendo el ID del usuario que lo cargó
            const nuevoDocumento = await Documentos.create({ tipo_documento, archivo, id_aprendiz });

            // Envía una respuesta de éxito
            res.status(201).json({ message: 'Documento cargado exitosamente', documento: nuevoDocumento });
        });
    } catch (error) {
        // Si hay un error, envía una respuesta de error
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
        const { id } = req.params;

        // Buscar el documento en la base de datos por su ID
        const documento = await Documentos.findByPk(id);

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
