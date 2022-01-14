import React, { useState } from "react"

import './style.css'
// import './menuMobile'

import { Link } from 'react-router-dom';

import Logo from '../../assets/images/Logo-barber-fff.png'

export default function Cabecalho() {

    const [menuMobile, setMenuMobile] = useState(false)

    const handleMenuMobile = () => {
        setMenuMobile(!menuMobile)
    }

    return (
        <header className="Cabecalho">

            {/* <a href="#" className="Cabecalho-Logo">Logo</a> */}
            {/* <Link className="Cabecalho-Logo" to="/">Logo</Link> */}
            <Link className="Cabecalho-Logo" to="/"><img src={Logo} alt="Logo"></img> Castro Brothers</Link>

            <nav id="Cabecalho-Nav" className={ menuMobile ? " Active" : ""}>

                <button
                    className="Cabecalho-Btn-Menu"
                    onClick={handleMenuMobile}>
                    <div id="hamburger"></div>
                </button>

                <ul className="Cabecalho-Ul">
                    <li className="Cabecalho-Li"><a href="#Inicio">Início</a></li>
                    <li className="Cabecalho-Li"><a href="#Servico-section">Serviços</a></li>
                    <li className="Cabecalho-Li"><a href="#Fotos-section">Sobre</a></li>
                    <li className="Cabecalho-Li"><a href="#Mapa-Section">Mapa</a></li>
                    <li className="Cabecalho-Li"><Link to="/agendamento">Agendar</Link></li>
                </ul>

            </nav>
        </header>
    )
}