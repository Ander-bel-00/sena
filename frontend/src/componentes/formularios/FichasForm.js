import React, { Fragment, useState } from 'react';
import clienteAxios from '../../api/axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './styles/Fichas.css';



function FichasForm() {
    
    const [formData, setFormData] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value,});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await clienteAxios.post('/fichas-Admin-new', formData);

            Swal.fire({
                title: 'Ficha registrada exitosamente',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/';
                }
            });

            console.log(response.data);
        } catch (error) {
            console.error('Error al crear la ficha:', error);

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