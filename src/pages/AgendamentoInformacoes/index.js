import React from 'react'

import Cabecalho from '../../components/CabecalhoSecundario'
import FormAgendamento from '../../components/FormAgendamento'
import Rodape from '../../components/Rodape'

import axios from 'axios';

export default class AgendamentoInformacoes extends React.Component {

    constructor() {
        super()

        this.infos = 0
    }

    state = {
        carregada: false
    }

    async componentDidMount() {
        await axios.get(`https://mybarberapi.herokuapp.com/api/v1/barbearias/1/`)
            .then(res => {
                this.infos = res.data;
                this.setState({ carregada: true })
                // console.log(this.infos)
                // console.log(this.infos.servicos.map(servico => servico.servicosBarbeiros.map(barbeiro => barbeiro.barbeiros.nameBarbeiro)))
            })
    }

    render() {
        return (
            <>
                {this.state.carregada ? <>
                    <Cabecalho />
                    <FormAgendamento servicos={this.infos.servicos}/>
                    <Rodape />
                </> : ''}
            </>
        )
    }
}