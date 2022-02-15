// Regra 1: Não é permitido horários já agendados
export function HorariosJaAgendados(listaHorarios, horario) {
    listaHorarios.map(horaDisponivel => {
        if (horaDisponivel == horario) {
            let idx = listaHorarios.indexOf(parseFloat(horario))
            listaHorarios.splice(idx, 1)
        }
    })

    return listaHorarios
}

// Regra 2: Não é permitido horários fora do expediente

// Regra 3: Não é permitido horários sem agendamento e que já passaram da hora atual

// Regra 4: Não é permitido horáruios que não cabem a duração do serviço