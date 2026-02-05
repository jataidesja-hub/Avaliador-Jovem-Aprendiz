import React from 'react';
import { Search, Clock, Calendar, Hash, Briefcase, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// Função para formatar data vinda do Google Sheets
const formatDate = (dateValue) => {
    if (!dateValue) return '---';

    // Se já está no formato dd/mm/yyyy
    if (typeof dateValue === 'string' && dateValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return dateValue;
    }

    // Se é uma data ISO ou timestamp do Google Sheets
    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime()) || date.getFullYear() < 2000) {
            return '---';
        }
        return date.toLocaleDateString('pt-BR');
    } catch {
        return '---';
    }
};

// Função para formatar hora
const formatTime = (timeValue) => {
    if (!timeValue) return '---';

    // Se já está no formato HH:MM
    if (typeof timeValue === 'string' && timeValue.match(/^\d{2}:\d{2}$/)) {
        return timeValue;
    }

    // Se é uma data ISO ou timestamp do Google Sheets
    try {
        const date = new Date(timeValue);
        if (isNaN(date.getTime())) {
            return '---';
        }
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '---';
    }
};

export default function RHAttendanceLogs({ logs = [], onRefresh, isRefreshing = false }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-4xl font-black text-falcao-navy tracking-tight uppercase">Gestão de Pontos</h2>
                    <p className="text-gray-400 font-medium mt-1">Histórico de registros de frequência dos colaboradores.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-3 bg-falcao-navy text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-falcao-navy/90 transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        Atualizar
                    </button>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            className="bg-white border-none rounded-2xl py-3 pl-12 pr-6 shadow-sm focus:ring-2 focus:ring-falcao-navy/20 w-48 text-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="glass rounded-[40px] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-falcao-navy text-white uppercase text-[10px] font-black tracking-widest">
                        <tr>
                            <th className="px-8 py-6">Colaborador</th>
                            <th className="px-8 py-6">Matrícula</th>
                            <th className="px-8 py-6">Data</th>
                            <th className="px-8 py-6">Hora</th>
                            <th className="px-8 py-6">Setor</th>
                            <th className="px-8 py-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.length > 0 ? logs.map((log, idx) => (
                            <tr key={idx} className="hover:bg-falcao-navy/5 transition-colors group">
                                <td className="px-8 py-5">
                                    <p className="font-bold text-gray-800">{log.nome}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <Hash size={14} className="text-gray-400" />
                                        <p className="font-mono font-bold text-falcao-navy">{log.matricula}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={14} />
                                        <p className="text-sm font-medium">{formatDate(log.data)}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-falcao-navy font-black">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {formatTime(log.hora)}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Briefcase size={14} />
                                        <p className="text-xs font-bold uppercase">{log.setor}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {log.tipo || 'Entrada'}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center text-gray-300 font-bold uppercase tracking-widest">
                                    Nenhum registro de ponto encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
