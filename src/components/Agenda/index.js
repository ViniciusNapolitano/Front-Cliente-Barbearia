import React from 'react'
import CardAgendamento from '../CardAgendamento'

import './style.css'

export default function Agenda(props) {
    console.log(props.agendamentos)

    const listarCards = () => {
        return props.agendamentos.map(agendamento => {
            return <CardAgendamento
                hora={agendamento.horario}
                servico={agendamento.servicos.nomeServico}
                cliente={agendamento.name}
            />
        })
    }

    return(
        <section className='Agenda-section'>
            <div className='Agenda-esteira-agendamentos'>
                {/* <CardAgendamento/>
                <CardAgendamento/>
                <CardAgendamento/>
                <CardAgendamento/>
                <CardAgendamento/> */}
                {listarCards()}
            </div>
        </section>
    )
}