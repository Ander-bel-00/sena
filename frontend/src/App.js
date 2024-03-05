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
import ListaAprendices from "./componentes/instructores/listaAprendices/ListaAprendices.js";
import Calendario from "./componentes/calendario/Calendario.js";
import NavbarAdmin from "./componentes/admin/layouts/NavbarAdmin.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showNav, setShowNav] = useState(false);

  const [events, setEvents] = useState([]); // Estado que almacena la lista de eventos
  const [showModal, setShowModal] = useState(false);  // Controla la visibilidad dek modal
  const [selectedDate, setSelectedDate] = useState(null); // almacena fechas seleccionadas
  const [eventTitle, setEventTitle] = useState('');   //almacena el titulo 
  const [selectEvent, setSelectEvent] = useState(null);  //evento seleccionado
  const [selectedTime, setSelectedTime] = useState(null);  //maneja las horas seleccionadas



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
                    
                    // Obtener la URL almacenada
                    const lastPath = localStorage.getItem('lastPath');
                    if (lastPath) {
                        // Redirigir al usuario a la última URL visitada
                        <Navigate to={lastPath} />
                        // Limpiar la URL almacenada después de redirigir
                        localStorage.removeItem('lastPath');
                    }
                }
            }
        } catch (error) {
            console.error('Error al verificar el token:', error);
        }
    };
    checkToken();
}, []);


  // useEffect(() => {
  //   handleContentMovement(showNav);
  // }, [showNav]);

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
          path="/instructor"
          element={
            isAuthenticated && userRole === 'instructor' ? (
              <Fragment>
                <Header showNav={showNav} setShowNav={setShowNav}/>
                <NavbarAprendiz showNav={showNav} handleLogout={handleLogout} />
                <main className="container content">
                <Instructor />
                </main>
              </Fragment>
              
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route 
          path="/:rol_usuario/aprendicesFicha/:numero_ficha"
          element={
            isAuthenticated && userRole === 'instructor' ? (
              <ListaAprendices isAuthenticated={isAuthenticated}/>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route 
          path="/:rol_usuario/visitas-add/:numero_ficha/:id_aprendiz"
          element={
            isAuthenticated && userRole === 'instructor' ? (
              <Calendario 
              events={events}
              setEvents={setEvents}
              showModal={showModal}
              setShowModal={setShowModal}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              eventTitle={eventTitle}
              setEventTitle={setEventTitle}
              selectEvent={selectEvent}
              setSelectEvent={setSelectEvent}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <Fragment>
                <Header showNav={showNav} setShowNav={setShowNav}/>
                <NavbarAdmin showNav={showNav} handleLogout={handleLogout} />
                <main className="container content">
                  <Administrador />
                </main>
              </Fragment>
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
