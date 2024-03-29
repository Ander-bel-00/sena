const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const AprendizController = require('../controllers/AprendizController');
const InstructorController = require('../controllers/InstructorController');
const authController = require('../controllers/authController');
const authRequired = require('../middlewares/validateToken');
const FichasController = require('../controllers/FichasController');
const VisitasController = require('../controllers/VisitasController');
const DocumentsController = require('../controllers/DocumentsController');
const BitacorasController = require('../controllers/BitacorasController');


module.exports = function () {
    // Rutas para el login.
    router.post('/login', authController.iniciarSesion); // Nuevo endpoint de inicio de sesión
    router.post('/logout', authController.logout);
    router.post('/solicitar-restablecimiento-contrasena', authController.solicitarRestablecimientoContrasena);
    router.post('/verificar-correo-electronico', authController.verificarCorreoElectronico);
    router.post('/verificar-codigo', authController.verificarCodigo);
    router.post('/cambiar-contrasena', authController.cambiarContrasena);

    router.get('/verify-token', authRequired, (req, res) => {
        res.json({ usuario: req.usuario });
    });


    // Ruta para obtener la información del usuario autenticado.
    router.get('/usuario', authRequired, (req, res) => {
        // La información del usuario está disponible en req.usuario, que fue establecida por el middleware de autenticación
        res.json({ usuario: req.usuario });
    });

    // Administrador
    router.post('/admin-add', AdminController.nuevoAdmin);

    // Reistrar Fichas.
    router.post('/fichas-add', FichasController.nuevaFicha);
    router.post('/fichas-Admin-new', FichasController.nuevaFichaAdmin);
    // Mostrar todas las Fichas registradas en la base de datos.
    router.get('/fichas-getAll', authRequired,FichasController.mostrarFichas);
    // Mostrar una Ficha por su número de ficha.
    router.get('/fichas-get/:numero_ficha', FichasController.MostrarPorNumeroFicha);
    // Mostrar todos los aprendices asociados a una ficha.
    router.get('/fichas-getAprendices/:numero_ficha', FichasController.aprendicesPorNumeroFicha);
    // Actualizar Ficha por su número de ficha.
    router.put('/fichas-update/:numero_ficha', FichasController.actualizarFicha);
    // Eliminar una Ficha por su número de ficha.
    router.delete('/fichas-delete/:numero_ficha', FichasController.eliminarFicha);

    // Aprendices
    router.post('/aprendices-add', AprendizController.nuevoAprendiz);
    router.get('/aprendices', authRequired,AprendizController.mostrarAprendices);
    router.get('/aprendices/:numero_documento', authRequired,AprendizController.mostrarAprendizByDocument);
    router.put('/aprendices/:numero_documento', authRequired,AprendizController.actualizarAprendiz);
    router.delete('/aprendices/:numero_documento', authRequired,AprendizController.eliminarAprendiz);

    // Rutas para el instructor.
    router.post('/instructores-add', InstructorController.nuevoInstructor);
    router.get('/instructor/:numero_documento/fichas-asignadas', InstructorController.obtenerFichasAsignadas);
    router.get('/instructores/get-All', InstructorController.obtenerInstructores);
    router.get('/instructores/get-Instructor/:id_instructor', InstructorController.obtenerInstructorById);
    router.put('/instructores/update/:id_instructor', InstructorController.actualizarInstructor);
    router.delete('/instructores/delete/:id_instructor', InstructorController.eliminarInstructor);


    // Rutas para las Visitas.
    router.post('/nuevaVisita/:id_aprendiz', VisitasController.crearEvento);
    router.get('/visitas-getAll', VisitasController.obtenerEventos);
    router.get('/visitas-aprendiz/:id_aprendiz', VisitasController.obtenerEventosAprendiz);
    router.put('/visitas-update/:id_visita', VisitasController.actualizarEventos);
    router.delete('/visitas-delete/:id_visita', VisitasController.eliminarEvento);


    // Rutas para los Documentos.
    router.post('/documentos-upload/:id_aprendiz', DocumentsController.cargarDocumento);
    router.get('/documentos-aprendiz/:id_aprendiz', DocumentsController.obtenerDocumentosPorAprendiz);
    // Ruta para obtener todos los documentos de la Base de Datos.
    router.get('/documentos-aprendiz-getAll', DocumentsController.obtenerDocumentos);
    // Ruta para descargar un documento por su nombre de archivo
    router.get('/documentos-download/:nombreArchivo', DocumentsController.descargarDocumento);
    // Ruta para eliminar un documento por su ID
    router.delete('/documentos-delete/:id_documento', DocumentsController.eliminarDocumento);


    // Rutas para las Bitácoras.
    router.post('/bitacoras-upload/:id_aprendiz', BitacorasController.cargarBitacora);
    router.get('/bitacoras-aprendiz/:id_aprendiz', BitacorasController.obtenerBitacorasPorAprendiz);
    // Ruta para obtener todas las bitacoras de la Base de Datos.
    router.get('/bitacoras-aprendiz-getAll', BitacorasController.obtenerBitacoras);
    router.get('/bitacoras-download/:nombreArchivo', BitacorasController.descargarBitacora);
    // Rutas para las Bitácoras.
    router.post('/enviar-observacion/:id_bitacora', BitacorasController.enviarObservacion);

    // Ruta para actualizar una bitácora existente
    router.put('/bitacoras-update/:idBitacora', BitacorasController.actualizarBitacora);
    router.put('/aprobar-bitacora/:idBitacora', BitacorasController.aprobarBitacora);
    router.delete('/bitacoras-delete/:id_bitacora', BitacorasController.eliminarBitacora);

    return router;
};