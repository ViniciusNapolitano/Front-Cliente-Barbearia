import React from "react"

import './style.css'

// import { Link } from 'react-router-dom';

export default function Mapa() {

    return (
        <section className="Mapa-Section" id="Mapa-Section">
            <h1>Estamos aqui!</h1>
            <div className="Mapa-div">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.287462535557!2d-46.34882618445375!3d-23.55811706735894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce7aa168a060c3%3A0x22d67ebb42a204d7!2sR.%20Valdomiro%20Marquesini%2C%20114%20-%20Jardim%20Nova%20Poa%2C%20Po%C3%A1%20-%20SP%2C%2008568-380!5e0!3m2!1spt-BR!2sbr!4v1641169997432!5m2!1spt-BR!2sbr" loading="lazy" ></iframe>
            </div>
        </section>
    )
}