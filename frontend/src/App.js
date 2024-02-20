import React, { Fragment, useEffect, useState } from "react";
import handleContentMovement from "./main.js";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./componentes/login/LoginForm";
import NavbarAprendiz from "./componentes/aprendices/layouts/Navabar-Aprendiz";
import Aprendices from "./componentes/aprendices/Aprendiz";
import Administrador from "./componentes/admin/Administrador";
import Instructor from "./componentes/instructores/Instructor";
import Header from "./componentes/layouts/Header";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    handleContentMovement(showNav);
  }, [showNav]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LoginForm isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />}
        />
        <Route
          path="/aprendices"
          element={
            isAuthenticated && userRole === 'aprendiz' ? (
              <Fragment>
                <Header showNav={showNav} setShowNav={setShowNav}/>
                <NavbarAprendiz showNav={showNav}/>
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
