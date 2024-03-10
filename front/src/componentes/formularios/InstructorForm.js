/* import React, { useState } from 'react';
import './styles/Instructor.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import clienteAxios from '../../api/axios';
import Swal from 'sweetalert2';


const InstructorForm = () => {
  const [formData, setFormData] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value, });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await clienteAxios.post('/instructores-add', formData);

            Swal.fire({
                title: 'Instructor registrado exitosamente',
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
    <div className="form-container-instructor">
      <h1 className='titulo-fichas'>Registro de Instructores</h1>
      <form onSubmit={handleSubmit} className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Número de Documento:</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Tipo de Documento:</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Nombres:</label>
          <input
            type="text"
            className="form-control"
            name='nombres'

            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Apellidos:</label>
          <input
            type="text"
            className="form-control"
            name='apellidos'

            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Correo Electrónico:</label>
          <input
            type="email"
            className="form-control"
            name='correo_electronico'

            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Número de Celular 1:</label>
          <input
            type="tel"
            className="form-control"
            name='numero_celular1'

            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Número de Celular 2:</label>
          <input
            type="tel"
            className="form-control"
            name='numero_celular2'
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Fichas Asignadas:</label>
          <input
            type="text"
            name='fichas_asignadass'
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Rol de Usuario:</label>
          <input
            type="text"
            className="form-control"
            name='rol_usuario'
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            className="form-control"
            name='contrasena'
            placeholder="Ingresa la contraseña"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-12 mb-3">
          <button type="submit" className="btn btn-primary">
            Crear Instructor
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorForm; */



import React, { useState } from 'react';
import './styles/Instructor.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import clienteAxios from '../../api/axios';
import Swal from 'sweetalert2';

const InstructorForm = () => {
  const [numero_documento, setNumeroDocumento] = useState('');
  const [tipo_documento, setTipoDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo_electronico, setCorreoElectronico] = useState('');
  const [numero_celular1, setNumeroCelular1] = useState('');
  const [numero_celular2, setNumeroCelular2] = useState('');
  const [fichasAsignadas, setFichasAsignadas] = useState('');
  const [rol_usuario, setRolUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'numero_documento':
        setNumeroDocumento(value);
        break;
      case 'tipo_documento':
        setTipoDocumento(value);
        break;
      case 'nombres':
        setNombres(value);
        break;
      case 'apellidos':
        setApellidos(value);
        break;
      case 'correo_electronico':
        setCorreoElectronico(value);
        break;
      case 'numero_celular1':
        setNumeroCelular1(value);
        break;
      case 'numero_celular2':
        setNumeroCelular2(value);
        break;
      case 'fichas_asignadas':
        setFichasAsignadas(value);
        break;
      case 'rol_usuario':
        setRolUsuario(value);
        break;
      case 'contrasena':
        setContrasena(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = {
        numero_documento,
        tipo_documento,
        nombres,
        apellidos,
        correo_electronico,
        numero_celular1,
        numero_celular2,
        fichas_asignadas: fichasAsignadas,
        rol_usuario,
        contrasena,
      };

      const response = await clienteAxios.post('/instructores-add', formData);

      Swal.fire({
        title: 'Instructor registrado exitosamente',
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
      console.error('Error al crear el instructor:', error);

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
          text: 'Hubo un error al crear el instructor',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  };

  return (
    <div className="form-container-instructor">
      <h1 className='titulo-fichas'>Registro de Instructores</h1>
      <form onSubmit={handleSubmit} className="row">
        <div className="col-md-6 mb-3">
          <input
            type="text"
            placeholder="Número de documento"
            className="form-control"
            name='numero_documento'
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tipo de documento"
            name='tipo_documento'
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="text"
            placeholder="Nombres"
            className="form-control"
            name='nombres'
            onChange={handleChange}
            required
          />
        </div>



        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Apellidos"
            name='apellidos'
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Correo electrónico"
            name='correo_electronico'
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="tel"
            className="form-control"
            placeholder="Número de celular 1 "
            name='numero_celular1'
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="tel"
            className="form-control"
            placeholder="Número de celular 2"
            name='numero_celular2'
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="text"
            name='fichas_asignadas'
            placeholder="Fichas asignadas"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="text"
            placeholder="Rol de usuario"
            className="form-control"
            name='rol_usuario'
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="password"
            className="form-control"
            name='contrasena'
            placeholder="Ingresa la contraseña"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-12 mb-3">
          <button type="submit" className="btn-instructor">
            Crear Instructor
          </button>
        </div>


      </form>
    </div>
  );
};

export default InstructorForm;
