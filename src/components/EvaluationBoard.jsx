import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, User, Star, Search, PlusCircle } from 'lucide-react';

const STATUS_MAP = {
    not_evaluated: { label: 'Pendente', color: 'text-gray-400 bg-gray-50 border-gray-100' },
    dismiss: { label: 'Desligar', color: 'text-red-500 bg-red-50 border-red-100' },
    recover: { label: 'Recuperar', color: 'text-orange-500 bg-orange-50 border-orange-100' },
    fit: { label: 'Apto', color: 'text-green-500 bg-green-50 border-green-100' },
};

const calculateAge = (dateString) => {
    if (!dateString) return '';
    try {
        const birthDate = new Date(dateString);
        if (isNaN(birthDate.getTime())) return '';
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    } catch (e) { return ''; }
};

const ApprenticeListItem = ({ apprentice, onEvaluate }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="group bg-white p-4 rounded-[32px] border border-gray-100 flex items-center gap-6 hover:shadow-2xl hover:shadow-falcao-navy/5 transition-all mb-4"
    >
        {/* Foto */}
        <div className="w-16 h-16 bg-gray-50 rounded-[22px] flex items-center justify-center text-gray-400 border border-gray-100 overflow-hidden shrink-0 transition-transform group-hover:scale-105">
            {apprentice.foto ? (
                <img src={apprentice.foto} alt="" className="w-full h-full object-cover" />
            ) : (
                <User size={28} />
            )}
        </div>

        {/* Info Principal */}
        <div className="flex-1 min-w-0">
            <h4 className="font-black text-gray-800 text-lg group-hover:text-falcao-navy transition-colors truncate">
                {apprentice.nome}
            </h4>
            <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    <Briefcase size={10} className="text-falcao-navy" />
                    {apprentice.cargo}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-falcao-navy uppercase tracking-widest bg-falcao-navy/5 px-2.5 py-1 rounded-lg border border-falcao-navy/10">
                    <Calendar size={10} />
                    {calculateAge(apprentice.nascimento)} anos
                </div>
            </div>
        </div>

        {/* Nota e Status */}
        <div className="hidden lg:flex items-center gap-10 px-10 border-x border-gray-100">
            <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1.5">Nota Atual</span>
                <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={12}
                                className={`${s <= Math.round(apprentice.lastScore || 0) ? 'fill-orange-400 text-orange-400' : 'text-gray-100'}`}
                            />
                        ))}
                    </div>
                    {apprentice.lastScore ? (
                        <span className="text-xs font-black text-gray-800">{apprentice.lastScore}</span>
                    ) : (
                        <span className="text-[10px] font-black text-gray-300">SC</span>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1.5">Status</span>
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${STATUS_MAP[apprentice.column]?.color || STATUS_MAP.not_evaluated.color}`}>
                    {STATUS_MAP[apprentice.column]?.label || STATUS_MAP.not_evaluated.label}
                </span>
            </div>
        </div>

        {/* Botão Avaliar */}
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1.5">Progresso</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map((c) => (
                        <div
                            key={c}
                            className={`w-6 h-1 rounded-full transition-all duration-500 ${c <= (apprentice.cycle || 1) ? 'bg-falcao-navy' : 'bg-gray-100'}`}
                        />
                    ))}
                </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEvaluate(apprentice);
                }}
                className="bg-gray-50 hover:bg-falcao-navy text-gray-400 hover:text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-3 border border-gray-100 hover:border-falcao-navy shadow-sm hover:shadow-xl hover:shadow-falcao-navy/20 active:scale-95 group/btn"
            >
                Avaliar
                <Star size={12} className="group-hover/btn:fill-white" />
            </button>
        </div>
    </motion.div>
);

export default function EvaluationBoard({ apprentices = [], setApprentices, onEvaluate }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApprentices = apprentices.filter(a =>
        a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.matricula?.toString().includes(searchTerm)
    );

    return (
        <div className="h-full flex flex-col gap-8 max-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-falcao-navy tracking-tight">Avaliar Desempenho</h2>
                    <p className="text-gray-400 font-medium mt-1">Selecione um jovem aprendiz na lista para iniciar a avaliação.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou matrícula..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-[24px] pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-falcao-navy/5 focus:border-falcao-navy/20 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide pb-20">
                <AnimatePresence mode="popLayout">
                    {filteredApprentices.length > 0 ? (
                        filteredApprentices.map((apprentice) => (
                            <ApprenticeListItem
                                key={apprentice.id}
                                apprentice={apprentice}
                                onEvaluate={onEvaluate}
                            />
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-20">
                            <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center shadow-sm mb-6">
                                <Search size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-black text-gray-500 uppercase tracking-widest">Nenhum resultado</h3>
                            <p className="text-sm font-medium text-gray-400 mt-2">Não encontramos aprendizes com este termo de busca.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
