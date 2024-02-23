import React, { Fragment, useEffect, useState } from "react";
import handleContentMovement from "./main.js";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Importa BrowserRouter
import LoginForm from "./componentes/login/LoginForm";
import NavbarAprendiz from "./componentes/aprendices/layouts/Navabar-Aprendiz";
import Aprendices from "./componentes/aprendices/Aprendiz";
import Administrador from "./componentes/admin/Administrador";
import Instructor from "./componentes/instructores/Instructor";
import Header from "./componentes/layouts/Header";
import clienteAxios from './api/axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showNav, setShowNav] = useState(false);


  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = Cookies.get('token');
        if (token) {
          clienteAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await clienteAxios.get('/verify-token');
          if (response.status === 200) {
            setIsAuthenticated(true);
            setUserRole(response.data.usuario.rol_usuario);
          }
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
      }
    };
    checkToken();
  }, []); 

  useEffect(() => {
    handleContentMovement(showNav);
  }, [showNav]);

  const handleLogout = async () => {
    try {
      await clienteAxios.post('/logout');
      setIsAuthenticated(false);
      setUserRole(null);
      Cookies.remove('token');
      setShowNav(false); // Restablecer el estado del menú
      // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
      <Navigate to="/login" />
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userRole}`} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={<LoginForm isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />}
        />
        <Route
          path="/aprendiz"
          element={
            isAuthenticated && userRole === 'aprendiz' ? (
              <Fragment>
                <Header showNav={showNav} setShowNav={setShowNav}/>
                <NavbarAprendiz showNav={showNav} handleLogout={handleLogout} />
                <main className="container content">
                  <Aprendices />
                </main>
              </Fragment>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/instructores"
          element={
            isAuthenticated && userRole === 'instructor' ? (
              <Instructor />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/administradores"
          element={
            isAuthenticated && userRole === 'administrador' ? (
              <Administrador />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
