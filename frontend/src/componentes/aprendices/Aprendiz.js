import React, { Fragment, useEffect, useState } from 'react';
import clienteAxios from '../../api/axios';
import moment from 'moment';
import 'moment/locale/es';
import './css/aprendiz.styles.css';

function Aprendiz() {
  const [usuario, setUsuario] = useState(null);
  const [visitas, setVisitas] = useState([]);
  
  // Definir variables de fechas y horas por tipo
  const fechasPorTipo = {};
  const horasPorTipo = {};

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await clienteAxios.get('/usuario');
        setUsuario(response.data.usuario);

        const resVisitas = await clienteAxios.get(`/visitas-aprendiz/${response.data.usuario.id_aprendiz}`);
        if (Array.isArray(resVisitas.data.visitas)) {
          setVisitas(resVisitas.data.visitas);
          console.log(visitas)
        } else {
          console.error('La respuesta de la API no es un array:', resVisitas.data.visitas);
        }
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };

    obtenerUsuario();
  }, []);

  const visitasPorTipo = {
    'primera visita': false,
    'segunda visita': false,
    'tercera visita': false
  };
  
  // Iterar sobre las visitas para marcar los tipos disponibles
  visitas.forEach(visita => {
    const tipoVisitaNormalizado = visita.tipo_visita.toLowerCase(); // Convertir a minúsculas
    visitasPorTipo[tipoVisitaNormalizado] = true;
    fechasPorTipo[tipoVisitaNormalizado] = visita.fecha;
    horasPorTipo[tipoVisitaNormalizado] = visita.hora;
  });

  return (
    <Fragment>
      <div className="container">
        {usuario && usuario.id_aprendiz && usuario.rol_usuario ? (
          <Fragment>
            <div className="row">
              <div className="col-md-6 col-lg-6">
                <div className="card carta info-aprendiz">
                  <i className="bi bi-person-circle"></i>
                  <div className="card-body cuerpo-carta">
                    <h5 className="card-title text-center"><strong>{usuario.rol_usuario}</strong></h5>
                    <p className="card-text texo-carta"><strong>Nombres: </strong> {usuario.nombres}</p>
                    <p className="card-text texo-carta"><strong>Apellidos: </strong> {usuario.apellidos}</p>
                    <p className="card-text texo-carta"><strong>Programa de formación: </strong> {usuario.programa_formacion}</p>
                    <p className="card-text texo-carta"><strong>Número de Ficha: </strong> {usuario.numero_ficha}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 my-4">
                <h2>Tus visitas programadas</h2>
                <table className="tabla">
                  <thead>
                    <tr>
                      <th>Tipo de Visita</th> 
                      <th>Fecha de Visita</th>
                      <th>Hora de Visita</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{visitasPorTipo['primera visita'] ? 'Primera visita' : 'Primera visita'}</td>
                      <td>{fechasPorTipo['primera visita'] ? moment(fechasPorTipo['primera visita']).format('LL') : 'No agendada'}</td>
                      <td>{horasPorTipo['primera visita'] ? moment(horasPorTipo['primera visita'], 'HH:mm').format('h:mm A') : 'No agendada'}</td>
                    </tr>
                    <tr>
                      <td>{visitasPorTipo['segunda visita'] ? 'Segunda visita' : 'Segunda visita'}</td>
                      <td>{fechasPorTipo['segunda visita'] ? moment(fechasPorTipo['segunda visita']).format('LL') : 'No agendada'}</td>
                      <td>{horasPorTipo['segunda visita'] ? moment(horasPorTipo['segunda visita'], 'HH:mm').format('h:mm A') : 'No agendada'}</td>
                    </tr>
                    <tr>
                      <td>{visitasPorTipo['tercera visita'] ? 'Tercera visita' : 'Tercera visita'}</td>
                      <td>{fechasPorTipo['tercera visita'] ? moment(fechasPorTipo['tercera visita']).format('LL') : 'No agendada'}</td>
                      <td>{horasPorTipo['tercera visita'] ? moment(horasPorTipo['tercera visita'], 'HH:mm').format('h:mm A') : 'No agendada'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Fragment>
        ) : (
          <p>Cargando usuario...</p>
        )}
      </div>
    </Fragment>
  );
}

export default Aprendiz;
