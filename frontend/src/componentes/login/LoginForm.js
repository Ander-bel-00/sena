import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clienteAxios from '../../api/axios';
import Cookies from 'js-cookie';
import logoSena from './img/sena-verde.png';
import './css/login.styles.css';

const LoginForm = ({ isAuthenticated, setIsAuthenticated, setUserRole }) => {
  const [formData, setFormData] = useState({
    rol_usuario: '',
    numero_documento: '',
    contrasena: ''
  });

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const { rol_usuario, numero_documento, contrasena } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    try {
        const res = await clienteAxios.post('/login', formData);
        Cookies.set('token', res.data.token);
        setIsAuthenticated(true);
        setUserRole(formData.rol_usuario);
        navigate(`/${formData.rol_usuario}`); // Redirige al usuario según su rol
    } catch (error) {
        if (Array.isArray(error.response.data)) {
            setErrors(error.response.data);
        } else {
            setErrors([error.response.data.message]);
        }
    }
};

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${formData.rol_usuario}`);
    }
  }, [isAuthenticated, formData.rol_usuario]);


  return (
    <Fragment>
      <header className="flex justify-between">
        <img src={logoSena} alt="logo-sena" id="logo-sena" className="logo-sena w-16 ml-2 my-1" />
        <h2 className="text-4xl seepTitle">S.E.E.P</h2>
      </header>

      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="bg-white max-w-md w-full p-10 rounded-md form-container mb-4">
          <h1 className="text-center text-2xl font-bold my-4">Iniciar sesión</h1>
          <form onSubmit={onSubmit}>
            <p className="selectRol">
              Selecciona tu rol:
              <select
                name="rol_usuario"
                value={rol_usuario}
                onChange={onChange}
                className="w-80 bg-white text-black px-4 py-2 rounded-md my-4 border ml-6"
              >
                <option>Selecciona un rol...</option>
                <option value="instructor">Instructor</option>
                <option value="aprendiz">Aprendiz</option>
                <option value="administrador">Administrador</option>
                
              </select>
            </p>
            <div className="input-container">
              <input
                placeholder="Número de documento"
                type="text"
                name="numero_documento"
                value={numero_documento}
                onChange={onChange}
                className="flex items-center justify-center w-80 bg-white text-black px-4 py-2 rounded-md my-2 border ml-6"
              />
            </div>
            <div className="input-container">
              <input
                placeholder="Contraseña"
                type="password"
                name="contrasena"
                value={contrasena}
                onChange={onChange}
                className="w-80 bg-white text-black px-4 py-2 rounded-md my-2 border ml-6"
              />
            </div>
            {errors.map((error, i) => (
              <div key={i} className="text-red-600 ml-6">
                {error}
              </div>
            ))}
            <button type="submit" className="loginButton rounded-md p-3 ml-32 mt-4">
              Iniciar Sesión
            </button>
          </form>
        </div>
        <footer className="piePagina">© SENA - Todos los derechos reservados</footer>
      </div>
    </Fragment>
  );
};

export default LoginForm;
