import React, { useState } from "react";

export const EstadoContext = React.createContext({})

export const EstadoProvider = (props) => {
    const [barbearia, setBarbearia] = useState({
        servicoEscolhido: ''
    })

    const [nomeServico, setNomeServico] = useState({
        nome: 'Serviço não foi selecionado'
    })

    const [tempoServico, setTempoServico] = useState('2022-01-11T01:00:00')

    return (
        <EstadoContext.Provider value={{
            barbearia, setBarbearia, 
            nomeServico, setNomeServico,
            tempoServico, setTempoServico
            }}>
            {props.children}
        </EstadoContext.Provider>
    )
}