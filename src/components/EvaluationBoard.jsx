import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, User, Star, Search, PlusCircle } from 'lucide-react';

const columns = [
    { id: 'not_evaluated', title: 'Não Avaliados', color: 'bg-gray-50' },
    { id: 'dismiss', title: 'Desligar', color: 'bg-red-50' },
    { id: 'recover', title: 'Recuperar', color: 'bg-orange-50' },
    { id: 'fit', title: 'Apto Efetivação', color: 'bg-green-50' },
];

const ApprenticeCard = ({ apprentice, onEvaluate }) => (
    <motion.div
        layoutId={`card-${apprentice.id}`}
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 cursor-pointer mb-4 transition-all hover:shadow-md group flex flex-col h-full"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100 overflow-hidden shrink-0">
                    {apprentice.foto ? (
                        <img src={apprentice.foto} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <User size={24} />
                    )}
                </div>
                <div className="min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-falcao-navy transition-colors truncate">{apprentice.nome}</h4>
                    <p className="text-[11px] text-gray-400 font-bold mt-0.5 uppercase tracking-tighter truncate">{apprentice.cargo}</p>
                </div>
            </div>
            <button className="text-gray-300 hover:text-gray-600 transition-colors shrink-0">
                <MoreHorizontal size={18} />
            </button>
        </div>

        <div className="space-y-4 mt-auto">
            <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((c) => (
                        <div
                            key={c}
                            className={`w-6 h-1.5 rounded-full transition-all duration-500 ${c <= (apprentice.cycle || 1) ? 'bg-falcao-navy' : 'bg-gray-100'}`}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-falcao-navy uppercase bg-falcao-navy/5 px-2.5 py-1 rounded-full border border-falcao-navy/10">
                    Ciclo {apprentice.cycle || 1}
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEvaluate(apprentice);
                }}
                className="w-full py-3 bg-gray-50 hover:bg-falcao-navy hover:text-white text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-falcao-navy/20 flex items-center justify-center gap-2 group/btn"
            >
                <Star size={12} className="group-hover/btn:fill-white" />
                Avaliar Desempenho
            </button>
        </div>
    </motion.div>
);

export default function EvaluationBoard({ apprentices = [], setApprentices, onEvaluate }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApprentices = apprentices.filter(a =>
        a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.matricula.includes(searchTerm)
    );

    return (
        <div className="h-full flex flex-col gap-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-falcao-navy tracking-tight">Quadro de Avaliações</h2>
                    <p className="text-gray-400 font-medium mt-1">Gestão de progresso dos jovens da Falcão Engenharia.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar jovem aprendiz..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-falcao-navy/5 focus:border-falcao-navy/20 transition-all shadow-sm"
                        />
                    </div>
                    <button className="bg-falcao-navy text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-black shadow-xl shadow-falcao-navy/20 transition-all active:scale-95 flex items-center gap-2">
                        <PlusCircle size={18} />
                        Novo Ciclo
                    </button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-0 overflow-x-auto pb-6 scrollbar-hide">
                {columns.map((column) => (
                    <div key={column.id} className="flex flex-col min-w-[320px]">
                        <div className="flex items-center justify-between mb-5 px-4">
                            <div className="flex items-center gap-3">
                                <span className={`w-3 h-3 rounded-full shadow-sm ${column.id === 'dismiss' ? 'bg-red-500' :
                                    column.id === 'recover' ? 'bg-orange-500' :
                                        column.id === 'fit' ? 'bg-green-500' : 'bg-falcao-navy'
                                    }`} />
                                <h3 className="font-black text-gray-600 text-xs uppercase tracking-[0.1em]">{column.title}</h3>
                            </div>
                            <span className="bg-white border border-gray-100 text-[10px] font-black px-3 py-1 rounded-xl text-gray-400 shadow-sm">
                                {filteredApprentices.filter(a => a.column === column.id).length}
                            </span>
                        </div>

                        <div className={`flex-1 ${column.color} rounded-[48px] p-5 border border-white/50 overflow-y-auto scrollbar-hide shadow-inner bg-opacity-40`}>
                            <AnimatePresence mode="popLayout">
                                {filteredApprentices.filter(a => a.column === column.id).length > 0 ? (
                                    filteredApprentices
                                        .filter((a) => a.column === column.id)
                                        .map((apprentice) => (
                                            <ApprenticeCard key={apprentice.id} apprentice={apprentice} onEvaluate={onEvaluate} />
                                        ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-3 opacity-20">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <User size={32} className="text-gray-400" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Coluna Vazia</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
