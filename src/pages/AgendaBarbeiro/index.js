import React, { useEffect, useState } from 'react'

import './style.css'

import Rodape from '../../components/Rodape'
import Agenda from '../../components/Agenda'
import Cabecalho from '../../components/CabecalhoSecundario'
import axios from 'axios'
// import { Link } from 'react-router-dom'

export default function AgendaBarbeiro() {

    const [data] = useState(new Date())
    const [dataFormatada, setDataFormatada] = useState('')
    const [barbearia, setBarbearia] = useState('')
    const [listaAgendamentos, setListaAgendamentos] = useState([])

    let nomeBarbeiro = ''

    let dia = data.getDate().toString().padStart(2, '0')
    let mes = (data.getMonth() + 1).toString().padStart(2, '0')
    let ano = data.getFullYear().toString()

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
                // console.log('Deu ruim')
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

    return (
        <>
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
    )

}