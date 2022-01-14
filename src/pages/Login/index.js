import React from 'react'

import './style.css'

import Rodape from '../../components/Rodape'

export default class Login extends React.Component {
    render() {
        return (
            <>
                <section className='Login-section'>
                    <div className='Login-pelicula'>
                        <form className='Login-form'>
                            <div className='Login-titulo'>
                                <h1>Login Agenda</h1>
                            </div>

                            <label>Usuário:</label>
                            <input type="text"></input>

                            <label>Senha:</label>
                            <input type="password"></input>

                            <div className='Login-esqueci-senha-div'>
                                <a href='#'>Esqueci minha senha.</a>
                            </div>

                            <button type='submit'>Entrar</button>
                        </form>
                    </div>
                </section>
                <Rodape />
            </>
        )
    }
}