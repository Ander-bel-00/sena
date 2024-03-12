import React, { Fragment, useEffect, useState } from "react";

import { IoHomeSharp } from "react-icons/io5";

import { FaUser } from "react-icons/fa";

import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import { BiSolidLogOut } from "react-icons/bi";
import { IoDocuments } from "react-icons/io5";
import { HiUserAdd } from "react-icons/hi";
import { TiUserAdd } from "react-icons/ti";
import { FaFileExcel } from "react-icons/fa";
import clienteAxios from "../../../api/axios";

const NavbarInstructor = ({showNav, handleLogout, setShowNav}) => {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const obtenerUsuario = async () => {
        try {
            // Hacer la solicitud GET al endpoint '/usuario' para obtener la información del usuario autenticado
            const response = await clienteAxios.get('/usuario');

            // Establecer el usuario en el estado del componente
            setUsuario(response.data.usuario);
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
        }
        };

        obtenerUsuario();
    }, []); // El array vacío como segundo argumento asegura que useEffect se ejecute solo una vez al montar el componente
    
    const handleCloseMenu = () => {
        setShowNav(false); // Cierra el menú
    };
    
    return (
        <Fragment>
            {usuario && usuario.rol_usuario ? (
                <div className={showNav ? 'sidenav active' : 'sidenav'}>
                    <button className="close-btn" onClick={handleCloseMenu}>X</button>
                    <h3 className="text-xl userWelcome">¡Bienvenido {usuario.nombres}!</h3>
                    <ul className="list-group menu-content">
                        <li className="menu-options"><a href="/"><IoHomeSharp className="inline-block"/> Inicio</a></li>
                        {/* <li className="menu-options"><a href="#"><FaUser className="inline-block"/> Perfil</a></li> */}
                        <li className="menu-options text-nowrap"><Link to={`/${usuario.rol_usuario}/${usuario.id_instructor}/documents-instructor`}><IoDocuments className="inline-block"/> Documentos</Link></li>
                        <li className="menu-options text-nowrap"><Link to={`/${usuario.rol_usuario}/${usuario.id_instructor}/bitacoras-instructor`}><FaFileExcel className="inline-block"/> Bitacoras</Link></li>
                        <li className="menu-options"><Link to={`/${usuario.rol_usuario}/${usuario.id_instructor}/nuevaFicha`}><HiUserAdd className="inline-block"/> Registrar Fichas</Link></li>
                        <li className="menu-options"><Link to={`/${usuario.rol_usuario}/${usuario.id_instructor}/aprendiz-add`}><TiUserAdd className="inline-block"/> Registrar Aprendices</Link></li>
                        <li className="menu-options text-nowrap"><Link to="/login" onClick={handleLogout}><BiSolidLogOut className="inline-block mr-1"/>
                        Cerrar sesión</Link></li>
                    </ul>
                </div>
            ): (
                <p>Cargando usuario...</p>
            )}
        </Fragment>
    )
}

export default NavbarInstructor;

