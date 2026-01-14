import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, User, Star, Search } from 'lucide-react';

const columns = [
    { id: 'not_evaluated', title: 'Não Avaliados', color: 'bg-gray-55' },
    { id: 'dismiss', title: 'Desligar', color: 'bg-red-50' },
    { id: 'recover', title: 'Recuperar', color: 'bg-orange-50' },
    { id: 'fit', title: 'Apto Efetivação', color: 'bg-green-50' },
];

const ApprenticeCard = ({ apprentice }) => (
    <motion.div
        layoutId={`card-${apprentice.id}`}
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer mb-4 transition-all hover:shadow-md"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
                    <User size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 text-sm leading-tight">{apprentice.nome}</h4>
                    <p className="text-[11px] text-gray-400 font-bold mt-0.5">{apprentice.cargo}</p>
                </div>
            </div>
            <button className="text-gray-300 hover:text-gray-600 transition-colors">
                <MoreHorizontal size={18} />
            </button>
        </div>

        <div className="flex items-center justify-between mt-auto">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((c) => (
                    <div
                        key={c}
                        className={`w-6 h-1.5 rounded-full ${c <= apprentice.cycle ? 'bg-agrovale-green' : 'bg-gray-100'}`}
                    />
                ))}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-agrovale-green uppercase bg-agrovale-green/10 px-2 py-0.5 rounded-full">
                <Star size={10} fill="currentColor" />
                Ciclo {apprentice.cycle}
            </div>
        </div>
    </motion.div>
);

export default function EvaluationBoard({ apprentices = [], setApprentices }) {
    return (
        <div className="h-full flex flex-col gap-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Quadro de Avaliações</h2>
                    <p className="text-gray-500">Gestão de progresso dos jovens da Falcão Engenharia.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar jovem..."
                            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agrovale-green/10"
                        />
                    </div>
                    <button className="bg-agrovale-green text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-agrovale-green/90 shadow-lg shadow-agrovale-green/20 transition-all active:scale-95">
                        Novo Ciclo
                    </button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-0 overflow-x-auto pb-6">
                {columns.map((column) => (
                    <div key={column.id} className="flex flex-col min-w-[300px]">
                        <div className="flex items-center justify-between mb-5 px-2">
                            <div className="flex items-center gap-2.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${column.id === 'dismiss' ? 'bg-red-500' :
                                    column.id === 'recover' ? 'bg-orange-500' :
                                        column.id === 'fit' ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{column.title}</h3>
                            </div>
                            <span className="bg-white border border-gray-100 text-[10px] font-black px-2.5 py-1 rounded-lg text-gray-400 shadow-sm">
                                {apprentices.filter(a => a.column === column.id).length}
                            </span>
                        </div>

                        <div className={`flex-1 ${column.color} rounded-[32px] p-4 border border-gray-100/50 overflow-y-auto scrollbar-hide`}>
                            <AnimatePresence mode="popLayout">
                                {apprentices.length > 0 ? (
                                    apprentices
                                        .filter((a) => a.column === column.id)
                                        .map((apprentice) => (
                                            <ApprenticeCard key={apprentice.id} apprentice={apprentice} />
                                        ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-30">
                                        <User size={32} className="text-gray-400" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Vazio</p>
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
