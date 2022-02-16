import { format } from 'date-fns'

const formataLayoutHora2 = (hora) => {
    return hora.toString().replace(':00', '').replace(':30', '.5')
}

// Regra 1: Não é permitido horários fora do expediente
export function popularHorariosExpediente (horaMinFunc, horaMaxFunc) {
    let listaHora = []
    for (let i = horaMinFunc; i < horaMaxFunc; i += 0.5)
        listaHora.push(i)

    return listaHora
}

// Regra 2: Não é permitido horários já agendados
export function HorariosJaAgendados(listaHorarios, horario, duracao) {
    listaHorarios.map(horaDisponivel => {

        if (horaDisponivel == horario) {
            let idx = listaHorarios.indexOf(parseFloat(horario))
            listaHorarios.splice(idx, duracao / .5)
        }
    })

    return listaHorarios
}

// Regra 3: Não é permitido horários sem agendamento e que já passaram da hora atual
export function HorarioNaoPermitido(listaHorarios, dataSelecionada) {
    let dataAtual = new Date()
    let dataAtualFormatada = format(dataAtual, 'yyyy-MM-dd')
    let listaHorariosExcluir = []
    let listaHorariosTratados = []

    if (dataAtualFormatada == dataSelecionada && dataAtual.getHours() == 0) {
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
export function valDuracaoServico(listaHorarios, duracaoServico) {
    let duracaoServicoFormatado = parseFloat(formataLayoutHora2(duracaoServico))

    // Valida se cada hora da lista possui (Hora + Duração do Serviço) como um valor verdadeiro indicando que há espaço
    for (let i = 0; i < listaHorarios.length; i++) {
        if (!(listaHorarios[i] + (duracaoServicoFormatado - .5) == listaHorarios[i + ((duracaoServicoFormatado / .5) - 1)])) {
            listaHorarios.splice(i, (duracaoServicoFormatado / .5) - 1)
        }
    }

    return listaHorarios
}