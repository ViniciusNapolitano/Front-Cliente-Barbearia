import http from '../utils/http'

declare interface Credenciais {
    email: string,
    username: string,
    password: string,
}

declare interface Usuario {
    nomeUsuario: string,
    token: string,
    idBarbearia: number
}

type Token = string

export const login = (credenciais: Credenciais) =>
    http
        .post<Usuario & { token: Token }>('/aut', credenciais)
        .then(res => {
            console.log(res.data)
            return res.data
        })

export const storeToken = (token: Token) => {
    window.localStorage.setItem('token', token)
}

export const getToken = () => {
    return window.localStorage.getItem('token')
}