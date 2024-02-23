import React, { Fragment, useEffect, useState } from 'react';
import clienteAxios from '../../api/axios';

function Aprendiz() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        // Hacer la solicitud GET al endpoint '/usuario' para obtener la información del usuario autenticado
        const response = await clienteAxios.get('/usuario');

        // Establecer el usuario en el estado del componente
        setUsuario(response.data.usuario);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };

    obtenerUsuario();
  }, []); // El array vacío como segundo argumento asegura que useEffect se ejecute solo una vez al montar el componente

  return (
    <Fragment>
      <div>
        {usuario && usuario.id && usuario.rol_usuario ? (
          <Fragment>
            <div className="row">
                <div className="col-md-6 col-lg-12">
                    <div className="card carta">
                        <i className="bi bi-person-circle"></i>
                        <div className="card-body cuerpo-carta">
                            <h5 className="card-title text-center"><strong>{usuario.rol_usuario}</strong></h5>
                            <p className="card-text texo-carta"><strong>Nombres: </strong> {usuario.nombres}</p>
                            <p className="card-text texo-carta"><strong>Apellidos: </strong> {usuario.apellidos}</p>
                            <p className="card-text texo-carta"><strong>Programa de formación: </strong>
                            {usuario.programa_formacion}</p>
                            <p className="card-text texo-carta"><strong>Número de Ficha: </strong>
                            {usuario.numero_ficha}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card carta2 my-2" style={{width: "20rem"}}>
              <div class="card-header">
                Bitácoras
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><p class="bitacoras"><strong>Bitácora N° 6</strong> 
                  Subida el<br /> 22/03/2024</p></li>
                <li class="list-group-item"><p class="bitacoras"><strong>Bitácora N° 7</strong> 
                  Subida el<br /> 22/03/2024</p></li>
                <li class="list-group-item"><p class="bitacoras"><strong>Bitácora N° 8</strong> 
                  Subida el<br /> 22/03/2024</p>
                  </li>
                  <li class="list-group-item h-8"><p className="bitacoras ">
                      <a href="./public/verBitacoras/index.html" className="btedit relative bottom-6"><button class="editar">Ver bitácoras cargadas</button></a></p>
                  </li>
              </ul>
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
