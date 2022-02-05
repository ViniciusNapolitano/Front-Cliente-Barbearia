import React, { useEffect, useState } from 'react'

import './style.css'

import Rodape from '../../components/Rodape'
import Agenda from '../../components/Agenda'
import Cabecalho from '../../components/CabecalhoSecundario'
import axios from 'axios'
// import { Link } from 'react-router-dom'

import { getToken } from '../../services/Autenticacao.service.ts'

import { useNavigate } from 'react-router-dom';

import { EstadoContext } from "../../components/Providers/estado";
import { render } from '@testing-library/react'

export default function AgendaBarbeiro() {

    const [data] = useState(new Date())
    const [dataFormatada, setDataFormatada] = useState('')
    const [barbearia, setBarbearia] = useState('')
    const [listaAgendamentos, setListaAgendamentos] = useState([])

    const { maisDetalhes, setMaisDetalhes, agendamento } = React.useContext(EstadoContext)

    let nomeBarbeiro = ''

    let dia = data.getDate().toString().padStart(2, '0')
    let mes = (data.getMonth() + 1).toString().padStart(2, '0')
    let ano = data.getFullYear().toString()

    let navigate = useNavigate()

    const getBarbearia = async () => {
        await axios.get('https://mybarberapi.herokuapp.com/api/v1/barbearias/1/')
            .then(res => {
                setBarbearia(res.data)
                // console.log(res);
                // console.log(res.data);
                // console.log(barbearia)
            })
            .catch(() => {
                // console.log('Deu ruim')
            })
    }

    const handleListaAgendamentos = async () => {
        await axios.get(`https://mybarberapi.herokuapp.com/api/v1/agendamentos/tenant/1?NomeBarbeiro=${nomeBarbeiro}&Date=${dataFormatada}`)
            .then(res => {
                // console.log(res);
                // console.log(res.data);
                setListaAgendamentos(res.data)
            })
            .catch(() => {
                console.log('Deu ruim')
            })
    }

    const listarBarbeiros = () => {
        let listaBarbeiros = []

        return barbearia.servicos.map(servico => {
            return servico.servicosBarbeiros.map(barbeiro => {
                if (!listaBarbeiros.includes(barbeiro.barbeiros.nameBarbeiro)) {
                    listaBarbeiros.push(barbeiro.barbeiros.nameBarbeiro)
                    return <option key={barbeiro.barbeiros.idBarbeiro} value={barbeiro.barbeiros.nameBarbeiro}>{barbeiro.barbeiros.nameBarbeiro}</option>
                }
            })
        })
    }

    useEffect(() => {
        setDataFormatada(ano + '-' + mes + '-' + dia)

        getBarbearia()
    }, [])

    const handleChangeData = event => {
        setDataFormatada(event.target.value)
        handleListaAgendamentos()
    }

    const handleChangeBarbeiro = event => {
        nomeBarbeiro = event.target.value
        handleListaAgendamentos()
    }

    const bloqueioSessao = () => {
        navigate('/login')
        return ''
    }

    return (

        getToken() ?
            <>
                {
                    maisDetalhes
                        ? <div className='AgendaBarbeiro-pelicula-maisdetalhes'>
                            <div className='AgendaBarbeiro-modal'>
                                <div className='AgendaBarbeiro-wrap-fechar-modal'>
                                    <button className='AgendaBarbeiro-fechar-modal' onClick={() => setMaisDetalhes(false)}>X</button>
                                </div>
                                <h1>Detalhes do Agendamento</h1>
                                <div className='AgendaBarbeiro-wrap-modal-content'>
                                    <p><span className='AgendaBarbeiro-span-bold'>Barbeiro: </span>{agendamento.barbeiros.nameBarbeiro}</p>
                                    <p><span className='AgendaBarbeiro-span-bold'>Cliente: </span>{agendamento.name}</p>
                                    <p><span className='AgendaBarbeiro-span-bold'>Contato: </span>{agendamento.contato}</p>
                                    <p><span className='AgendaBarbeiro-span-bold'>E-mail: </span>{agendamento.email}</p>
                                    <p><span className='AgendaBarbeiro-span-bold'>Horário: </span>{agendamento.horario.slice(11, 16).toString()}h</p>
                                    <p><span className='AgendaBarbeiro-span-bold'>Serviço: </span>{agendamento.servicos.nomeServico}</p>
                                    <p><span className='AgendaBarbeiro-span-bold'>Duração Serviço: </span>{agendamento.servicos.tempoServico.slice(11, 16).toString()}h</p>
                                    <p><span className='AgendaBarbeiro-span-bold'>Preço: </span>{agendamento.servicos.precoServico} R$</p>
                                </div>
                            </div>
                        </div>
                        : ''
                }
                <Cabecalho />
                <section className='AgendaBarbeiro-section'>
                    <h1 className='AgendaBarbeiro-h1'>Agendamentos do dia:</h1>

                    <input type='date' value={dataFormatada} onChange={handleChangeData} className='AgendaBarbeiro-input-data'></input>

                    <select name="select" onChange={handleChangeBarbeiro} className="AgendaBarbeiro-select">
                        <option key="0" value="0">Selecionar</option>
                        {
                            barbearia != '' ?
                                listarBarbeiros()
                                : ''
                        }
                    </select>

                    <Agenda agendamentos={listaAgendamentos} />
                </section>
                <Rodape />
            </>
            : bloqueioSessao()


    )

}