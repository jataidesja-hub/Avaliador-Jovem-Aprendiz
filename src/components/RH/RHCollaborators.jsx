import React from 'react';
import { Edit2, Trash2, Search, UserGroup } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RHCollaborators({ employees = [], onEdit, onDelete }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-black text-falcao-navy tracking-tight">Colaboradores</h2>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar funcionário..."
                        className="bg-white border-none rounded-2xl py-3 pl-12 pr-6 shadow-sm focus:ring-2 focus:ring-falcao-navy/20 w-64 text-sm font-medium"
                    />
                </div>
            </div>

            <div className="glass rounded-[40px] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-falcao-navy text-white uppercase text-[10px] font-black tracking-widest">
                        <tr>
                            <th className="px-8 py-6">Matrícula</th>
                            <th className="px-8 py-6">Nome</th>
                            <th className="px-8 py-6">Setor / Empresa</th>
                            <th className="px-8 py-6">Admissão</th>
                            <th className="px-8 py-6 text-right">Salário</th>
                            <th className="px-8 py-6 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees.length > 0 ? employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-falcao-navy/5 transition-colors group">
                                <td className="px-8 py-5">
                                    <p className="font-mono font-bold text-falcao-navy text-sm">#{emp.matricula || '---'}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-falcao-navy font-bold">
                                            {emp.nome.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{emp.nome}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <p className="font-bold text-gray-700 text-sm">{emp.setor}</p>
                                    <p className="text-xs text-gray-400">{emp.empresa}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <p className="text-sm font-medium text-gray-600">{new Date(emp.admissao).toLocaleDateString('pt-BR')}</p>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <p className="font-black text-falcao-navy">R$ {parseFloat(emp.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => onEdit(emp)} className="p-2 hover:bg-white rounded-xl text-blue-600 transition-all shadow-sm shadow-transparent hover:shadow-blue-100">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => onDelete(emp.id)} className="p-2 hover:bg-white rounded-xl text-red-500 transition-all shadow-sm shadow-transparent hover:shadow-red-500/10">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
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
