import React from "react";

import { IoHomeSharp } from "react-icons/io5";

import { FaUser } from "react-icons/fa";

const NavbarAprendiz = ({showNav}) => {
    return (
        <div className={showNav ? 'sidenav active' : 'sidenav'}>
            <ul className="list-group">
                <li><a href="#"><IoHomeSharp /> Inicio</a></li>
                <li><a href="#"><FaUser /> Perfil</a></li>
                <li className="active">
                    <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" 
                        className="dropdown-toggle" id="Documentos"><i className="bi bi-file-earmark-arrow-up-fill"></i> Documentos</a>
                    <ul className="collapse list-unstyled" id="homeSubmenu">
                        <li>
                            <a href="#"><i className="bi bi-cloud-arrow-up"></i> Cargar bitácoras</a>
                        </li>
                        <li>
                            <a href="#"><i className="bi bi-upload"></i> Cargar formulários</a>
                        </li>
                        <li>
                            <a href="#"><i className="bi bi-pen"></i> Registrar o visualizar firma
                                digital
                            </a>
                        </li>
                        <li>
                            <a href="#" id="descargarBitacorasBtn">
                                <i className="bi bi-file-earmark-arrow-down"></i> Descargar formato de bitácoras
                            </a>
                        </li>                        
                        <li>
                            <a href="#"><i className="bi bi-download"></i> Descargar formato de formulario
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default NavbarAprendiz;

