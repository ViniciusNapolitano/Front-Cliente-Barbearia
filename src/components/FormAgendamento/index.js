import React, { useState, useEffect } from "react"

import axios from 'axios';

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import './style.css'

import { format } from 'date-fns'
import { EstadoContext } from "../Providers/estado";

import validator from 'validator'
import validatorTel from "validar-telefone";
import { tr } from "date-fns/locale";

// const validacaoPost = yup.object().shape({
//     name: yup.string().required('Preencha seu nome!')
//     // email: yup.string().email().required(),
//     // contato: yup.number().positive().required()
//     // horario: yup.string().required()
//     // servicosId: yup.number().required(),
//     // barbeirosId: yup.number().required()
//     // barbeariasId: 1
// })

export default function FormAgendamento(props) {

    const { barbearia, nomeServico, tempoServico } = React.useContext(EstadoContext)
    const [idBarbeiro, setIdBarbeiro] = useState('')
    const [data, setData] = useState(new Date())
    const [horaAgendamentoPost, setHoraAgendamentoPost] = useState('')
    const [resAgendamentoDia, setResAgendamentoDia] = useState('')
    const [nomeCliente, setNomeCliente] = useState('')
    const [emailCliente, setEmailCliente] = useState('')
    const [telefoneCliente, setTelefoneCliente] = useState('')
    const [fotoBarbeiro, setFotoBarbeiro] = useState(false)
    const [horariosDisponiveis, setHorariosDisponiveis] = useState(false)

    const [valIdBarbeiro, setValIdBarbeiro] = useState(false)
    const [valDataAgendamento, setValDataAgendamento] = useState(false)
    const [valHoraAgendamento, setValHoraAgendamento] = useState(false)
    const [valName, setValName] = useState(false)
    const [valEmail, setValEmail] = useState(false)
    const [valContato, setValContato] = useState(false)


    let agendamentoDia
    let horaAgendamento
    let listaHoraAgendamento = []
    let tempoAgendamento
    let ListaTempoAgendamento = []
    let horaMinFunc = 5
    let horaMaxFunc = 18
    let tamDuracaoServico = 0
    let horaServico = parseFloat(tempoServico.slice(11, 16).toString().replace(':', '.'))
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

                // console.log(res.data)
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

    const valProxAgenDisponivel = (count) => {
        let horarioDisponivel = true
        listaHoraAgendamento.map(agendamento => {
            console.log('Count: ' + count)
            console.log('HoraServico: ' + horaServico)
            console.log('agendamento: ' + agendamento)
            if (agendamento > count) {
                if (count + horaServico > agendamento) {
                    horarioDisponivel = false
                }
            }
            console.log('horarioDisponivel: ' + horarioDisponivel)
        })
        return horarioDisponivel

    }

    const initListaHorariosDisponiveis = () => {
        listaHoraDisponivel = []

        for (let i = horaMinFunc; i < horaMaxFunc; i += .5) {
            listaHoraDisponivel.push([i, ' - Disponivel'])
        }
    }

    const valHorariosBloqueados = (hora) => {
        listaHoraAgendamento.map(horaAgendada => {
            // console.log('hora: ' + hora)
            // console.log('horaAgendada: ' + horaAgendada)
            if (hora == horaAgendada) {
                for (let i = 0; i < listaHoraDisponivel.length; i++) {
                    if (listaHoraDisponivel[i][0] == hora) {
                        for (let j = 0; j < tamDuracaoServico; j++) {
                            listaHoraDisponivel[i + j][1] = ' - Indisponível XXXXXXXXXX'
                        }
                    }

                }
            }
        })
    }

    const valTempoNecessarioDisponivel = () => {
        let duracao = tempoServico.slice(11, 16).toString().replace(':', '.')
        calcDuracaoServico(duracao)
        for (let i = 0; i < listaHoraDisponivel.length; i++) {
            let count = 0
            if (listaHoraDisponivel[i][1] == ' - Disponivel') {
                for (let j = 0; j < tamDuracaoServico; j++) {
                    try {
                        if (listaHoraDisponivel[i + j][1] == ' - Disponivel') {
                            count++
                            if (count == tamDuracaoServico)
                                listaHoraDisponivel[i][1] = null
                        }
                    } catch {
                    }
                }
            }
        }
    }

    const listarHorariosDisponiveis = () => {


        // Adiciona a lista listaHoraDisponivel todos os horários disponíveis
        initListaHorariosDisponiveis()

        // Validação na lista de horários disponíveis
        for (let i = horaMinFunc; i < horaMaxFunc; i += .5) {
            // calcHoraServico -> relaciona i com a duração do serviço que i representa
            // calcDuracaoServico -> converte as horas para floats
            calcDuracaoServico(calcHoraServico(i))

            // Validação por horários já agendados
            valHorariosBloqueados(i)

        }
        valTempoNecessarioDisponivel()

        // Retorna uma lista das horas disponíveis
        return listaHoraDisponivel.map(hora => {
            let horaCompleta = hora[0] + ':00'
            horaCompleta = horaCompleta.toString().replace('.5:00', ':30')
            if (horaCompleta.length == 4)
                horaCompleta = '0' + horaCompleta
            // console.log('Tamanho: ' + horaCompleta.length)

            if (hora[1] == null)
                return <button className="FormAgendamento-li-horaDisp" type="button" onClick={handleChangeHora} value={horaCompleta}>{horaCompleta}</button>

        })
    }

    // ##### HANDLES DO FORMULÁRIO #####
    const handleChangeBarbeiro = event => {
        setIdBarbeiro(event.target.value)
    }

    const handleChangeData = event => {
        agendamentoDia = format(event, "yyyy-MM-dd")
        setData(agendamentoDia)
        filtrarAgendamentoData(agendamentoDia)
        setValDataAgendamento(true)
    }

    const handleChangeHora = event => {
        setHoraAgendamentoPost(event.target.value)
        setValHoraAgendamento(true)
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
    const handleSubmitPostAgemdamento = async event => {
        event.preventDefault()

        // const isValid = await validacaoPost.isValid(teste)

        const agendamento = {
            name: nomeCliente,
            email: emailCliente,
            contato: telefoneCliente,
            horario: data + 'T' + horaAgendamentoPost + ':00',
            servicosId: barbearia,
            barbeirosId: idBarbeiro,
            barbeariasId: 1
        }

        if(valFormPostAgendamento(agendamento)){
            // console.log(agendamento)
    
            axios.post(`https://mybarberapi.herokuapp.com/api/v1/agendamentos/`, agendamento)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
    
                })
                .catch(() => {
                    console.log('Deu ruim')
                })
        } else {
            console.log('Impossível realizar um agendamento!')
        }

    }

    const valNomeCompleto = (nome) => {
        let valCorreta
        if (nome.length < 3 || nome.length > 40) {
            valCorreta = false
        } else {
            valCorreta = true
            for (let i = 0; i < nome.length; i++) {
                if (nome[i] == '!' ||
                    nome[i] == '@' ||
                    nome[i] == '#' ||
                    nome[i] == '$' ||
                    nome[i] == '%' ||
                    nome[i] == '&' ||
                    nome[i] == '*' ||
                    nome[i] == '(' ||
                    nome[i] == ')' ||
                    nome[i] == '-' ||
                    nome[i] == '+' ||
                    nome[i] == '=' ||
                    nome[i] == '?' ||
                    nome[i] == '|' ||
                    nome[i] == ',' ||
                    nome[i] == ';' ||
                    nome[i] == '/' ||
                    nome[i] == '|' ||
                    nome[i] == '.') {
                    valCorreta = false
                }
            }
        }

        return valCorreta
    }

    const valFormPostAgendamento = (agendamento) => {
        let FormPostValidado = true

        if (!idBarbeiro == '') {
            setValIdBarbeiro(false)
        } else {
            setValIdBarbeiro(true)
            FormPostValidado = false
        }

        if (valNomeCompleto(agendamento.name)) {
            setValName(false)
        } else {
            setValName(true)
            FormPostValidado = false
        }

        if (validator.isEmail(agendamento.email)) {
            setValEmail(false)
        } else {
            setValEmail(true)
            FormPostValidado = false
        }

        if (validatorTel(agendamento.contato)) {
            setValContato(false)
        } else {
            setValContato(true)
            FormPostValidado = false
        }

        return FormPostValidado
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
                {valIdBarbeiro ?
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

                <label>Hora Selecionada: <span className="span-hora">{horaAgendamentoPost}</span></label>
                <input disabled type="text" placeholder={horaAgendamentoPost}></input>
                {!valHoraAgendamento ?
                    <p className="error-message">Selecione uma data para agendar.</p>
                    : ''
                }


                <div className="FormAgendamento-bt-horarios-disponiveis">
                    {
                        horariosDisponiveis ? listarHorariosDisponiveis() : ''
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
                {valContato ?
                    <p className="error-message">Insira um contato válido.</p>
                    : ''
                }

                <button type="submit" className="FormAgendamento-button FormAgendamento-espacamento">Agendar</button>
            </form>
        </section >
    )
}