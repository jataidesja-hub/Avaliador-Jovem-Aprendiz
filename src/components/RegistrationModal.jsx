import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Briefcase, Calendar, Hash, Users, UserCircle, Camera } from 'lucide-react';

const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
            <Icon size={14} className="text-falcao-navy" />
            {label}
        </label>
        <input
            {...props}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-falcao-navy focus:ring-4 focus:ring-falcao-navy/5 transition-all text-sm"
        />
    </div>
);

const SelectField = ({ label, icon: Icon, options, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
            <Icon size={14} className="text-falcao-navy" />
            {label}
        </label>
        <select
            {...props}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-falcao-navy focus:ring-4 focus:ring-falcao-navy/5 transition-all appearance-none cursor-pointer text-sm"
        >
            <option value="">Selecione...</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

export default function RegistrationModal({ isOpen, onClose, onSave }) {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        matricula: '',
        nome: '',
        cargo: '',
        supervisor: '',
        nascimento: '',
        admissao: '',
        termino: '',
        genero: '',
        foto: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, foto: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setFormData({
            matricula: '',
            nome: '',
            cargo: '',
            supervisor: '',
            nascimento: '',
            admissao: '',
            termino: '',
            genero: '',
            foto: null
        });
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-falcao-navy p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Cadastrar Jovem Aprendiz</h3>
                                <p className="text-white/20 text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full inline-block mt-1">Falcão Engenharia</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
                            {/* Photo Upload Section */}
                            <div className="md:col-span-2 flex justify-center mb-2">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-falcao-navy hover:bg-gray-100 transition-all group overflow-hidden"
                                >
                                    {formData.foto ? (
                                        <img src={formData.foto} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Camera size={24} className="text-gray-400 group-hover:text-falcao-navy transition-colors" />
                                            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Foto</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <InputField
                                label="Matrícula"
                                icon={Hash}
                                name="matricula"
                                value={formData.matricula}
                                onChange={handleChange}
                                placeholder="Ex: 123456"
                                required
                            />
                            <InputField
                                label="Nome Completo"
                                icon={User}
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Nome do aprendiz"
                                required
                            />

                            <SelectField
                                label="Cargo / Setor"
                                icon={Briefcase}
                                name="cargo"
                                value={formData.cargo}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: 'Administrativo', label: 'Administrativo' },
                                    { value: 'Operacional', label: 'Operacional' },
                                    { value: 'Manutenção', label: 'Manutenção' },
                                ]}
                            />

                            <InputField
                                label="Supervisor"
                                icon={Users}
                                name="supervisor"
                                value={formData.supervisor}
                                onChange={handleChange}
                                placeholder="Nome do supervisor"
                                required
                            />

                            <InputField
                                label="Data de Nascimento"
                                icon={Calendar}
                                name="nascimento"
                                value={formData.nascimento}
                                onChange={handleChange}
                                type="date"
                                required
                            />

                            <InputField
                                label="Data de Admissão"
                                icon={Calendar}
                                name="admissao"
                                value={formData.admissao}
                                onChange={handleChange}
                                type="date"
                                required
                            />

                            <InputField
                                label="Data de Término"
                                icon={Calendar}
                                name="termino"
                                value={formData.termino}
                                onChange={handleChange}
                                type="date"
                                required
                            />

                            <SelectField
                                label="Gênero"
                                icon={UserCircle}
                                name="genero"
                                value={formData.genero}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: 'Feminino', label: 'Feminino' },
                                    { value: 'Masculino', label: 'Masculino' },
                                    { value: 'Outro', label: 'Outro' },
                                ]}
                            />

                            <div className="md:col-span-2 pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-3.5 rounded-2xl hover:bg-gray-200 transition-colors text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-falcao-navy text-white font-bold py-3.5 rounded-2xl hover:bg-black transition-all shadow-lg shadow-falcao-navy/20 flex items-center justify-center gap-2 text-sm"
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
