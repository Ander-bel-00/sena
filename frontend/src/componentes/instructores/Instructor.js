import React, { Fragment, useEffect, useState } from 'react';
import clienteAxios from '../../api/axios';
import logoSena from './sena-verde.png';
import { Link } from 'react-router-dom';

function Instructor() {
  const [usuario, setUsuario] = useState(null);
  const [fichasAsignadas, setFichasAsignadas] = useState([]);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        // Hacer la solicitud GET al endpoint '/usuario' para obtener la información del usuario autenticado
        const response = await clienteAxios.get('/usuario');

        // Establecer el usuario en el estado del componente
        setUsuario(response.data.usuario);

        // Obtener las fichas asignadas al instructor
        const responseFichas = await clienteAxios.get(`/instructor/${response.data.usuario.numero_documento}/fichas-asignadas`);
        // Ordenar Fichas desde la primera creada a la más reciente.
        const fichasOrdenadas = responseFichas.data.fichasAsignadas.sort((a, b) => {
          // Convertir las fechas de creación a objetos Date y compararlas
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        setFichasAsignadas(fichasOrdenadas);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };

    obtenerUsuario();
  }, []); // El array vacío como segundo argumento asegura que useEffect se ejecute solo una vez al montar el componente

  // Función para formatear la fecha en el formato Año-mes-día
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toISOString().split('T')[0];
  };

  return (
    <Fragment>
      <div>
        {usuario && usuario.rol_usuario ? (
          <Fragment>
            <h2 className='fichasAsignedTitle mt-11 text-center'>Agendamiento de Visitas</h2>
            <div className="row my-2 fichas-content rounded-md">
              {fichasAsignadas.length > 0 ? (
                fichasAsignadas.map(ficha => (
                  <div key={ficha.numero_ficha} className="col-md-6 col-lg-3 mb-4 fichasAll">
                    <div className="card fichas">
                      <div className="card-body">
                        <h5 className="card-title">Ficha {ficha.numero_ficha}</h5>
                        <img src={logoSena} className='w-9 logSenaFichas relative'/>
                        <p className="card-text"><strong>Programa de formación: </strong>{ficha.programa_formacion}</p>
                        <p className="card-text"><strong>Nivel de formación: </strong>{ficha.nivel_formacion}</p>
                        <p className="card-text"><strong>Título obtenido: </strong>{ficha.titulo_obtenido}</p>
                        <p className="card-text"><strong>Fecha fin lectiva: </strong>{formatearFecha(ficha.fecha_fin_lectiva)}</p>
                      </div>
                      <button className='btnVerFicha'>
                        <Link to={`/aprendicesFicha/${ficha.numero_ficha}`} className='verFichas'>
                          Ver Ficha</Link>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay fichas asignadas</p>
              )}
            </div>
          </Fragment>
        ) : (
          <p>Cargando usuario...</p>
        )}
      </div>
    </Fragment>
  );
}

export default Instructor;
