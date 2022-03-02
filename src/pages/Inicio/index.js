import React from 'react'
import Cabecalho from '../../components/Cabecalho'
import Apresentacao from '../../components/Apresentacao'
import Servico from '../../components/Servico'
import Fotos from '../../components/Fotos'
import Mapa from '../../components/Mapa'
import Rodape from '../../components/Rodape'

import axios from 'axios';
export default class Inicio extends React.Component {
    constructor() {
        super()
        window.localStorage.clear()
        this.infos = 0
    }

    state = {
        carregada: false
    }

    async componentDidMount() {
        await axios.get('https://mybarberapi.herokuapp.com/api/v1/barbearias/1/')
            .then(res => {
                const resGet = res.data
                this.infos = res.data
                this.setState({ resGet: resGet })
                // this.setState({ resGet });
                this.setState({ carregada: true })
                // console.log(resGet)
            })
    }

    render() {
        return (
            <>
                {this.state.carregada ?
                    <>

                        <Cabecalho />
                        <Apresentacao titulo={this.infos.nomeBarbearia} />
                        <Servico servicos={this.infos.servicos} />
                        <Fotos />
                        <Mapa />
                        <Rodape />
                    </>
                    : ''}
            </>
        )
    }
}