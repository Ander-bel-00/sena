import React, { Fragment, useEffect, useState } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import { BiSolidLogOut } from "react-icons/bi";
import { IoDocuments } from "react-icons/io5";
import clienteAxios from "../../../api/axios";

const NavbarAprendiz = ({ showNav, handleLogout, setShowNav }) => {
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
                        <li className="menu-options"><a href="#"><IoHomeSharp className="inline-block"/> Inicio</a></li>
                        <li className="menu-options"><a href="#"><FaUser className="inline-block"/> Perfil</a></li>
                        <li className="menu-options"><Link to={`/${usuario.rol_usuario}/${usuario.id_aprendiz}/documents-aprendiz`}><IoDocuments className="inline-block"/> Documentos</Link></li>
                        <li className="menu-options"><Link to="/login" onClick={handleLogout}><BiSolidLogOut className="inline-block"/> Cerrar sesión</Link></li>
                    </ul>
                </div>
            ): (
                <p>Cargando usuario...</p>
            )}
        </Fragment>
    )
}

export default NavbarAprendiz;
