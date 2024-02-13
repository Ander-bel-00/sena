const express = require('express');
const router = express.Router();
const AprendizController = require('../controllers/AprendizController');

module.exports = function () {
    router.post('/aprendices', AprendizController.nuevoAprendiz);
    router.post('/aprendices/login', AprendizController.iniciarSesion); // Nuevo endpoint de inicio de sesión
    router.get('/aprendices', AprendizController.mostrarAprendices);
    router.get('/aprendices/:numero_documento', AprendizController.mostrarAprendizByDocument);
    router.put('/aprendices/:numero_documento', AprendizController.actualizarAprendiz);
    router.delete('/aprendices/:numero_documento', AprendizController.eliminarAprendiz);
    return router;
};
