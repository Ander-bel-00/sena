// LogoComponent.js
import React from 'react';
import logoImg from './img/logo.png';  // Asegúrate de proporcionar la ruta correcta

const LogoComponent = () => {
  return (
    <img src={logoImg} alt="Logo" style={{ maxWidth: '150px', marginLeft: '600px', marginTop :'5px' }} 
    
    className='relative left-20'/>
  );
};

export default LogoComponent;
