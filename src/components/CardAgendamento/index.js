import React from "react";

import './style.css'

export default function CardAgendamento(props) {
    return (
        <div className="CardAgendamento">
            <div className="CardAgendamento-wrap">
                <div>
                    <p className="CardAgendamento-info-tipo">Hora</p>
                    <p className="CardAgendamento-info-valor">{props.hora.slice(11, 16).toString()}h</p>
                </div>
                <div id="idInfoCentro">
                    <p className="CardAgendamento-info-tipo">Serviço</p>
                    <p className="CardAgendamento-info-valor">{props.servico}</p>
                </div>
                <div>
                    <p className="CardAgendamento-info-tipo">Cliente</p>
                    <p className="CardAgendamento-info-valor">{props.cliente}</p>
                </div>
            </div>

            {/* <button>Detalhes</button> */}
        </div>
    )
}