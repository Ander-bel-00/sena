import React, { Fragment, useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './css/calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import clienteAxios from '../../api/axios';
import { IoArrowBackSharp } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const response = await clienteAxios.get(`/visitas-aprendiz/${id_aprendiz}`);
      setEvents(response.data.visitas || []);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  };

  const openModalAgregarEvento = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedTime('');
    setEventTitle('');
    setShowModal(true);
  };
  
  const openModalVerEvento = (event) => {
    setSelectedEvent(event);
    setSelectedDate(moment(event.fecha).toDate());
    setSelectedTime(event.hora);
    setEventTitle(event.tipo_visita);
    setShowModal(true);
  };

  const openEditModal = () => {
    setShowEditModal(true); // Mostrar el modal de edición al hacer clic en "Editar Evento"
  };
  

  const closeModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setSelectedDate(null);
    setEventTitle('');
    setSelectedTime('');
    setSelectedEvent(null);
  };

  const saveEvent = async () => {
    if (!eventTitle || !selectedDate || !selectedTime) {
      if (!selectedTime) {
        console.error('Por favor, seleccione una hora.');
      } else {
        console.error('Por favor, complete todos los campos.');
      }
      return;
    }
  
    const formattedTime = moment(selectedTime, 'HH:mm').format('h:mm A');
  
    try {
      const response = await clienteAxios.post(`/nuevaVisita/${id_aprendiz}`, {
        tipo_visita: eventTitle,
        fecha: selectedDate,
        hora: selectedTime,
      });
  
      setEvents((prevEvents) => [...prevEvents, response.data]);
      closeModal();
      // Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Visita agendada correctamente',
        text: 'La visita se ha agendado correctamente.',
      });
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      // Mostrar SweetAlert de error con el mensaje del backend
      Swal.fire({
        icon: 'error',
        title: 'Error al agendar visita',
        text: error.response.data.error || 'Hubo un error al intentar agendar la visita.',
      });
    }
  };
  

  const editarEvento = async () => {
    try {
      if (!selectedEvent || !eventTitle || !selectedDate || !selectedTime) {
        console.error('Por favor, complete todos los campos.');
        return;
      }
  
      const response = await clienteAxios.put(`/visitas-update/${selectedEvent.id_visita}`, {
        tipo_visita: eventTitle,
        fecha: selectedDate,
        hora: selectedTime,
      });
  
      // Recargar los eventos después de la edición
      await cargarEventos();
  
      // Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Visita actualizada',
        text: 'La visita se actualizó correctamente.',
      });
  
      closeModal(); // Cerrar el modal después de la edición
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      // Mostrar SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al intentar actualizar la visita.',
      });
    }
  };
  
  

  const eliminarEvento = async () => {
    try {
      const id_visita = selectedEvent.id_visita;
      const response = await clienteAxios.delete(`/visitas-delete/${id_visita}`);
      console.log('Eliminar evento:', response.data.mensaje);
      // Eliminar el evento del estado local
      setEvents(prevEvents => prevEvents.filter(event => event.id_visita !== id_visita));
      // Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Evento eliminado',
        text: 'El evento se eliminó correctamente.',
      });
      closeModal(); // Cerrar el modal solo si la visita se elimina con éxito
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      // Mostrar SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al intentar eliminar el evento.',
      });
    }
  };
  


  return (
    <Fragment>
      <button className="relative left-10 top-14">
        <Link to={`/${rol_usuario}/aprendicesFicha/${numero_ficha}`} className="Regresar back">
          <IoArrowBackSharp className="inline-block" /> Regresar
        </Link>
      </button>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        onSelectSlot={openModalAgregarEvento}
        onSelectEvent={openModalVerEvento}
        events={events.map((event) => ({
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
        }))}
        messages={messages}
        className='calendar-container relative bottom-44'
      />

      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0.0.0.0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, outline: '2px solid #ffffff' }}>
          <div className="modal-dialog" style={{ maxWidth: '600px', margin: 'auto', top: '100px' }}>
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#39A900', color: '#ffffff' }}>
                <h5 className="modal-title" style={{ marginLeft: '160px' }}>
                  {selectedEvent ? 'Información del Evento' : 'Agendar Visita'}
                  {selectedDate && (
                    <p style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '32px' }}>
                      {`${moment(selectedDate).format('LL')}${selectedTime ? ` ${moment(selectedTime, 'HH:mm').format('h:mm A')}` : ' Selecciona hora'}`}
                    </p>
                  )}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {selectedEvent ? (
                  <Fragment>
                    <div><strong>Tipo de Visita:</strong> {selectedEvent.tipo_visita}</div>
                    <div><strong>Fecha:</strong> {moment(selectedEvent.fecha).format('LL')}</div>
                    <div><strong>Hora:</strong> {moment(selectedEvent.hora, 'HH:mm').format('h:mm A')}</div>
                  </Fragment>
                ) : (
                  <Fragment>
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
                  </Fragment>
                )}
              </div>
              {!selectedEvent && (
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={saveEvent} style={{ backgroundColor: '#39A900', color: '#ffffff' }}>
                    Guardar
                  </button>
                </div>
              )}
              {selectedEvent && (
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={openEditModal} style={{ backgroundColor: '#39A900', color: '#ffffff' }}>
                    Editar Evento
                  </button>
                  <button type="button" className="btn btn-danger" onClick={eliminarEvento}>
                    Eliminar Evento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {showEditModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0.0.0.0.5)', position: 'fixed', top: -30, bottom: 0, left: 8, right: 0, outline: '2px solid #ffffff' }}>
          <div className="modal-dialog" style={{ maxWidth: '600px', margin: 'auto', top: '50px' }}>
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#39A900', color: '#ffffff' }}>
                <h5 className="modal-title" style={{ marginLeft: '160px' }}>
                  Editar Evento
                  {selectedDate && (
                    <p style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '32px' }}>
                      {`${moment(selectedDate).format('LL')}${selectedTime ? ` ${moment(selectedTime, 'HH:mm').format('h:mm A')}` : ' Selecciona hora'}`}
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
                <label style={{ fontWeight: 'bold' }} className='flex'>Fecha:</label>
                <input
                  type="date"
                  value={moment(selectedDate).format('YYYY-MM-DD')}
                  onChange={(e) => setSelectedDate(moment(e.target.value, 'YYYY-MM-DD').toDate())}
                  className="w-80 bg-white text-black px-4 py-2 rounded-md my-4 border ml-6"
                />
                <label style={{ fontWeight: 'bold' }} className='flex'>Hora:</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-80 bg-white text-black px-4 py-2 rounded-md my-4 border ml-6"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={editarEvento} style={{ backgroundColor: '#39A900', color: '#ffffff' }}>
                  Guardar Cambios
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
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
