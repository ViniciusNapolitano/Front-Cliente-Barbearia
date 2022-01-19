import React, { useState, useEffect } from "react"

import axios from 'axios';

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import './style.css'

import { format } from 'date-fns'
import { EstadoContext } from "../Providers/estado";


export default function FormAgendamento(props) {

    const { barbearia, nomeServico, tempoServico } = React.useContext(EstadoContext)
    const [idBarbeiro, setIdBarbeiro] = useState('')
    const [data, setData] = useState(new Date())
    const [resAgendamentoDia, setResAgendamentoDia] = useState('')
    const [nomeCliente, setNomeCliente] = useState('')
    const [emailCliente, setEmailCliente] = useState('')
    const [telefoneCliente, setTelefoneCliente] = useState('')
    const [fotoBarbeiro, setFotoBarbeiro] = useState(false)
    const [horariosDisponiveis, setHorariosDisponiveis] = useState(false)

    let agendamentoDia
    let horaAgendamento
    let listaHoraAgendamento = []
    let tempoAgendamento
    let ListaTempoAgendamento = []
    let listaHoraBloqueada = []
    let horaMinFunc = 10
    let horaMaxFunc = 18
    let tamDuracaoServico = 0
    let horaServico = parseFloat(tempoServico.slice(11, 16).toString().replace(':', '.'))
    let numServicosPossiveisDia
    let listaHoraDisponivel = []


    useEffect(() => {
        props.servicos.map(servico => servico.servicosBarbeiros.map(barbeiro => {
            if (barbeiro.barbeiros.idBarbeiro == idBarbeiro)
                setFotoBarbeiro(barbeiro.barbeiros.barbeiroImagem.url)
            else if (0 == idBarbeiro)
                setFotoBarbeiro(false)
        }))
    }, [idBarbeiro])

    async function filtrarAgendamentoData(agendamentoDia) {
        await axios.get(`https://mybarberapi.herokuapp.com/api/v1/agendamentos/tenant/1?Date=${agendamentoDia}`)
            .then(res => {
                setResAgendamentoDia(res.data)
                setHorariosDisponiveis(true)

                console.log(res.data)
            })
    }

    const listarBarbeiros = () => {
        return props.servicos.map(servico => {
            if (servico.idServico == barbearia) {
                return servico.servicosBarbeiros.map(barbeiro => {
                    return <option key={barbeiro.barbeiros.idBarbeiro} value={barbeiro.barbeiros.idBarbeiro}>{barbeiro.barbeiros.nameBarbeiro}</option>
                })
            }
        })
    }

    const calcHoraServico = (hora) => {
        let duracaoServico
        resAgendamentoDia.map(agendamento => {
            if (parseFloat(agendamento.horario.slice(11, 16).toString().replace(':', '.')) == hora) {
                duracaoServico = parseFloat(agendamento.servicos.tempoServico.slice(11, 16).toString().replace(':', '.'))
            }
        })
        return duracaoServico
    }

    const calcDuracaoServico = (horaServico) => {
        if (horaServico == .3) {
            horaServico = .5
            tamDuracaoServico = 1
        } else if (horaServico == 1) {
            tamDuracaoServico = 2
        } else if (horaServico == 1.3) {
            horaServico = 1.5
            tamDuracaoServico = 3
        } else if (horaServico == 2) {
            tamDuracaoServico = 4
        }
    }

    const listarHorariosDisponiveis = () => {
        var count = horaMinFunc
        let countIndexMap = 0
        // horaServico = 1

        calcDuracaoServico(horaServico)

        numServicosPossiveisDia = Math.round(((horaMaxFunc - horaMinFunc) / .5) - 0.1)

        for (let i = 0; i < numServicosPossiveisDia; i++) {
            listaHoraDisponivel.push('*')
        }

        return listaHoraDisponivel.map(() => {

            countIndexMap++
            let horaBloqueada = false

            for (let i = 0; i < listaHoraAgendamento.length; i++) {
                if (listaHoraAgendamento[i] == count) {
                    horaBloqueada = true
                    calcDuracaoServico(calcHoraServico(count))
                    count += (0.5 * tamDuracaoServico)
                }
            }

            if (!(count + horaServico > horaMaxFunc)) {
                if (!horaBloqueada) {
                    let aux = count
                    count += .5
                    // console.log(count)
                    if (horaServico == .5 || horaServico == 1.5) {
                        return <li>{aux.toString().replace('.5', ':30')}h</li>
                    }
                    else
                        return <li>{aux.toString().replace('.5', ':30')}h</li>
                } else {
                    horaBloqueada = false
                    return ''
                }
            }
        })
    }

    const listarHorariosDisponiveis2 = () => {
        for (let i = 0; i < listaHoraAgendamento.length; i++) {
            listaHoraBloqueada.push(listaHoraAgendamento[i] + ListaTempoAgendamento[i])
        }

        return listaHoraBloqueada.map(hora => {
            return <>{hora}<br /><br /></>
        })

    }

    // ##### HANDLES DO FORMULÁRIO #####
    const handleChangeBarbeiro = event => {
        setIdBarbeiro(event.target.value)
    }

    const handleChangeData = event => {
        setData(event)
        agendamentoDia = format(event, "yyyy-MM-dd")
        filtrarAgendamentoData(agendamentoDia)
    }

    const handleChangeNomeCliente = event => {
        setNomeCliente(event.target.value)
    }

    const handleChangeEmailCliente = event => {
        setEmailCliente(event.target.value)
    }

    const handleChangeTelefoneCliente = event => {
        setTelefoneCliente(event.target.value)
    }

    // ##### HANDLES DE SUBMIT #####
    const handleSubmitPostAgemdamento = event => {
        event.preventDefault()

        const agendamento = {
            name: nomeCliente,
            email: emailCliente,
            contato: telefoneCliente,
            horario: "2021-02-09T08:00:00",
            servicosId: barbearia,
            barbeirosId: idBarbeiro,
            barbeariasId: 1
        }
        // console.log(agendamento)

        axios.post(`https://mybarberapi.herokuapp.com/api/v1/agendamentos/`, agendamento)
            .then(res => {
                console.log(res);
                console.log(res.data);

            })
    }


    return (
        <section className="FormAgendamento-section">
            <h1>Preencha as informações para agendar</h1>
            <form className="FormAgendamento-form" onSubmit={handleSubmitPostAgemdamento}>
                <label className="FormAgendamento-espacamento">Serviço:</label>
                <input disabled type="text" placeholder={nomeServico}></input>

                <label className="FormAgendamento-espacamento">Cabeleleiro(a):</label>
                <select name="select" onChange={handleChangeBarbeiro} className="FormAgendamento-select">
                    <option key="0" value="0">Selecionar</option>
                    {listarBarbeiros()}
                </select>

                {
                    fotoBarbeiro ?
                        <div>
                            < div className="FormAgendamento-div-formata-foto-barbeiro" >
                                <img src={
                                    fotoBarbeiro
                                } className="FormAgendamento-foto-barbeiro"></img>
                            </div>
                            <div className="FormAgendamento-div-foto-barbeiro">
                            </div>
                        </div>
                        : ''
                }

                <label className="FormAgendamento-espacamento">Data agendamento:</label>
                <div className="FormAgendamento-div-calendar">
                    <Calendar
                        className="FormAgendamento-calendar"
                        onChange={handleChangeData}
                        value={data}
                    />
                </div>
                {/* {format(data, "yyyy-MM-dd")}<br /> */}

                {resAgendamentoDia == '' ? '' :
                    resAgendamentoDia.map(agendamento => {
                        horaAgendamento = parseFloat(agendamento.horario.slice(11, 16).toString().replace(':', '.'))
                        listaHoraAgendamento.push(horaAgendamento)

                        return <>horário agendamento: {agendamento.horario.slice(11, 16)}h<br /><br /></>
                    })
                }
                #################################################<br /><br />

                {resAgendamentoDia == '' ? '' :
                    resAgendamentoDia.map(agendamento => {
                        tempoAgendamento = parseFloat(agendamento.servicos.tempoServico.slice(11, 16).toString().replace(':', '.'))
                        ListaTempoAgendamento.push(tempoAgendamento)

                        return <>horário agendamento: {agendamento.servicos.tempoServico.slice(11, 16)}h<br /><br /></>
                    })
                }
                #################################################<br /><br />

                {listarHorariosDisponiveis2()}

                #################################################<br /><br />
                <ul>
                    {
                        horariosDisponiveis ? listarHorariosDisponiveis() : ''
                    }
                </ul>

                <label className="FormAgendamento-espacamento">Nome:</label>
                <input type="text" onChange={handleChangeNomeCliente}></input>

                <label className="FormAgendamento-espacamento">E-mail:</label>
                <input type="email" onChange={handleChangeEmailCliente}></input>

                <label className="FormAgendamento-espacamento">Telefone:</label>
                <input type="tel" onChange={handleChangeTelefoneCliente}></input>

                <button type="submit" className="FormAgendamento-button FormAgendamento-espacamento">Agendar</button>
            </form>
        </section >
    )
}