import React, { useState } from 'react'

import './style.css'

import Rodape from '../../components/Rodape'

import axios from 'axios';




export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmitPost = event => {
        event.preventDefault()

        const login = {
            username: username,
            password: password
        }

        console.log(login)
        axios.post(`https://mybarberapi.herokuapp.com/api/v1/aut`, login)
            .then(res => {
                console.log(res);
                console.log(res.data);

            })
            .catch(() => {
                console.log('Deu ruim')
            })
    }

    const handleUsuario = event => {
        setUsername(event.target.value)
    }

    const handleSenha = event => {
        setPassword(event.target.value)

    }

    return (
        <>
            <section className='Login-section'>
                <div className='Login-pelicula'>
                    <form className='Login-form' onSubmit={handleSubmitPost}>
                        <div className='Login-titulo'>
                            <h1>Login Agenda</h1>
                        </div>

                        <label>Usuário:</label>
                        <input type="text" onChange={handleUsuario}></input>

                        <label>Senha:</label>
                        <input type="password" onChange={handleSenha}></input>

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