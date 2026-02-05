import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Briefcase, DollarSign, Calendar, Landmark, Check } from 'lucide-react';

const MultiSelect = ({ label, options, selected, onChange, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (option) => {
        const newSelected = selected.includes(option)
            ? selected.filter(i => i !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    return (
        <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 min-h-[48px] cursor-pointer flex flex-wrap gap-2 items-center"
            >
                <Icon className="absolute left-4 top-4 text-gray-400" size={18} />
                {selected.length > 0 ? selected.map(item => (
                    <span key={item} className="bg-falcao-navy text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        {item}
                        <X size={10} onClick={(e) => { e.stopPropagation(); toggleOption(item); }} />
                    </span>
                )) : <span className="text-gray-400 text-sm">Selecione...</span>}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-[120] left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-48 overflow-y-auto p-2"
                        >
                            {options.map(option => (
                                <div
                                    key={option}
                                    onClick={() => toggleOption(option)}
                                    className="flex justify-between items-center px-4 py-2 hover:bg-falcao-navy/5 rounded-xl cursor-not-allowed transition-all"
                                >
                                    <span className="text-sm font-medium text-gray-700">{option}</span>
                                    {selected.includes(option) && <Check size={14} className="text-falcao-navy" />}
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function RHEmployeeModal({ isOpen, onClose, onSave, employee = null, configs = {} }) {
    const { sectors = [], companies = [], additionTypes = [], discountTypes = [] } = configs;

    const [formData, setFormData] = useState({
        nome: '',
        setor: [],
        empresa: '',
        salario: '',
        adicionais: '',
        descontos: [],
        admissao: '',
        demissao: ''
    });

    useEffect(() => {
        if (employee) {
            // Ensure arrays for multi-select
            setFormData({
                ...employee,
                setor: Array.isArray(employee.setor) ? employee.setor : (employee.setor ? employee.setor.split(', ') : []),
                descontos: Array.isArray(employee.descontos) ? employee.descontos : (employee.descontos ? employee.descontos.split(', ') : [])
            });
        } else {
            setFormData({
                nome: '', setor: [], empresa: '', salario: '',
                adicionais: '', descontos: [], admissao: '', demissao: ''
            });
        }
    }, [employee, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert arrays back to strings if necessary for backend, or leave as array
        const dataToSave = {
            ...formData,
            setor: formData.setor.join(', '),
            descontos: formData.descontos.join(', ')
        };
        onSave(dataToSave);
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
                                <div className="space-y-2 col-span-1 md:col-span-2">
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
                                        <select
                                            required name="empresa" value={formData.empresa} onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-falcao-navy/20 font-medium appearance-none"
                                        >
                                            <option value="">Selecione...</option>
                                            {companies.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <MultiSelect
                                    label="Setores (Pode escolher mais de 1)"
                                    options={sectors}
                                    selected={formData.setor}
                                    onChange={(val) => setFormData(prev => ({ ...prev, setor: val }))}
                                    icon={Briefcase}
                                />

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
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Adicional</label>
                                    <select
                                        name="adicionais" value={formData.adicionais} onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-falcao-navy/20 font-medium appearance-none"
                                    >
                                        <option value="">Nenhum</option>
                                        {additionTypes.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>

                                <MultiSelect
                                    label="Descontos (Pode escolher mais de 1)"
                                    options={discountTypes}
                                    selected={formData.descontos}
                                    onChange={(val) => setFormData(prev => ({ ...prev, descontos: val }))}
                                    icon={Percent}
                                />

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
