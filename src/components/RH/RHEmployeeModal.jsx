import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Briefcase, DollarSign, Calendar, Landmark } from 'lucide-react';

export default function RHEmployeeModal({ isOpen, onClose, onSave, employee = null }) {
    const [formData, setFormData] = useState({
        nome: '',
        setor: '',
        empresa: '',
        salario: '',
        adicionais: '',
        descontos: '',
        admissao: '',
        demissao: ''
    });

    useEffect(() => {
        if (employee) {
            setFormData(employee);
        } else {
            setFormData({
                nome: '', setor: '', empresa: '', salario: '',
                adicionais: '', descontos: '', admissao: '', demissao: ''
            });
        }
    }, [employee, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-falcao-navy/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-falcao-navy uppercase tracking-tighter">CADASTRO DE COLABORADOR</h3>
                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Gestão de RH Falcão Engenharia</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-gray-100 rounded-2xl transition-all"
                            >
                                <X className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            required name="nome" value={formData.nome} onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-falcao-navy/20 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Empresa</label>
                                    <div className="relative">
                                        <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            required name="empresa" value={formData.empresa} onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-falcao-navy/20 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Setor / Cargo</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            required name="setor" value={formData.setor} onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-falcao-navy/20 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Salário Base</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            required type="number" step="0.01" name="salario" value={formData.salario} onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-falcao-navy/20 font-medium font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adicionais</label>
                                    <input
                                        type="number" step="0.01" name="adicionais" value={formData.adicionais} onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-falcao-navy/20 font-medium font-mono"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descontos</label>
                                    <input
                                        type="number" step="0.01" name="descontos" value={formData.descontos} onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-falcao-navy/20 font-medium font-mono"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Data Admissão</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            required type="date" name="admissao" value={formData.admissao} onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-falcao-navy/20 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Data Demissão (Opcional)</label>
                                    <input
                                        type="date" name="demissao" value={formData.demissao} onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-falcao-navy/20 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex gap-4">
                                <button
                                    type="button" onClick={onClose}
                                    className="flex-1 px-8 py-4 bg-gray-50 text-gray-400 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-4 bg-falcao-navy text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-falcao-navy/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                >
                                    <Save size={18} />
                                    Salvar Colaborador
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
