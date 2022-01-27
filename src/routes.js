import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Inicio from './pages/Inicio'
import Agendamento from "./pages/Agendamento"
import AgendamentoInformacoes from "./pages/AgendamentoInformacoes"
import Login from "./pages/Login";
import AdmMaster from "./pages/AdmMaster";
import ConfirmacaoAgendamento from "./pages/ConfirmacaoAgendamento";

export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio/>} />
                <Route path="/agendamento" element={<Agendamento/>} />
                <Route path="/agendamento/informacoes" element={<AgendamentoInformacoes/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/admmaster" element={<AdmMaster/>} />
                <Route path="/confirmacao-agendamento" element={<ConfirmacaoAgendamento/>} />
            </Routes>
        </BrowserRouter>
    )
}