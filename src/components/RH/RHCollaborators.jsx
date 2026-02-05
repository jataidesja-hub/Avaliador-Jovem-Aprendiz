import React from 'react';
import { Edit2, Trash2, Search, RefreshCw, ScanFace, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RHCollaborators({ employees = [], faceRegistrations = [], rhConfigs = {}, onEdit, onDelete, onRefresh, isRefreshing = false }) {
    const { additionTypes = [] } = rhConfigs;

    const hasFaceRegistered = (matricula) => {
        return faceRegistrations.includes(String(matricula));
    };

    const calculateTotalSalary = (salary, adicionaisStr) => {
        const base = parseFloat(salary || 0);
        const selectedAdds = typeof adicionaisStr === 'string' ? adicionaisStr.split(', ').filter(Boolean) : [];

        const sumAdds = selectedAdds.reduce((acc, addName) => {
            const addConfig = additionTypes.find(a => a.name === addName);
            return acc + (addConfig ? parseFloat(addConfig.value || 0) : 0);
        }, 0);

        return base + sumAdds;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-black text-falcao-navy tracking-tight">Colaboradores</h2>
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
                            <th className="px-6 py-6">Matrícula</th>
                            <th className="px-6 py-6">Nome</th>
                            <th className="px-6 py-6">Setor / Empresa</th>
                            <th className="px-6 py-6 border-l border-white/10 text-center">Cadastro</th>
                            <th className="px-6 py-6 text-right">Salário Total</th>
                            <th className="px-6 py-6 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees && employees.length > 0 ? employees.map((emp) => (
                            <tr key={emp?.id || Math.random()} className="hover:bg-falcao-navy/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <p className="font-mono font-bold text-falcao-navy text-sm">#{emp?.matricula || '---'}</p>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-falcao-navy font-bold">
                                            {emp?.nome ? emp.nome.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{emp?.nome || 'Sem Nome'}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">ADMISSÃO: {emp?.admissao && !isNaN(new Date(emp.admissao).getTime()) ? new Date(emp.admissao).toLocaleDateString('pt-BR') : '---'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="font-bold text-gray-700 text-sm">{emp?.setor || 'Sem Setor'}</p>
                                    <p className="text-xs text-gray-400">{emp?.empresa || 'Sem Empresa'}</p>
                                </td>
                                <td className="px-6 py-5 border-l border-gray-50 bg-gray-50/30">
                                    <div className="flex flex-col items-center gap-1">
                                        {emp?.matricula && hasFaceRegistered(emp.matricula) ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-[9px] font-black uppercase">
                                                <ScanFace size={10} />
                                                Facial OK
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-500 rounded-full text-[9px] font-black uppercase">
                                                <XCircle size={10} />
                                                Facial Pendente
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex flex-col items-end">
                                        <p className="font-black text-falcao-navy text-lg leading-none">
                                            R$ {calculateTotalSalary(emp?.salario, emp?.adicionais).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                        {emp?.adicionais && (
                                            <p className="text-[9px] text-falcao-navy/40 font-bold uppercase mt-1">
                                                +{emp.adicionais}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => onEdit(emp)} className="p-2 hover:bg-white rounded-xl text-blue-600 transition-all shadow-sm shadow-transparent hover:shadow-blue-100">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => onDelete(emp?.matricula)} className="p-2 hover:bg-white rounded-xl text-red-500 transition-all shadow-sm shadow-transparent hover:shadow-red-500/10">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                            : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-gray-300 font-bold uppercase tracking-widest">
                                        Nenhum colaborador encontrado
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
