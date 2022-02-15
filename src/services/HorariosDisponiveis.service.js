import { format } from 'date-fns'

const formataLayoutHora1 = (hora) => {
    hora += ':00'
    return hora.toString().replace('.5:00', ':30')
}

// Regra 1: Não é permitido horários já agendados
export function HorariosJaAgendados(listaHorarios, horario, duracao) {
    listaHorarios.map(horaDisponivel => {

        if (horaDisponivel == horario) {
            let idx = listaHorarios.indexOf(parseFloat(horario))
            listaHorarios.splice(idx, duracao / .5)
        }
    })

    return listaHorarios
}

// Regra 2: Não é permitido horários fora do expediente

// Regra 3: Não é permitido horários sem agendamento e que já passaram da hora atual
export function HorarioNaoPermitido(listaHorarios, dataSelecionada, horaSelecionada) {
    let dataAtual = new Date()
    let dataAtualFormatada = format(dataAtual, 'yyyy-MM-dd')
    let listaHorariosExcluir = []
    let listaHorariosTratados = []

    if (dataAtual.getHours() == 0) {
        return []

    } else {
        // Cria uma lista dos horários que devem ser excluidos
        for (let i = 0; i < listaHorarios.length; i++) {
            if (dataAtualFormatada == dataSelecionada) {
                let hora = dataAtual.getHours() + '.' + dataAtual.getMinutes()
                if (parseFloat(hora) >= listaHorarios[i]) {
                    listaHorariosExcluir.push(listaHorarios[i])
                }
            }
        }

        // Cria uma lista dos horários que não devem ser excluidos
        for (let i = 0; i < listaHorarios.length; i++) {
            if (!(listaHorarios[i] == listaHorariosExcluir[i])) {
                listaHorariosTratados.push(listaHorarios[i])
            }
        }

        return listaHorariosTratados
    }
}

// Regra 4: Não é permitido horáruios que não cabem a duração do serviço