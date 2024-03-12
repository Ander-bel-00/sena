import React from 'react';
import { AiFillContacts , AiFillIdcard, AiFillFileAdd  } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import '../formularios/styles/iconos.css'
import '../admin/Admin.css';
import '../footer/Footer';
import Footer from '../footer/Footer';


function Administrador() {

  return (
    <div>
      <h1 className="titulo-panel">Panel de control</h1>

      <Link to="/crear-ficha">
        <div className="icon-box">
          <AiFillFileAdd className="icon" size={120} />
          <span>Crear Ficha</span>
        </div>
      </Link>

      <Link to="/crear-instructor">
        <div className="icon-box">
          <AiFillContacts className="icon" size={120} />
          <span>Crear Instructor</span>
        </div>
      </Link>

      <Link to="/crear-aprendiz">
        <div className="icon-box">
          <AiFillIdcard className="icon" size={120} />
          <span>Crear Aprendiz</span>
        </div>
      </Link>
  <Footer />

    </div>
  );
}




export default Administrador;
