import React, { Fragment, useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './css/calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import clienteAxios from '../../api/axios';
import { IoArrowBackSharp } from 'react-icons/io5';
import LogoComponent from './LogoComponent';
import { useParams, Link } from 'react-router-dom';

const localizer = momentLocalizer(moment);

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

function Calendario() {
  moment.locale('es');
  const { numero_ficha, rol_usuario, id_aprendiz } = useParams();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const response = await clienteAxios.get(`/visitas-aprendiz/${id_aprendiz}`);
        setEvents(response.data.visitas || []);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      }
    };

    cargarEventos();
  }, [id_aprendiz]);

  const openModal = (date) => {
    console.log('Fecha seleccionada:', date); // Agregar este console.log
    setShowModal(true);
    setSelectedDate(date);
    setEventTitle('');
    setSelectedTime('');
  };
  
  const closeModal = () => {
    console.log('Cerrando modal...');
    setShowModal(false);
    setSelectedDate(null);
    setEventTitle('');
    setSelectedTime('');
  };
  
  const saveEvent = async () => {
    if (!eventTitle || !selectedDate || !selectedTime) {
      console.error('Por favor, complete todos los campos.');
      return;
    }
  
    // Formatear la hora seleccionada
    console.log('Hora seleccionada:', selectedTime); // Agregar este console.log
    const formattedTime = moment(selectedTime, 'HH:mm').format('h:mm A');
  
    try {
      const response = await clienteAxios.post(`/nuevaVisita/${id_aprendiz}`, {
        tipo_visita: eventTitle,
        fecha: selectedDate,
        hora: selectedTime, // Usar la hora seleccionada sin formatear
      });
  
      console.log('Evento guardado:', response.data); // Agregar este console.log
      setEvents((prevEvents) => [...prevEvents, response.data]);
      closeModal();
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  return (
    <Fragment>
      <button className="relative left-10 top-14">
        <Link to={`/${rol_usuario}/aprendicesFicha/${numero_ficha}`} className="Regresar">
          <IoArrowBackSharp className="inline-block" /> Regresar
        </Link>
      </button>
      {/* <LogoComponent /> */}
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        onSelectSlot={(slotInfo) => openModal(slotInfo.start)}
        events={events.map((event) => {
          console.log('Hora formateada para el evento:', moment(event.start).format('LT'));
          return {
            ...event,
            start: moment(event.fecha).toDate(),
            end: moment(event.fecha).add(1, 'hour').toDate(),
            title: (
              <div>
                <div>{event.tipo_visita}</div>
                <div className='text-wrap'>Fecha: {moment(event.fecha).format('LL')}</div>
                <div>Hora: {moment(event.hora, 'HH:mm').format('h:mm A')}</div>
              </div>
            ),
          };
        })}
        messages={messages}
        className='calendar-container relative bottom-44'
      />

      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0.0.0.0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, outline: '2px solid #ffffff' }}>
          <div className="modal-dialog" style={{ maxWidth: '600px', margin: 'auto', top: '100px' }}>
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#39A900', color: '#ffffff' }}>
                <h5 className="modal-title" style={{ marginLeft: '160px' }}>
                  Agendar Visita
                  {selectedDate && (
                    <p style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '32px' }}>
                      {`${moment(selectedDate).format('LL')} ${moment(selectedTime, 'HH:mm').format('h:mm A')}`}
                    </p>
                  )}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <label style={{ fontWeight: 'bold' }}>Tipo de visita:</label>
                <select
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-80 bg-white text-black px-4 py-2 rounded-md my-4 border ml-6"
                >
                  <option value="">Seleccione el tipo de visita...</option>
                  <option value="Primera visita">Primer visita</option>
                  <option value="Segunda Visita">Segunda visita</option>
                  <option value="Tercera visita">Tercera visita</option>
                </select>
                <label style={{ fontWeight: 'bold' }} className='flex'>Hora:</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={saveEvent} style={{ backgroundColor: '#39A900', color: '#ffffff' }}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Calendario;
