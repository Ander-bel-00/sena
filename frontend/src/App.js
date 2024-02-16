// App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useHistory } from "react-router-dom";
import LoginForm from "./componentes/login/LoginForm";
import Aprendiz from "./componentes/aprendices/Aprendiz";
import Administrador from "./componentes/admin/Administrador";
import Instructor from "./componentes/instructores/Instructor";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

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
              <Aprendiz />
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
