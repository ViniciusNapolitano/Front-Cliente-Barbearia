import React from "react"

import './style.css'

import ItemServico from '../../components/ItemServico'

// import { Link } from 'react-router-dom';

export default function PainelServicoCompleto(props) {

    function listarServocos() {
        return props.servicos.map(servico => {
            return <ItemServico
                nomeServico={servico.nomeServico}
                precoServico={servico.precoServico}
                url={servico.servicoImagem.url}
                idServico={servico.idServico}
                tempoServico={servico.tempoServico}
            />

        })
    }

    return (
        <section className="Servico-section">
            <h1 className="Servico-titulo">Escolha um serviço</h1>
            <div className="Servico-painel">
                <ul className="Servico-lista">
                    {listarServocos()}
                </ul>
            </div>
        </section>
    )
}