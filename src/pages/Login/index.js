import React, { useState } from 'react'

import './style.css'

import Rodape from '../../components/Rodape'

import { login } from '../../services/Autenticacao.service.ts'
import { storeToken } from '../../services/Autenticacao.service.ts'

import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [autenticacaoFalhou, setAutenticacaoFalhou] = useState(false)

    let navigate = useNavigate()

    const handleSubmitPost = async (event) => {
        event.preventDefault()

        const credenciais = {
            email: email,
            // username: username,
            password: password
        }

        // console.log(credenciais)

        try {
            const user = await login(credenciais)
            // http.defaults.headers.authorization = `Bearer ${user.token}`
            storeToken(user.token)
            setAutenticacaoFalhou(false)
            navigate('/agenda-barbeiro')
            window.localStorage.setItem('barbeiro', user.nomeUsuario)
        } catch {
            setAutenticacaoFalhou(true)
        }
    }

    const handleEmail = event => {
        setEmail(event.target.value)
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

                        <label>E-mail:</label>
                        <input type="email" onChange={handleEmail}></input>

                        <label>Senha:</label>
                        <input type="password" onChange={handleSenha}></input>

                        {
                            autenticacaoFalhou ?
                                <label className='Login-errado'>E-mail ou senha incorreto!</label>
                                : ''
                        }

                        {/* <div className='Login-esqueci-senha-div'>
                            <a href='#'>Esqueci minha senha.</a>
                        </div> */}

                        <button type='submit'>Entrar</button>
                    </form>
                </div>
            </section>
            <Rodape />
        </>
    )

}