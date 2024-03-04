const Visitas = require('../models/Visita');
const Aprendices = require('../models/Aprendices');
const moment = require('moment');


exports.crearEvento = async (req, res) => {
    const id_aprendiz = req.params.id_aprendiz;
    const { tipo_visita, fecha, hora } = req.body; // Obtener tipo_visita, fecha y hora del cuerpo de la solicitud
  
    try {
      const aprendices = await Aprendices.findOne({
        where: { id_aprendiz: id_aprendiz }
      });
  
      if (aprendices) {
        await Visitas.sync({ force: false });
        const nuevoEvento = await Visitas.create({
          tipo_visita,
          fecha,
          hora, // Almacenar la hora recibida sin formatear
          aprendiz: id_aprendiz,
          documento_aprendiz: aprendices.numero_documento,
          nombres_aprendiz: aprendices.nombres,
          apellidos_aprendiz: aprendices.apellidos,
          numero_ficha_aprendiz: aprendices.numero_ficha,
        });
  
        res.json(nuevoEvento);
      } else {
        res.status(404).json({ mensaje: "No se encontró el aprendiz" });
      }
    } catch (error) {
      console.error('Error creando el evento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  

// Obtener todos los eventos del calendario
exports.obtenerEventos = async ( req, res) => {
    try {

    const visitas = await Visitas.findAll(); // utiliza el modelo Calendar en la BD
    res.status(201).json({
        visitas: visitas
    }); // método findAll para recuperar eventos almacenados en la BD
    } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.obtenerEventosAprendiz = async(req, res) =>{
    try {
        // Pasa un id por la url
        const idAprendiz = req.params.id_aprendiz;
        const visitas = await Visitas.findAll({
            where: {
                aprendiz: idAprendiz
            }
        });
        if(visitas){
            res.status(200).json({
                visitas: visitas
            })
        }
        else{res.status(404).json({
            mensaje:"No se pudo encontrar visitas"
        })}
        
    } catch (error) {
        res.status(500).json({
            mensaje:"Error en el servidor"
        })
    }
}

exports.actualizarEventos = async(req, res) =>{
    try {
        const idVisita = req.params.id_visita;
        const visita = await Visitas.findOne({
            where: {
                id_visita: idVisita
            }
        });
        if(visita){
            const actualizarVisita = await visita.update(req.body);
            res.status(200).json({
                visitaActualizada: actualizarVisita
            })
        }
    } catch (error) {
        res.status(500).json({
            mensaje:"Error en el servidor"
        })
    }
}



exports.eliminarEvento = async(req, res) =>{
try {
    const idVisita = req.params.id_visita;
    const visita = await Visitas.findOne({
        where:{
            id_visita: idVisita
        }
    });
    if(visita){
        const eliminarVisita = await visita.destroy();
        res.json({mensaje: "La visita se ha eliminado"})
    }
    
} catch (error) {
    res.status(500).json({
        mensaje:"Error en el servidor"
    })
}
}