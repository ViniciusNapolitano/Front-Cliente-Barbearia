import React from "react";
import { Link } from "react-router-dom";

import './style.css'

export default function Apresentacao(props) {
    return (
        <section className="Inicio" id="Inicio">
            <div className="Inicio-Pelicula">
                <div className="Apresentacao-container-titulos">
                    <h1>Barbearia<br/>Castro Brothers</h1>
                    {/* <h1>{props.titulo}</h1> */}
                </div>
                <div className="Apresentacao-container-agendamento">
                    <Link to="/agendamento" className="Apresentacao-btn-agendamento"><p>Agendar</p></Link>
                </div>
            </div>
        </section>
    )
}