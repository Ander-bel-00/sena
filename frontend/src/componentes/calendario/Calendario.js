import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import LogoComponent from "./LogoComponent";
import BasicTimeClock from './BasicTimeClock';
import { IoArrowBackSharp } from "react-icons/io5";
import moment from 'moment';
import 'moment/locale/es';
import { Link, useParams } from 'react-router-dom';

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
  const handleSelectSlot = (slotinfo) => {
        setShowModal(true);   //muestra el modal
        setSelectedDate(slotinfo.start);   // Establece la fecha seleccionada como el inicio del slot
        setSelectEvent(null);
        setSelectedTime(slotinfo.start.getHours() + ':' + slotinfo.start.getMinutes());   //busca la hora
    };

    const { numero_ficha, rol_usuario } = useParams();
    
    
    
    
    // Maneja la seleccion de un evento existente.
    
      const handleSelectedEvent = (event) => {
        setShowModal(true);  //Muestra el modal
        setSelectEvent(event);
        setEventTitle(event.title);   // Establece el título del evento en el estado
      };
    
    
    
      const saveEvent = () => {
        if (eventTitle && selectedDate) {  //se valida si hay un titulo y fecha seleccionada
          if (selectEvent) {  //si hay un evento seleccionado
            const updatedEvent = { ...selectEvent, title: eventTitle };  //// Actualiza el título del evento seleccionado
    
            const updatedEvents = events.map((event) =>
              event === selectEvent ? updatedEvent : event
            );  // Actualiza la lista de eventos con el evento modificado
            setEvents(updatedEvents);
    
    
          } else {   // Si no hay un evento seleccionado (creación)
            const newEvent = {
              title: eventTitle,
              start: selectedDate,
              end: moment(selectedDate)
                .add(1, "hours")
                .toDate(),
            };  // Crea un nuevo evento con título, fecha de inicio y fecha de finalización
            setEvents([...events, newEvent]); // Agrega el nuevo evento a la lista de eventos
          }
          setShowModal(false);
          setEventTitle("");  // Reinicia el título del evento
          setSelectEvent(null);
        }
      };
    
    
      const deleteEvents = () => {
        if (selectEvent) {
          const updatedEvents = events.filter((event, index) => index !== events.indexOf(selectEvent));
          setEvents(updatedEvents);
          setShowModal(false);
          setEventTitle('');
          setSelectEvent(null);
        }
      };
      
      
    
    
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
            events={events.map(event => ({
              ...event,
              title: `${event.title} - ${moment(event.start).format('LT')}`
            }))}
            startAccessor="start"
            endAccessor="end"
            style={{ margin: '50px' }}
            selectable={true}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectedEvent}
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
  
          <div class="modal-body" >
            <label style={{ fontWeight: 'bold' }}>Nombre del evento:</label>
            <input
            type="text" 
            className="form-control"
            id="eventTitle"
            value={eventTitle}
            onChange={(e) =>setEventTitle(e.target.value)}
  
            />
  
  
            {/* Input de la hora */}
  
          <label style={{ fontWeight: 'bold' }}>Hora:</label>
          
            <BasicTimeClock />
  
  
          </div>
          <div class="modal-footer">
                  {selectEvent && (
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={deleteEvents}
                    >
                      Eliminar
                    </button>
                  )}
           
            <button type="button" onClick={saveEvent} className="btn btn-primary" style={{ backgroundColor: '#39A900', 
                color: '#ffffff' }} >Guardar</button>
  
          </div>
        </div>
      </div>
    </div>
   
    )}
  
    </div>
      )
}

export default Calendario;