import React from "react";

import { IoHomeSharp } from "react-icons/io5";

import { FaUser } from "react-icons/fa";

import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import { BiSolidLogOut } from "react-icons/bi";
import { IoDocuments } from "react-icons/io5";

const NavbarAprendiz = ({showNav, handleLogout}) => {
    return (
        <div className={showNav ? 'sidenav active' : 'sidenav'}>
            <ul className="list-group">
                <li><a href="#"><IoHomeSharp className="inline-block"/> Inicio</a></li>
                <li><a href="#"><FaUser className="inline-block"/> Perfil</a></li>
                <li><Link to="/documentos"><IoDocuments className="inline-block"/> Documentos</Link></li>
                <li><Link to="/login" onClick={handleLogout}><BiSolidLogOut className="inline-block"/> 
                Cerrar sesión</Link></li>
            </ul>
        </div>
    )
}

export default NavbarAprendiz;

