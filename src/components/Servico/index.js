import React from "react"

import './style.css'

import ItemServico from '../../components/ItemServico'

// import { Link } from 'react-router-dom';

export default function Servico(props) {

    function listarServocos() {
        let count = 0
        
        return props.servicos.map(servico => {
            if (count < 6) {
                count++
                return <ItemServico
                    nomeServico={servico.nomeServico}
                    precoServico={servico.precoServico}
                    url={servico.servicoImagem.url}
                    idServico={servico.idServico}
                    tempoServico={servico.tempoServico}
                />
            }
        })
    }

    return (
        <section className="Servico-section" id="Servico-section">
            <h1 className="Servico-titulo">Serviços mais utilizados</h1>
            <div className="Servico-painel">
                <ul className="Servico-lista">
                    {listarServocos()}
                </ul>
            </div>
        </section>
    )
}