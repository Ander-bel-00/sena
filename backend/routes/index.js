const express = require('express');
const router = express.Router();
const AprendizController = require('../controllers/AprendizController');
const InstructorController = require('../controllers/InstructorController');
const authController = require('../controllers/authController');
const authRequired = require('../middlewares/validateToken');
const FichasController = require('../controllers/FichasController');



module.exports = function () {
    router.post('/login', authController.iniciarSesion); // Nuevo endpoint de inicio de sesión
    router.post('/logout', authController.logout);

    router.get('/verify-token', authRequired, (req, res) => {
        res.json({ usuario: req.usuario });
    });


    // Ruta para obtener la información del usuario autenticado
    router.get('/usuario', authRequired, (req, res) => {
        // La información del usuario está disponible en req.usuario, que fue establecida por el middleware de autenticación
        res.json({ usuario: req.usuario });
    });

    // Reistrar Fichas.
    router.post('/fichas-add', FichasController.nuevaFicha);
    // Mostrar todas las Fichas registradas en la base de datos.
    router.get('/fichas-getAll', FichasController.mostrarFichas);
    // Mostrar una Ficha por su número de ficha.
    router.get('/fichas-get/:numero_ficha', FichasController.MostrarPorNumeroFicha);
    // Mostrar todos los aprendices asociados a una ficha.
    router.get('/fichas-getAprendices/:numero_ficha', FichasController.aprendicesPorNumeroFicha);
    // Actualizar Ficha por su número de ficha.
    router.put('/fichas-update/:numero_ficha', FichasController.actualizarFicha);
    // Eliminar una Ficha por su número de ficha.
    router.delete('/fichas-delete/:numero_ficha', FichasController.eliminarFicha);

    router.post('/aprendices-add', AprendizController.nuevoAprendiz);
    router.get('/aprendices', authRequired,AprendizController.mostrarAprendices);
    router.get('/aprendices/:numero_documento', AprendizController.mostrarAprendizByDocument);
    router.put('/aprendices/:numero_documento', AprendizController.actualizarAprendiz);
    router.delete('/aprendices/:numero_documento', AprendizController.eliminarAprendiz);


    // Rutas para el instructor
    router.post('/instructores-add', InstructorController.nuevoInstructor);
    return router;
};