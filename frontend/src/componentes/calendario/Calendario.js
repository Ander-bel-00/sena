import React, { useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import LogoComponent from "./LogoComponent";
import BasicTimePicker from './BasicTimeClock';
import { IoArrowBackSharp } from "react-icons/io5";
import moment from 'moment';
import 'moment/locale/es';
import { Link, useParams } from 'react-router-dom';
import clienteAxios from '../../api/axios';

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  dayFormat: (date, culture, localizer) =>
    localizer.format(date, 'dddd', culture),
};


const localizer = momentLocalizer(moment)

function Calendario({events, setEvents, showModal, setShowModal, selectedDate, setSelectedDate, eventTitle, setEventTitle, selectEvent, setSelectEvent, selectedTime, setSelectedTime}) {
  moment.locale('es');
  const { numero_ficha, rol_usuario, id_aprendiz } = useParams();


   // Función para abrir el modal
   const openModal = (date) => {
    setShowModal(true);
    setSelectedDate(date);
    setEventTitle('');
    setSelectEvent(null);
    // Puedes inicializar otros valores aquí si es necesario
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setEventTitle('');
    setSelectEvent(null);
  };

    const saveEvent = async () => {
      if (!eventTitle) {
        console.error('El tipo de visita no puede estar vacío');
        return;
      }

      // Obtén el valor del input de tipo time
      const horaInput = document.querySelector('input[name="hora"]');
      const selectedTime = horaInput.value;

      try {
        const response = await clienteAxios.post(`/nuevaVisita/${id_aprendiz}`, {
          tipo_visita: eventTitle,
          fecha: selectedDate,
          hora: selectedTime,
          // Otros datos que necesites enviar
        });

        setEvents([...events, response.data]);
        closeModal();
      } catch (error) {
        console.error('Error al guardar el evento:', error);
        // Maneja el error según sea necesario
      }
    };

    // Agrega useEffect para cargar eventos al montar el componente
    useEffect(() => {
      const cargarEventos = async () => {
        try {
          const response = await clienteAxios.get('/visitas-getAll', {
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          setEvents(response.data);
        } catch (error) {
          console.error('Error al cargar eventos:', error);
        }
      };
    
      cargarEventos();
    }, []);

    console.log('Eventos:', events);


  
      
      return (
        <div style={{height:'500px'}}>

        <button className='relative left-10 top-14'><Link to={`/${rol_usuario}/aprendicesFicha/${numero_ficha}`} className='Regresar'><IoArrowBackSharp 
        className='inline-block'/> Regresar</Link></button>

        {/* Logo del sena */}
        {/*npm install @mui/lab
        npm install @mui/material @emotion/react @emotion/styled
        npm install dayjs
        npm install @mui/x-date-pickers
        */}
         <LogoComponent /> 
         
        
         
  
         
         <Calendar
            culture='es'
            localizer={localizer}
            
            startAccessor="start"
            endAccessor="end"
            style={{ margin: '50px' }}
            selectable={true}
            onSelectSlot={(slotInfo) => openModal(slotInfo.start)}
            events={events.map(event => ({
              ...event,
              start: new Date(event.fecha),
              end: new Date(event.fecha),  // Puedes ajustar esto según sea necesario
              title: `${event.tipo_visita} - ${moment(event.fecha).format('LT')}`
            }))}
            // onSelectEvent={handleSelectedEvent}
            messages={messages} // Aquí pasamos los mensajes definidos arriba
          />

  
  
  
    {showModal &&  (
      
      <div class="modal" style={{display:'block', 
      backgroundColor:'rgba(0.0.0.0.5)', 
      position:'fixed', 
      top:0, 
      bottom:0, 
      left:0, 
      right:0,
      outline: '2px solid #ffffff', // Contorno blanco de 2 píxeles
      }}>
  
      <div className="modal-dialog" style={{ maxWidth: '600px',
      margin: 'auto', 
      top: '100px' 
        }}>
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#39A900', 
                color: '#ffffff' }}>
                  
  
                  {/* Logo del sena MODAL */}
                  <img src={require('./img/image 19.png')} />
  
                
  
            {/* Titulo del modal */}
            <h5 className="modal-title" style={{ marginLeft: '160px' }}>
                {selectEvent ? "Editar Evento" : "Agendar Visita"}
                {selectedDate && (
                  <p style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '32px' }}>
                    {`${moment(selectedDate).format('LL')} ${selectedTime}`}
                  </p>
                )}
          </h5>
  
  
            <button type="button" class="btn-close" 
            onClick={()=> { 
            setShowModal(false)
            setEventTitle("");
            setSelectEvent(null);
          }}></button>
  
          </div>
          
          {/*Inputs para el modal de agendamiento de visita*/}
          <div class="modal-body" >
            <label style={{ fontWeight: 'bold' }}>Tipo de visita: </label>
            <select
                name="tipo_visita"
                // value={tipo_visita}
                // onChange={onChange}

                id="eventTitle"
                value={eventTitle}
                onChange={(e) =>setEventTitle(e.target.value)}
                className="w-80 bg-white text-black px-4 py-2 rounded-md my-4 border ml-6"
              >
                <option>Selecciona un número de visita...</option>
                <option value="visitaN°1">Primer visita</option>
                <option value="visitaN°2">Segunda visita</option>
                <option value="visitaN°3">Tercera visita</option>
                
              </select>
  
            {/* Input de la hora */}
  
            <label style={{ fontWeight: 'bold' }}>Hora:</label>
            <input type='time' name='hora' />
  
  
          </div>
          <div class="modal-footer">
                  {selectEvent && (
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      // onClick={deleteEvents}
                    >
                      Eliminar
                    </button>
                  )}
           
           <button type="button" className="btn btn-primary" style={{ backgroundColor: '#39A900', color: '#ffffff' }} onClick={saveEvent}>
            Guardar
          </button>
  
          </div>
        </div>
      </div>
    </div>
   
    )}
  
    </div>
      )
}

export default Calendario;