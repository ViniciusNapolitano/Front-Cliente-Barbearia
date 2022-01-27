import React from 'react'

import './style.css'

import Rodape from '../../components/Rodape'
import { Link } from 'react-router-dom'

export default class ConfirmacaoAgendamento extends React.Component {

    render() {
        return (
            <>
                <section className='Login-section'>
                    <div className='Login-pelicula'>
                        <div className='ConfirmacaoAgendamento-content'>
                            <h1>Agendamento Realizado</h1>
                            <p>Seu horário está marcado, você receberá um e-mail de confirmação.</p>
                            
                            <Link to='/'><button>Voltar ao início</button></Link>
                        </div>
                    </div>
                </section>
                <Rodape />
            </>
        )
    }
}