const express = require('express');
const router = express.Router();
const AprendizController = require('../controllers/AprendizController');
const InstructorController = require('../controllers/InstructorController');
const authController = require('../controllers/authController');
const authRequired = require('../middlewares/validateToken');



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

    router.post('/aprendices-add', AprendizController.nuevoAprendiz);
    router.get('/aprendices', authRequired,AprendizController.mostrarAprendices);
    router.get('/aprendices/:numero_documento', AprendizController.mostrarAprendizByDocument);
    router.put('/aprendices/:numero_documento', AprendizController.actualizarAprendiz);
    router.delete('/aprendices/:numero_documento', AprendizController.eliminarAprendiz);


    // Rutas para el instructor
    router.post('/instructores-add', InstructorController.nuevoInstructor);
    return router;
};
