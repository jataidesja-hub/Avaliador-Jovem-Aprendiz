import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Briefcase, Calendar, Hash, Users, UserCircle } from 'lucide-react';

const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
            <Icon size={14} className="text-agrovale-green" />
            {label}
        </label>
        <input
            {...props}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-agrovale-green focus:ring-4 focus:ring-agrovale-green/5 transition-all"
        />
    </div>
);

const SelectField = ({ label, icon: Icon, options, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
            <Icon size={14} className="text-agrovale-green" />
            {label}
        </label>
        <select
            {...props}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-agrovale-green focus:ring-4 focus:ring-agrovale-green/5 transition-all appearance-none cursor-pointer"
        >
            <option value="">Selecione...</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

export default function RegistrationModal({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-agrovale-green p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Cadastrar Jovem Aprendiz</h3>
                                <p className="text-agrovale-green/20 text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full inline-block mt-1">Novo Registro</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                            <InputField label="Matrícula" icon={Hash} placeholder="Ex: 123456" />
                            <InputField label="Nome Completo" icon={User} placeholder="Nome do aprendiz" />

                            <SelectField
                                label="Cargo / Setor"
                                icon={Briefcase}
                                options={[
                                    { value: 'adm', label: 'Administrativo' },
                                    { value: 'op', label: 'Operacional' },
                                    { value: 'man', label: 'Manutenção' },
                                ]}
                            />

                            <InputField label="Supervisor" icon={Users} placeholder="Nome do supervisor" />

                            <InputField label="Data de Início" icon={Calendar} type="date" />
                            <InputField label="Data de Término" icon={Calendar} type="date" />

                            <SelectField
                                label="Gênero"
                                icon={UserCircle}
                                options={[
                                    { value: 'f', label: 'Feminino' },
                                    { value: 'm', label: 'Masculino' },
                                    { value: 'o', label: 'Outro' },
                                ]}
                            />

                            <div className="md:col-span-2 pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-agrovale-green text-white font-bold py-3 rounded-2xl hover:bg-agrovale-green/90 transition-all shadow-lg shadow-agrovale-green/20 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Salvar Registro
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
