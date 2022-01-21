import React, { useState } from "react"

import './style.css'

import axios from 'axios';

// import { Link } from 'react-router-dom';

import { EstadoContext } from "../Providers/estado";

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import { format } from 'date-fns'

export default function ListaAgendamentos(props) {

    const { setBarbearia, setNomeServico, setTempoServico, tempoServico } = React.useContext(EstadoContext)

    const [Data, setData] = useState('')
    const [resAgendamentoDia, setResAgendamentoDia] = useState('')
    const [horariosDisponiveis, setHorariosDisponiveis] = useState(false)

    async function filtrarAgendamentoData(agendamentoDia) {
        await axios.get(`https://mybarberapi.herokuapp.com/api/v1/agendamentos/tenant/1?Date=${agendamentoDia}`)
            .then(res => {
                setResAgendamentoDia(res.data)
                setHorariosDisponiveis(true)

                if (res.data == '')
                    setHorariosDisponiveis(false)

                // console.log(res.data)
            })
    }

    const handleChangeData = (event) => {
        let agendamentoDia
        setData(format(event, "yyyy-MM-dd"))
        agendamentoDia = format(event, "yyyy-MM-dd")
        filtrarAgendamentoData(agendamentoDia)
    }

    const listarAgendamentos = () => {
        console.log(resAgendamentoDia)
        return resAgendamentoDia.map(agendamento => {
            return <tr>
                <th>{agendamento.idAgendamento}</th>
                <th>{agendamento.horario.slice(11, 16)}</th>
                <th>{agendamento.name}</th>
                <th>{agendamento.servicos.nomeServico}</th>
                <th>{agendamento.barbeiros.nameBarbeiro}</th>
            </tr>
        })
    }

    return (
        <>
            <section className="listaAgendamentos-section">

                {/* <p>{props.agendamentos.map(agendamento => agendamento.name)}</p> */}

                <h1>Escolha uma data para listar os agendamentos:</h1>
                <div className="listaAgendamentos-div-calendar">
                    <Calendar
                        className="listaAgendamentos-calendar"
                        onChange={handleChangeData}
                    // value={data}
                    />
                </div>
                {Data}

                {
                    horariosDisponiveis ?

                        <table className="listaAgendamentos-tb-agendamentos">
                            <tr className="listaAgendamentos-titulos-col">
                                <th>ID Agendamento</th>
                                <th>Horário</th>
                                <th>Cliente</th>
                                <th>Serviço</th>
                                <th>Barbeiro</th>
                            </tr>
                            {listarAgendamentos()}
                        </table>

                        : ''
                }

            </section>
        </>
    )
}