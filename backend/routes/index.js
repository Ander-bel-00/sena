const express = require('express');
const router = express.Router();
const AprendizController = require('../controllers/AprendizController');
const authController = require('../controllers/authController');
const authRequired = require('../middlewares/validateToken');



module.exports = function () {
    router.post('/login', authController.iniciarSesion); // Nuevo endpoint de inicio de sesión
    router.get('/verify', authController.verifyToken);
    router.post('/logout', authController.logout);


    router.post('/aprendices-add', AprendizController.nuevoAprendiz);
    router.get('/aprendices-get', authRequired,AprendizController.mostrarAprendices);
    router.get('/aprendices/:numero_documento', AprendizController.mostrarAprendizByDocument);
    router.put('/aprendices/:numero_documento', AprendizController.actualizarAprendiz);
    router.delete('/aprendices/:numero_documento', AprendizController.eliminarAprendiz);
    return router;
};
