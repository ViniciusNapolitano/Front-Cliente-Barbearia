import React from 'react'

import Cabecalho from '../../components/CabecalhoSecundario'
import PainelServicoCompleto from '../../components/PainelServicoCompleto'
import Rodape from '../../components/Rodape'

import axios from 'axios';
export default class Agendamento extends React.Component {

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
                const resGet = res.data;
                this.infos = res.data;
                this.setState({ resGet: resGet })
                // this.setState({ resGet });
                this.setState({ carregada: true })
                console.log(resGet)
            })
    }

    render() {
        return (
            <>
                {this.state.carregada ? <>
                    <Cabecalho />
                    <PainelServicoCompleto servicos={this.infos.servicos} />
                    <Rodape />
                </> : ''}
            </>
        )
    }
}