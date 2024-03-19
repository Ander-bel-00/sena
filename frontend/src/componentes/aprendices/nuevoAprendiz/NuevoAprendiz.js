import React, { Fragment, useState } from 'react';
import clienteAxios from '../../../api/axios';
import { useParams } from 'react-router-dom';
import './css/NuevoAprendiz.css';
import Swal from 'sweetalert2';

function NuevoAprendiz() {
    const { id_instructor } = useParams();
    const [formData, setFormData] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value, id_instructor });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Verificar si telefonofijo_Contacto está vacío y establecerlo como null si es así
            if (!formData.telefonofijo_Contacto) {
                formData.telefonofijo_Contacto = null;
            }

            if (!formData.numero_celular2) {
                formData.numero_celular2 = null;
            }
            const response = await clienteAxios.post('/aprendices-add', formData);

            Swal.fire({
                title: 'Aprendiz registrado exitosamente',
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
            console.error('Error al crear el aprendiz:', error);

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
                    text: 'Hubo un error al crear el aprendiz',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        }
    };

    return (
        <Fragment>
            <h1 className='text-center'>Agregar nuevo Aprendiz</h1>
            <main className='contenedor-formulario'>
                <form className='formulario-aprendiz' onSubmit={handleSubmit}>
                    <input type='text' placeholder='Tipo de documento' name="tipo_documento"
                            onChange={handleChange} required />
                    <input type="number" placeholder='Número de documento' name="numero_documento"
                        onChange={handleChange} required />
                    <p>Fecha de expedición del documento:
                        <input type='date' placeholder='Fecha de expedición' name='fecha_expedicion'
                            onChange={handleChange} required />
                    </p>
                    <input type='text' placeholder='Lugar de expedición' required
                        name='lugar_expedicion' onChange={handleChange} />
                    <p>Fecha de nacimiento: 
                        <input type='date' placeholder='Fecha de nacimiento' required
                            name='fecha_nacimiento' onChange={handleChange} />
                    </p>
                    <input type='text' placeholder='Nombres' required
                        name='nombres' onChange={handleChange} />
                    <input type='text' placeholder='Apellidos' required
                        name='apellidos' onChange={handleChange} />
                    <input type='text' placeholder='Sexo' required
                        name='sexo' onChange={handleChange} />
                    <input type='text' placeholder='Dirección domicilio' required
                        name='direccion_domicilio' onChange={handleChange} />
                    <input type='text' placeholder='Municipio domicilio' required
                        name='municipio_domicilio' onChange={handleChange} />
                    <input type='text' placeholder='Departamento domicilio' required
                        name='departamento_domicilio' onChange={handleChange} />
                    <input type='text' placeholder='Teléfono fijo de contacto'
                    name='telefonofijo_Contacto' onChange={handleChange} />
                    <input type='number' placeholder='Número de celular 1' required
                        name='numero_celular1' onChange={handleChange} />
                    <input type='number' placeholder='Número de celular 2'
                        name='numero_celular2' onChange={handleChange} />
                    <input type='email' placeholder='Correo electrónico 1' required
                        name='correo_electronico1' onChange={handleChange} />
                    <input type='email' placeholder='Correo electrónico 2'
                        name='correo_electronico2' onChange={handleChange} />
                    <input type='number' placeholder='Número de ficha' required
                        name='numero_ficha' onChange={handleChange} />
                    <input type='textr' placeholder='Rol de usuario(aprendiz)' required
                    name='rol_usuario' onChange={handleChange} />
                    <input type='password' placeholder='Contraseña' required
                    name='contrasena' onChange={handleChange} />
                    <button type="submit" className="btn btn-primary">Agregar nuevo aprendiz</button>
                </form>
            </main>
        </Fragment>
    )
}

export default NuevoAprendiz;
