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

export default function FormAgendamento(props) {
    // console.log(props.barbeiros)
    let navigate = useNavigate()
    // const { barbearia, tempoServico } = React.useContext(EstadoContext)
    const [data, setData] = useState(new Date())
    const [dataSelecionada, setDataSelecionada] = useState(new Date())
    const [resAgendamentoDia, setResAgendamentoDia] = useState('')

    // const [nomeCliente, setNomeCliente] = useState('')
    // const [emailCliente, setEmailCliente] = useState('')
    // const [telefoneCliente, setTelefoneCliente] = useState('')
    // const [horaAgendamentoPost, setHoraAgendamentoPost] = useState('')
    // const [idBarbeiro, setIdBarbeiro] = useState('')

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
    // let horaMinFunc = 5
    // let horaMaxFunc = 18
    let tamDuracaoServico = 0
    let horaServico = parseFloat(tempoServico.slice(11, 16).toString().replace(':', '.'))
    let listaHoraDisponivel = []
    let idBarbeiroSelecionado

    let listaGambiarra = []



    useEffect(() => {
        props.servicos.map(servico => servico.servicosBarbeiros.map(barbeiro => {
            if (barbeiro.barbeiros.idBarbeiro == infoCliente.idBarbeiro)
                setFotoBarbeiro(barbeiro.barbeiros.barbeiroImagem.url)
            else if (0 == infoCliente.idBarbeiro)
                setFotoBarbeiro(false)
        }))
    }, [infoCliente.idBarbeiro])

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

    // const valProxAgenDisponivel = (count) => {
    //     let horarioDisponivel = true
    //     listaHoraAgendamento.map(agendamento => {
    //         console.log('Count: ' + count)
    //         console.log('HoraServico: ' + horaServico)
    //         console.log('agendamento: ' + agendamento)
    //         if (agendamento > count) {
    //             if (count + horaServico > agendamento) {
    //                 horarioDisponivel = false
    //             }
    //         }
    //         console.log('horarioDisponivel: ' + horarioDisponivel)
    //     })
    //     return horarioDisponivel

    // }

    const initListaHorariosDisponiveis = () => {
        listaHoraDisponivel = []

        for (let i = horaMinFunc; i < horaMaxFunc; i += .5) {
            listaHoraDisponivel.push([i, ' - Disponivel'])
        }
        // console.log(listaHoraDisponivel)
    }

    const valHorariosBloqueados = (hora) => {
        // console.log(listaHoraDisponivel)
        listaHoraDisponivel.map(horaAgendada => {
            // console.log('hora: ' + hora)
            // console.log('horaAgendada: ' + horaAgendada)


            // let a = data + '-' + infoCliente.horaAgendamentoPost.replace(':', '-')
            let a
            // console.log(a)
            let b = format(dataMinAgendamento, "yyyy-MM-dd-HH-MM")
            // console.log(b)
            a = data + '-' + hora
            // console.log(a)
            if (a < b) {
                a = a.slice(11, 16).toString().replace('-', '.')
                // console.log(horaAgendada[0] == a)
                if (horaAgendada[0] == a)
                    listaGambiarra.push(a)
                // console.log(listaGambiarra)
                // console.log(horaAgendada[0])
                // console.log('Hor??rio n??o permitido')
                // console.log('a? ' + a)
                // console.log('b? ' + b)
            }
            else {
                // console.log('Hor??rio PERMITIDOOOO')
            }

            for (let i = 0; i < listaHoraDisponivel.length; i++) {

                // console.log(listaHoraDisponivel[i][0])
                listaGambiarra.map(item => {
                    if (item == listaHoraDisponivel[i][0]) {
                        listaHoraDisponivel[i][1] = ' - Indispon??vel XXXXXXXXXX'
                    }
                })
            }

            // console.log(hora)
            if (hora == null) {
                for (let i = 0; i < listaHoraDisponivel.length; i++) {
                    // console.log(listaHoraDisponivel[i][0])


                    if (listaHoraDisponivel[i][0] == hora) {

                        for (let j = 0; j < tamDuracaoServico; j++) {
                            try {
                                listaHoraDisponivel[i + j][1] = ' - Indispon??vel XXXXXXXXXX'


                            } catch {

                            }
                        }
                    }

                }
            }
            // console.log(listaHoraDisponivel)
        })
    }

    const valTempoNecessarioDisponivel = () => {
        let duracao = tempoServico.slice(11, 16).toString().replace(':', '.')
        calcDuracaoServico(duracao)
        for (let i = 0; i < listaHoraDisponivel.length; i++) {
            let count = 0
            if (listaHoraDisponivel[i][1] == " - Disponivel") {
                for (let j = 0; j < tamDuracaoServico; j++) {
                    try {
                        if (listaHoraDisponivel[i + j][1] == " - Disponivel") {
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


        // Adiciona a lista listaHoraDisponivel todos os hor??rios dispon??veis
        initListaHorariosDisponiveis()

        // Valida????o na lista de hor??rios dispon??veis
        for (let i = horaMinFunc; i < horaMaxFunc; i += .5) {
            // calcHoraServico -> relaciona i com a dura????o do servi??o que i representa
            // calcDuracaoServico -> converte as horas para floats
            calcDuracaoServico(calcHoraServico(i))

            // Valida????o por hor??rios j?? agendados
            valHorariosBloqueados(i)

        }
        valTempoNecessarioDisponivel()

        // Retorna uma lista das horas dispon??veis
        return listaHoraDisponivel.map(hora => {
            let horaCompleta = hora[0] + ':00'
            horaCompleta = horaCompleta.toString().replace('.5:00', ':30')
            if (horaCompleta.length == 4)
                horaCompleta = '0' + horaCompleta
            // console.log('hora[1]: ' + hora[1])

            if (hora[1] == null)
                return <button className="FormAgendamento-li-horaDisp" type="button" onClick={handleChangeHora} value={horaCompleta}>{horaCompleta}</button>

        })
    }

    // ##### HANDLES DO FORMUL??RIO #####
    const handleChangeBarbeiro = event => {
        idBarbeiroSelecionado = event.target.value
        setInfoCliente({ ...infoCliente, idBarbeiro: idBarbeiroSelecionado })
        // horaMaxFunc = id
        // console.log(idBarbeiroSelecionado)

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

    useEffect(() =>{
        if( 
            infoCliente.emailCliente == '' ||
            infoCliente.horaAgendamentoPost == '' ||
            infoCliente.idBarbeiro == '' ||
            infoCliente.nomeCliente == '' ||
            infoCliente.telefoneCliente == ''
        ){
            setButtonBloqueado(true)
        } else {
            setButtonBloqueado(false)
        }
    })

    // ##### HANDLES DE SUBMIT #####
    const handleSubmitPostAgemdamento = async event => {
        event.preventDefault()
        console.log(infoCliente)
        
        const agendamento = {
            name: infoCliente.nomeCliente,
            email: infoCliente.emailCliente,
            contato: infoCliente.telefoneCliente,
            horario: data + 'T' + infoCliente.horaAgendamentoPost + ':00',
            servicosId: idServico,
            barbeirosId: infoCliente.idBarbeiro,
            barbeariasId: 1
        }

        if (valFormPostAgendamento(agendamento)) {
            // console.log(agendamento)

            await axios.post(`https://mybarberapi.herokuapp.com/api/v1/agendamentos/`, agendamento)
                .then(res => {
                    // console.log(res);
                    // console.log(res.data);
                    navigate('/confirmacao-agendamento')
                })
                .catch(() => {
                    console.log('Deu ruim')
                })
        } else {
            // console.log('Imposs??vel realizar um agendamento!')
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

        // if (!infoCliente.idBarbeiro == '') {
        //     setValIdBarbeiro(false)
        // } else {
        //     setValIdBarbeiro(true)
        //     FormPostValidado = false
        // }

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

        // if (validatorTel(agendamento.contato)) {
        //     setValContato(false)
        // } else {
        //     setValContato(true)
        //     FormPostValidado = false
        // }

        return FormPostValidado
    }

    return (
        <section className="FormAgendamento-section">
            <h1>Preencha as informa????es para agendar</h1>
            <form className="FormAgendamento-form" onSubmit={handleSubmitPostAgemdamento}>
                <label className="FormAgendamento-espacamento">Servi??o:</label>
                <input disabled type="text" placeholder={nomeServico}></input>

                <label className="FormAgendamento-espacamento">Cabelereiro(a):</label>
                <select name="select" onChange={handleChangeBarbeiro} className="FormAgendamento-select">
                    <option key="0" value="0">Selecionar</option>
                    {listarBarbeiros()}
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

                        // return <>hor??rio agendamento: {agendamento.horario.slice(11, 16)}h<br /><br /></>
                    })
                }

                {resAgendamentoDia == '' ? '' :
                    resAgendamentoDia.map(agendamento => {
                        tempoAgendamento = parseFloat(agendamento.servicos.tempoServico.slice(11, 16).toString().replace(':', '.'))
                        ListaTempoAgendamento.push(tempoAgendamento)

                        // return <>hor??rio agendamento: {agendamento.servicos.tempoServico.slice(11, 16)}h<br /><br /></>
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
                        horariosDisponiveis && valDataAgendamento ? listarHorariosDisponiveis() : ''
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
                        O nome deve ter no m??nimo 3 caracteres. <br />
                        O nome deve ter no m??ximo 40 caracteres. <br />
                        O nome n??o pode conter caracteres especiais.
                    </p>
                    : ''
                }

                <label className="FormAgendamento-espacamento ">E-mail:</label>
                <input
                    type="email"
                    onChange={handleChangeEmailCliente}>
                </input>
                {valEmail ?
                    <p className="error-message">Insira um e-mail v??lido.</p>
                    : ''
                }


                <label className="FormAgendamento-espacamento">Telefone:</label>
                <input
                    type="tel"
                    onChange={handleChangeTelefoneCliente}
                >
                </input>
                {infoCliente.telefoneCliente == '' ?
                    <p className="error-message">Insira um contato v??lido.</p>
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