const express = require('express');
const router = express.Router();

// Importar el controlador de los aprendices.
const AprendizController = require('../controllers/AprendizController');

module.exports = function (){

    // Registrar un nuevo aprendiz.
    router.post('/aprendices', AprendizController.nuevoAprendiz);

    // Obtener todos los aprendices almacenados en la base de datos.
    router.get('/aprendices', AprendizController.mostrarAprendices);

    // Obtener un aprendiz almacenados en la base de datos por medio de su núemro de documento.
    router.get('/aprendices/:numero_documento', AprendizController.mostrarAprendizByDocument);

    // Actualizar los datos de un aprendiz almacenado en la base de datos.
    router.put('/aprendices/:numero_documento', AprendizController.actualizarAprendiz);

    // Eliminar un aprendiz de la base de datos por medio de su núemro de documento.
    router.delete('/aprendices/:numero_documento', AprendizController.eliminarAprendiz);

    return router;
}