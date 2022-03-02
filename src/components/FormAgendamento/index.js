import React, { useState, useEffect } from "react"

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import './style.css'

import { format } from 'date-fns'
import { EstadoContext } from "../Providers/estado";

import validator from 'validator'
import validatorTel from "validar-telefone";
import { HorarioNaoPermitido, HorariosJaAgendados, popularHorariosExpediente, valDuracaoServico } from "../../services/HorariosDisponiveis.service";

export default function FormAgendamento(props) {

    let navigate = useNavigate()

    const [data, setData] = useState(new Date())
    const [dataSelecionada, setDataSelecionada] = useState(new Date())
    const [resAgendamentoDia, setResAgendamentoDia] = useState([])

    const [infoCliente, setInfoCliente] = useState({
        nomeCliente: '',
        emailCliente: '',
        telefoneCliente: '',
        horaAgendamentoPost: '',
        idBarbeiro: ''
    })

    var idServico = window.localStorage.getItem('idServico')
    var nomeServico = window.localStorage.getItem('nomeServico')
    var tempoServico = window.localStorage.getItem('tempoServico')

    var dataMinAgendamento = new Date()
    var dataMaxAgendamento = new Date()
    dataMaxAgendamento.setMonth((dataMinAgendamento.getMonth() + 1))

    const [precoServico, setPrecoServico] = useState(window.localStorage.getItem('precoServico'))
    if (precoServico == null)
        setPrecoServico(0)

    const [fotoBarbeiro, setFotoBarbeiro] = useState(false)
    const [horariosDisponiveis, setHorariosDisponiveis] = useState(false)

    // const [valIdBarbeiro, setValIdBarbeiro] = useState(false)
    const [valDataAgendamento, setValDataAgendamento] = useState(false)
    const [valHoraAgendamento, setValHoraAgendamento] = useState(false)
    const [valName, setValName] = useState(false)
    const [valEmail, setValEmail] = useState(false)

    const [horaMinFunc, setHoraMinFunc] = useState(5)
    const [horaMaxFunc, setHoraMaxFunc] = useState(18)

    const [buttonBloqueado, setButtonBloqueado] = useState(true)

    let agendamentoDia
    let horaAgendamento
    let listaHoraAgendamento = []
    let tempoAgendamento
    let ListaTempoAgendamento = []
    let tamDuracaoServico = 0
    // let horaServico = parseFloat(tempoServico.slice(11, 16).toString().replace(':', '.'))
    let listaHoraDisponivel = []
    let idBarbeiroSelecionado = 0

    useEffect(() => {
        if (typeof infoCliente.idBarbeiro == 'string') {
            props.servicos.map(servico => servico.servicosBarbeiros.map(barbeiro => {
                if (barbeiro.barbeiros.idBarbeiro == infoCliente.idBarbeiro)
                    setFotoBarbeiro(barbeiro.barbeiros.barbeiroImagem.url)
                else if (0 == infoCliente.idBarbeiro)
                    setFotoBarbeiro(false)
            }))
        }
    }, [infoCliente.idBarbeiro])

    async function filtrarAgendamentoData(agendamentoDia) {
        await axios.get(`https://mybarberapi.herokuapp.com/api/v1/agendamentos/tenant/1?Date=${agendamentoDia}`)
            .then(res => {
                setResAgendamentoDia(res.data)

                setHorariosDisponiveis(true)

                // console.log(res.data)
            })
    }

    const listarServicos = () => {
        // console.log(nomeServico)
        return props.servicos.map(servico => {
            // console.log(servico.tempoServico)
            if (servico.idServico == window.localStorage.getItem('idServico'))
                return <option selected onClick={() => handleChangeTempoServico(servico.tempoServico, servico.precoServico)} key={servico.nomeServico} value={servico.idServico}>{servico.nomeServico}</option>

            else
                return <option onClick={() => handleChangeTempoServico(servico.tempoServico, servico.precoServico)} key={servico.nomeServico} value={servico.idServico}>{servico.nomeServico}</option>

        })
    }

    const listarBarbeiros = () => {
        return props.servicos.map(servico => {
            if (servico.idServico == idServico) {
                return servico.servicosBarbeiros.map(barbeiro => {
                    return <option key={barbeiro.barbeiros.idBarbeiro} value={barbeiro.barbeiros.idBarbeiro}>{barbeiro.barbeiros.nameBarbeiro}</option>
                })
            }
        })
    }

    const calcHoraServico = (hora) => {
        let duracaoServico
        resAgendamentoDia.map(agendamento => {
            if (parseFloat(agendamento.horario.slice(11, 16).toString().replace(':', '.').replace('.3', '.5')) == hora) {
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

    // ##### HANDLES DO FORMULÁRIO #####
    const handleChangeServico = event => {
        window.localStorage.setItem('idServico', event.target.value)
        idServico = event.target.value
        setInfoCliente({ ...infoCliente, idBarbeiro: true })
        setFotoBarbeiro(false)

        props.servicos.map(servico => {
            if (servico.idServico == window.localStorage.getItem('idServico'))
                setPrecoServico(servico.precoServico)
        })
    }

    const handleChangeTempoServico = (tempoServico, precoServico) => {
        window.localStorage.setItem('tempoServico', tempoServico)
        // setPrecoServico(precoServico)
    }

    const handleChangeBarbeiro = event => {
        idBarbeiroSelecionado = event.target.value
        setInfoCliente({ ...infoCliente, idBarbeiro: idBarbeiroSelecionado })

    }

    const handleChangeData = event => {
        let dayName = new Array("domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado")
        let dayNameSelecionado
        agendamentoDia = format(event, "yyyy-MM-dd")

        setDataSelecionada(event)

        setData(agendamentoDia)
        filtrarAgendamentoData(agendamentoDia)

        dayNameSelecionado = dayName[event.getDay()]
        // console.log(event)
        props.barbeiros.map(barbeiro => {
            // console.log(barbeiro)

            if (barbeiro.idBarbeiro == infoCliente.idBarbeiro) {

                const diasDaSemana = {
                    domingo: () => {
                        setHoraMinFunc(barbeiro.agendas.domingo[0])
                        setHoraMaxFunc(barbeiro.agendas.domingo[1])
                    },
                    segunda: () => {
                        setHoraMinFunc(barbeiro.agendas.segunda[0])
                        setHoraMaxFunc(barbeiro.agendas.segunda[1])
                    },
                    terca: () => {
                        setHoraMinFunc(barbeiro.agendas.terca[0])
                        setHoraMaxFunc(barbeiro.agendas.terca[1])
                    },
                    quarta: () => {
                        setHoraMinFunc(barbeiro.agendas.quarta[0])
                        setHoraMaxFunc(barbeiro.agendas.quarta[1])
                    },
                    quinta: () => {
                        setHoraMinFunc(barbeiro.agendas.quinta[0])
                        setHoraMaxFunc(barbeiro.agendas.quinta[1])
                    },
                    sexta: () => {
                        setHoraMinFunc(barbeiro.agendas.sexta[0])
                        setHoraMaxFunc(barbeiro.agendas.sexta[1])
                    },
                    sabado: () => {
                        setHoraMinFunc(barbeiro.agendas.sabado[0])
                        setHoraMaxFunc(barbeiro.agendas.sabado[1])
                    }
                }
                diasDaSemana[dayNameSelecionado]()
                setValDataAgendamento(true)
            }
        })
    }

    const handleChangeHora = event => {
        // setHoraAgendamentoPost(event.target.value)
        setInfoCliente({ ...infoCliente, horaAgendamentoPost: event.target.value })

        setValHoraAgendamento(true)
    }

    const handleChangeNomeCliente = event => {
        // setNomeCliente(event.target.value)
        setInfoCliente({ ...infoCliente, nomeCliente: event.target.value })
    }

    const handleChangeEmailCliente = event => {
        // setEmailCliente(event.target.value)
        setInfoCliente({ ...infoCliente, emailCliente: event.target.value })

    }

    const handleChangeTelefoneCliente = event => {
        // setTelefoneCliente(event.target.value)
        setInfoCliente({ ...infoCliente, telefoneCliente: event.target.value })

    }

    useEffect(() => {
        if (
            infoCliente.emailCliente == '' ||
            infoCliente.horaAgendamentoPost == '' ||
            infoCliente.idBarbeiro == '' ||
            infoCliente.nomeCliente == '' ||
            infoCliente.telefoneCliente == ''
        ) {
            setButtonBloqueado(true)
        } else {
            setButtonBloqueado(false)
        }
    })

    const formataLayoutHora1 = (hora) => {
        hora += ':00'
        return hora.toString().replace('.5:00', ':30')
    }

    const formataLayoutHora2 = (hora) => {
        return hora.toString().replace(':00', '').replace(':30', '.5')
    }

    const regrasNegocioHorariosDisponivei = () => {
        let listaHorariosDisponiveis = []
        let horarioFormatado

        // Regra 1: Não é permitido horários fora do expediente
        listaHorariosDisponiveis = popularHorariosExpediente(horaMinFunc, horaMaxFunc)

        // Regra 2: Não é permitido horários já agendados
        resAgendamentoDia.map(agendamento => {
            listaHorariosDisponiveis = HorariosJaAgendados(
                listaHorariosDisponiveis,
                formataLayoutHora2(agendamento.horario.slice(11, 16)),
                formataLayoutHora2(agendamento.servicos.tempoServico.slice(11, 16))
            )
        })

        // Regra 3: Não é permitido horários sem agendamento e que já passaram da hora atual
        listaHorariosDisponiveis = HorarioNaoPermitido(listaHorariosDisponiveis, data)

        // Regra 4: Não é permitido horáruios que não cabem a duração do serviço
        listaHorariosDisponiveis = valDuracaoServico(listaHorariosDisponiveis, tempoServico.slice(11, 16))

        return listaHorariosDisponiveis.map(horario => {
            horarioFormatado = formataLayoutHora1(horario)

            return <button
                type="button"
                className="FormAgendamento-li-horaDisp"
                onClick={handleChangeHora}
                value={horarioFormatado}
            >{horarioFormatado}</button>
        })

    }

    // ##### HANDLES DE SUBMIT #####
    const handleSubmitPostAgemdamento = async event => {
        event.preventDefault()
        let horaAgendamento = infoCliente.horaAgendamentoPost

        if (infoCliente.horaAgendamentoPost.length == 4)
            horaAgendamento = '0' + infoCliente.horaAgendamentoPost.toString()

        const agendamento = {
            name: infoCliente.nomeCliente,
            email: infoCliente.emailCliente,
            contato: infoCliente.telefoneCliente,
            horario: data + 'T' + horaAgendamento + ':00',
            servicosId: parseInt(idServico),
            barbeirosId: parseInt(infoCliente.idBarbeiro),
            barbeariasId: 1
        }
        console.log(agendamento)
        await axios.post(`http://mybarberapi.herokuapp.com/api/v1/agendamentos/`, agendamento)
            // await axios.post(`http://apibarber.vps-kinghost.net:443/api/v1/agendamentos/`, agendamento)
            .then(res => {
                // console.log(res);
                // console.log(res.data);
                navigate('/confirmacao-agendamento')
            })
            .catch(() => {
                console.log('Deu ruim')
            })
    }

    // const valNomeCompleto = (nome) => {
    //     let valCorreta
    //     if (nome.length < 3 || nome.length > 40) {
    //         valCorreta = false
    //     } else {
    //         valCorreta = true
    //         for (let i = 0; i < nome.length; i++) {
    //             if (nome[i] == '!' ||
    //                 nome[i] == '@' ||
    //                 nome[i] == '#' ||
    //                 nome[i] == '$' ||
    //                 nome[i] == '%' ||
    //                 nome[i] == '&' ||
    //                 nome[i] == '*' ||
    //                 nome[i] == '(' ||
    //                 nome[i] == ')' ||
    //                 nome[i] == '-' ||
    //                 nome[i] == '+' ||
    //                 nome[i] == '=' ||
    //                 nome[i] == '?' ||
    //                 nome[i] == '|' ||
    //                 nome[i] == ',' ||
    //                 nome[i] == ';' ||
    //                 nome[i] == '/' ||
    //                 nome[i] == '|' ||
    //                 nome[i] == '.') {
    //                 valCorreta = false
    //             }
    //         }
    //     }

    //     return valCorreta
    // }

    // const valFormPostAgendamento = (agendamento) => {
    //     let FormPostValidado = true

    //     if (valNomeCompleto(agendamento.name)) {
    //         setValName(false)
    //     } else {
    //         setValName(true)
    //         FormPostValidado = false
    //     }

    //     if (validator.isEmail(agendamento.email)) {
    //         setValEmail(false)
    //     } else {
    //         setValEmail(true)
    //         FormPostValidado = false
    //     }

    //     return FormPostValidado
    // }

    return (
        <section className="FormAgendamento-section">
            <h1>Preencha as informações para agendar</h1>
            <form className="FormAgendamento-form" onSubmit={handleSubmitPostAgemdamento}>
                <label className="FormAgendamento-espacamento">Serviço:</label>
                {/* <input disabled type="text" placeholder={nomeServico}></input> */}
                <select name="select" onChange={handleChangeServico} className="FormAgendamento-select">
                    <option key="0" value="0">Selecionar</option>
                    {listarServicos()}
                </select>

                <label className="FormAgendamento-espacamento">Preço do Serviço:</label>
                <input disabled id='FormAgendamento-input-preco' type="text" placeholder={parseFloat(precoServico).toFixed(2) + ' R$'}></input>


                <label className="FormAgendamento-espacamento">Cabelereiro(a):</label>
                <select name="select" onChange={handleChangeBarbeiro} className="FormAgendamento-select">
                    <option key="0" value="0">Selecionar</option>
                    {

                        listarBarbeiros()
                        // infoCliente.idBarbeiro ?
                        //     : ''
                    }
                </select>
                {infoCliente.idBarbeiro == '' ?
                    <p className="error-message">Selecione um barbeiro.</p>
                    : ''
                }

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
                        minDate={dataMinAgendamento}
                        maxDate={dataMaxAgendamento}
                    // value={data}
                    />
                </div>

                {!valDataAgendamento ?
                    <p className="error-message">Selecione uma data para agendar.</p>
                    : ''
                }

                {resAgendamentoDia == '' ? '' :
                    resAgendamentoDia.map(agendamento => {
                        horaAgendamento = parseFloat(agendamento.horario.slice(11, 16).toString().replace(':', '.').replace('.3', '.5'))
                        listaHoraAgendamento.push(horaAgendamento)

                        // return <>horário agendamento: {agendamento.horario.slice(11, 16)}h<br /><br /></>
                    })
                }

                {resAgendamentoDia == '' ? '' :
                    resAgendamentoDia.map(agendamento => {
                        tempoAgendamento = parseFloat(agendamento.servicos.tempoServico.slice(11, 16).toString().replace(':', '.'))
                        ListaTempoAgendamento.push(tempoAgendamento)

                        // return <>horário agendamento: {agendamento.servicos.tempoServico.slice(11, 16)}h<br /><br /></>
                    })
                }

                <label>Hora Selecionada: </label>
                <input disabled type="text" placeholder={infoCliente.horaAgendamentoPost}></input>
                {!valHoraAgendamento ?
                    <p className="error-message">Selecione uma data para agendar.</p>
                    : ''
                }


                <div className="FormAgendamento-bt-horarios-disponiveis">
                    {
                        valDataAgendamento ? regrasNegocioHorariosDisponivei()
                            : ''
                    }
                </div>

                <label className="FormAgendamento-espacamento">Nome:</label>
                <input type="text"
                    onChange={handleChangeNomeCliente}
                    maxLength="40"
                    minLength='3'
                ></input>
                {valName ?
                    <p className="error-message">
                        O nome deve ter no mínimo 3 caracteres. <br />
                        O nome deve ter no máximo 40 caracteres. <br />
                        O nome não pode conter caracteres especiais.
                    </p>
                    : ''
                }

                <label className="FormAgendamento-espacamento ">E-mail:</label>
                <input
                    type="email"
                    onChange={handleChangeEmailCliente}>
                </input>
                {valEmail ?
                    <p className="error-message">Insira um e-mail válido.</p>
                    : ''
                }


                <label className="FormAgendamento-espacamento">Telefone:</label>
                <input
                    type="tel"
                    onChange={handleChangeTelefoneCliente}
                >
                </input>
                {infoCliente.telefoneCliente == '' ?
                    <p className="error-message">Insira um contato válido.</p>
                    : ''
                }

                <button type="submit"
                    className=
                    {buttonBloqueado ?
                        "FormAgendamento-button  FormAgendamento-espacamento buttonBloqueado"
                        :
                        'FormAgendamento-button FormAgendamento-espacamento '
                    }
                    disabled={buttonBloqueado}
                >Agendar</button>
            </form>
        </section >
    )
}