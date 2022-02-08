import React from "react"

import './style.css'

import { Link } from 'react-router-dom';

import { EstadoContext } from "../Providers/estado";


export default function ItemServico(props) {

    const { setBarbearia, setNomeServico, setTempoServico, tempoServico } = React.useContext(EstadoContext)

    function servicoEscolhido() {
        setBarbearia(props.idServico)
        window.localStorage.setItem('idServico', props.idServico)
        setNomeServico(props.nomeServico)
        window.localStorage.setItem('nomeServico', props.nomeServico)
        setTempoServico(props.tempoServico)
        window.localStorage.setItem('tempoServico', props.tempoServico)

    }

    return (
        <li className="ItemServico-card" onMouseUp={servicoEscolhido}>
            <img src={props.url} className="ItemServico-img" alt={props.nomeServico}></img>
            <div className="ItemServico-info-card">
                <div className="ItemServico-wrap-p">
                    <h1>{props.nomeServico}</h1>
                    <p>{props.precoServico},00 R$</p>
                </div>

                <Link className="ItemServico-link" to="/agendamento/informacoes" ><p>Agendar</p></Link>
            </div>
        </li>
    )
}