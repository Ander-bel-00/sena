import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import "./login.styles.css";
import logoSena from "./sena-verde.png";
import clienteAxios from '../../api/axios';
import Cookies from 'js-cookie';
import { Navigate,useNavigate } from "react-router-dom";

const LoginForm = ({ isAuthenticated, setIsAuthenticated, setUserRole }) => {
    const [formData, setFormData] = useState({
        rol_usuario: '',
        numero_documento: '',
        contrasena: ''
    });

    const [errors, setErrors] = useState([]);

    const { rol_usuario, numero_documento, contrasena } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const navigate = useNavigate(); // Utilizar useNavigate para la navegación

    const onSubmit = async e => {
        e.preventDefault();

        try {
            const res = await clienteAxios.post('/login', formData);
            Cookies.set('token', res.data.token, { expires: 1 / 24 });
            setIsAuthenticated(true);
            setUserRole(formData.rol_usuario);
            switch (formData.rol_usuario) {
                case 'aprendiz':
                    navigate('/aprendices', { replace: true }); // Utilizar navigate en lugar de history.replace
                    break;
                case 'instructor':
                    navigate('/instructores', { replace: true }); // Utilizar navigate en lugar de history.replace
                    break;
                case 'administrador':
                    navigate('/administradores', { replace: true }); // Utilizar navigate en lugar de history.replace
                    break;
                default:
                    break;
            }
            console.log(res.data.message)
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            console.error(error.response.data.message);
            setErrors([error.response.data.message]);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            switch (rol_usuario) {
                case 'aprendiz':
                    navigate('/aprendices', { replace: true }); // Utilizar navigate en lugar de history.replace
                    break;
                case 'instructor':
                    navigate('/instructores', { replace: true }); // Utilizar navigate en lugar de history.replace
                    break;
                case 'administrador':
                    navigate('/administradores', { replace: true }); // Utilizar navigate en lugar de history.replace
                    break;
                default:
                    break;
            }
        }
    }, [isAuthenticated, navigate, rol_usuario]);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <Fragment>
            <header className='flex justify-between'>
                <img src={logoSena} alt="logo-sena" id="logo-sena" className='logo-sena w-16 ml-2 my-1'/>
                <h2 className='text-4xl seepTitle'>S.E.E.P</h2>
            </header>

            <div className="flex h-[calc(100vh-100px)] items-center justify-center">
                <div className='bg-white max-w-md w-full p-10 rounded-md form-container mb-4'>
                    <h1 className='text-center text-2xl font-bold my-4'>Iniciar sesión</h1>
                    <form onSubmit={onSubmit}>
                        <p className='selectRol'>Selecciona tu rol: 
                            <select name="rol_usuario" value={rol_usuario} onChange={onChange}
                            className='w-80 bg-white text-black px-4 py-2 rounded-md my-4 border ml-6'>
                                <option value="administrador">Administrador</option>
                                <option value="aprendiz">Aprendiz</option>
                                <option value="instructor">Instructor</option>
                            </select>
                        </p>
                        <div className="input-container">
                            <input placeholder="Número de documento" type="text" 
                            name="numero_documento" value={numero_documento} onChange={onChange} 
                            className='flex items-center justify-center w-80 bg-white text-black px-4 py-2 rounded-md my-2 border ml-6'/>
                        </div>
                        <div className="input-container">
                            <input placeholder="Contraseña" type="password" name="contrasena" 
                            value={contrasena} onChange={onChange} 
                            className='w-80 bg-white text-black px-4 py-2 rounded-md my-2 border ml-6'/>
                        </div>
                        {errors.map((error, i) => (
                            <div key={i} className='text-red-600 ml-6'>
                                {error}
                            </div>
                        ))}
                        <button type="submit" className='loginButton rounded-md p-3 ml-32 mt-4'>Iniciar Sesión</button>
                    </form>      
                </div>
                <footer className='piePagina'>
                    © SENA - Todos los derechos reservados
                </footer>
            </div>
        </Fragment>
    );
};

export default LoginForm;
