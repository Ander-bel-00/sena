import React, { Fragment, useState } from 'react';
import clienteAxios from '../../api/axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './styles/fichas-form-estilos.css';


//se define el componente 
function FichasForm() {
    

    // Estado local para almacenar los datos del formulario
    const [formData, setFormData] = useState({});


    // esto maneja los cambios en los campos del formulario
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value,});
    };

    // maneja el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            // Realizar una solicitud POST al servidor con los datos del formulario
            const response = await clienteAxios.post('/fichas-Admin-new', formData);


            // Mostrar una alerta de éxito usando SweetAlert2
            Swal.fire({
                title: 'Ficha registrada exitosamente',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/';   // redireccion a la página de inicio
                }
            });

            console.log(response.data); // imprime la respuesta del servidor en la consola
        } catch (error) {
            console.error('Error al crear la ficha:', error);


            //alerta de error
            if (error.response && error.response.data && error.response.data.mensaje) {
                // Si hay un mensaje de error en la respuesta del servidor, mostrarlo
                Swal.fire({
                    title: 'Error',
                    text: error.response.data.mensaje,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            } else {
                // Si no hay un mensaje de error específico, mostrar un mensaje genérico
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al crear la ficha',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        }
    };


    //renderiza el componente
    return (
        <Fragment>
            
            
                <form className='formularioFichas' onSubmit={handleSubmit}>
                    <h1 className='titulo-fichas'>Registro de fichas</h1>
                    <input type="text" placeholder='Ingresa el número de ficha' name="numero_ficha"
                        onChange={handleChange} required />
                    <input type='text' placeholder='Programa de formación' name="programa_formacion"
                        onChange={handleChange} required />
                    <input type='text' placeholder='Nivel de formación' name='nivel_formacion'
                        onChange={handleChange} required />
                    <input type='text' placeholder='Titulo obtenido' required
                        name='titulo_obtenido' onChange={handleChange} />
                    <p>Fecha en que termina etapa lectiva: <input type='date' required
                        name='fecha_fin_lectiva' onChange={handleChange} /></p>

                    <button type="submit" className="btn btn-primary">Agregar nueva ficha</button>
                </form>
              
        </Fragment>
    )
}

export default FichasForm;
