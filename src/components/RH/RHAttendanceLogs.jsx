import React from 'react';
import { Search, Clock, Calendar, Hash, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RHAttendanceLogs({ logs = [] }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-4xl font-black text-falcao-navy tracking-tight uppercase">Gestão de Pontos</h2>
                    <p className="text-gray-400 font-medium mt-1">Histórico de registros de frequência dos colaboradores.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar por matrícula..."
                        className="bg-white border-none rounded-2xl py-3 pl-12 pr-6 shadow-sm focus:ring-2 focus:ring-falcao-navy/20 w-64 text-sm font-medium"
                    />
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
                                        <p className="text-sm font-medium">{log.data}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-falcao-navy font-black">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {log.hora}
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
                                        Presente
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center text-gray-300 font-bold uppercase tracking-widest">
                                    Nenhum registro de ponto hoje
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
