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

    const [maisDetalhes, setMaisDetalhes] = useState(false)

    const [agendamento, setAgendamento] = useState('')

    const [idAgendamento, setIdAgendamento] = useState('')


    return (
        <EstadoContext.Provider value={{
            barbearia, setBarbearia, 
            nomeServico, setNomeServico,
            tempoServico, setTempoServico,
            maisDetalhes, setMaisDetalhes,
            agendamento, setAgendamento,
            idAgendamento, setIdAgendamento
            }}>
            {props.children}
        </EstadoContext.Provider>
    )
}