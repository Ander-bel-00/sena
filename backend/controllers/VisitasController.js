
const Visita = require('../models/Visita');
const Aprendices = require('../models/Aprendices');


// Sincroniza el modelo con la base de datos al inicio de la aplicación
Visita.sync({ force: false })
  .then(() => {
    console.log('Modelo Calendar sincronizado correctamente con la base de datos');
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo Calendar:', error);
  });



  exports.crearEvento = async (req, res) => {
    const id_aprendiz = req.params.id_aprendiz;           //obtener id del aprendiz desde url
    try {
        //Se buscará el aprendiz en la BD con el id basado en URL
        const aprendiz = await Aprendices.findOne({
            where: {id_aprendiz: id_aprendiz}
        })
        // si el aprendiz existe se creará la vista
        
        if(aprendiz){
            //Se toma lo enviado desde el cuerpo del formmulario y en el campo aprendiz tendrá el valor del id aprendiz
            const calendarData = {
                ...req.body, //copia todo lo que contiene el cuerpo
                aprendiz: id_aprendiz   //se añade automaticamente con el id obtenido
            }
            await Visita.sync({ force: false});
            const nuevoEvento = await Visita.create(calendarData); // Crea nuevo evento
            res.json(nuevoEvento); // Manda respuesta en formato JSON
        } else(res.status(404).json({mensaje:"no se encontro el aprendiz"}))
    } catch (error) {
      console.error('Error creando el evento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

    // Obtener todos los eventos del calendario
    exports.obtenerEventos = async ( res) => {
        try {

        const events = await Visita.findAll(); // utiliza el modelo Calendar en la BD
        res.status(201).json(events); // método findAll para recuperar eventos almacenados en la BD
        } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    exports.obtenerEventosAprendiz = async(req, res) =>{
        try {
            // Pasa un id por la url
            const idAprendiz = req.params.id_aprendiz;
            const visitas = await Visita.findAll({
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
            const visita = await Visita.findOne({
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
        const visita = await Visita.findOne({
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