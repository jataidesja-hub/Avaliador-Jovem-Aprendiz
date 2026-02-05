import React from 'react';
import { Edit2, Trash2, Search, RefreshCw, ScanFace, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RHCollaborators({ employees = [], faceRegistrations = [], onEdit, onDelete, onRefresh, isRefreshing = false }) {
    const hasFaceRegistered = (matricula) => {
        return faceRegistrations.includes(String(matricula));
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
                            <th className="px-6 py-6">Admissão</th>
                            <th className="px-6 py-6 text-center">Facial</th>
                            <th className="px-6 py-6 text-right">Salário</th>
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
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="font-bold text-gray-700 text-sm">{emp?.setor || 'Sem Setor'}</p>
                                    <p className="text-xs text-gray-400">{emp?.empresa || 'Sem Empresa'}</p>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-sm font-medium text-gray-600">
                                        {emp?.admissao && !isNaN(new Date(emp.admissao).getTime()) ? new Date(emp.admissao).toLocaleDateString('pt-BR') : '---'}
                                    </p>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    {emp?.matricula && hasFaceRegistered(emp.matricula) ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase">
                                            <ScanFace size={12} />
                                            Cadastrada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-500 rounded-full text-[10px] font-black uppercase">
                                            <XCircle size={12} />
                                            Pendente
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <p className="font-black text-falcao-navy">R$ {parseFloat(emp?.salario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
                                    <td colSpan="7" className="px-8 py-20 text-center text-gray-300 font-bold uppercase tracking-widest">
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
