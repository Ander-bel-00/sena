import React from "react";
import { HiMenuAlt1 } from "react-icons/hi";

const Header = ({showNav, setShowNav}) => {
    // Cambiar el valor de la variable de estado showNav para mostrar o ocultar el menú.
    const toogleNav = () =>{
        setShowNav(!showNav);
    }
    return(
        <header className="Header-general">
            <div onClick={toogleNav}>
                <HiMenuAlt1 className='menu-burguer'/>
            </div>
            <h1 className="text-center tSeep">S.E.E.P</h1>
        </header>
    )
}

export default Header;