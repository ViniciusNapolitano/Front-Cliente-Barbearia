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

            <Link className="Cabecalho-Logo" to="/"><img src={Logo} alt="Logo"></img> Castro Brothers</Link>

            <nav id="Cabecalho-Nav" className={menuMobile ? " Active" : ""}>

                <button
                    className="Cabecalho-Btn-Menu"
                    onClick={handleMenuMobile}>
                    <div id="hamburger"></div>
                </button>

                <ul className="Cabecalho-Ul">
                    <li className="Cabecalho-Li"><Link to="/">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-return-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z" />
                        </svg>
                        <span>Voltar</span>
                    </Link></li>
                </ul>

            </nav>
        </header>
    )
}