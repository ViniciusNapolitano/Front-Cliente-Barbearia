import React from 'react'
import CardAgendamento from '../CardAgendamento'

import './style.css'

export default function Agenda(props) {

    const listarCards = () => {
        return props.agendamentos.map(agendamento => {
            return <CardAgendamento
                agendamento={agendamento}
                hora={agendamento.horario}
                servico={agendamento.servicos.nomeServico}
                cliente={agendamento.name}
            />
        })
    }

    return(
        <section className='Agenda-section'>
            <div className='Agenda-esteira-agendamentos'>
                {listarCards()}
            </div>
        </section>
    )
}