// ProtectedRoute.js

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, element, ...rest }) {
  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/" replace />} // Redirigir al login si el usuario no está autenticado
    />
  );
}

export default ProtectedRoute;
