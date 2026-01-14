import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, User, Star } from 'lucide-react';

const columns = [
    { id: 'not_evaluated', title: 'Não Avaliados', color: 'bg-gray-100' },
    { id: 'dismiss', title: 'Desligar', color: 'bg-red-50' },
    { id: 'recover', title: 'Recuperar', color: 'bg-orange-50' },
    { id: 'fit', title: 'Apto Efetivação', color: 'bg-green-50' },
];

const apprentices = [
    { id: 1, name: 'Ana Silva', role: 'Auxiliar Administrativo', photo: null, column: 'not_evaluated', cycle: 2 },
    { id: 2, name: 'João Santos', role: 'Operador de Máquinas', photo: null, column: 'recover', cycle: 1 },
    { id: 3, name: 'Maria Oliveira', role: 'Assistente Logística', photo: null, column: 'fit', cycle: 4 },
    { id: 4, name: 'Carlos Lima', role: 'Manutenção Preventiva', photo: null, column: 'dismiss', cycle: 3 },
    { id: 5, name: 'Bárbara Costa', role: 'TI Suporte', photo: null, column: 'not_evaluated', cycle: 1 },
];

const ApprenticeCard = ({ apprentice }) => (
    <motion.div
        layoutId={`card-${apprentice.id}`}
        whileHover={{ scale: 1.02 }}
        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing mb-3"
    >
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <User size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 text-sm">{apprentice.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{apprentice.role}</p>
                </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={16} />
            </button>
        </div>

        <div className="flex items-center justify-between mt-4">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((c) => (
                    <div
                        key={c}
                        className={`w-5 h-1.5 rounded-full ${c <= apprentice.cycle ? 'bg-agrovale-green' : 'bg-gray-100'}`}
                    />
                ))}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-agrovale-green">
                <Star size={10} fill="currentColor" />
                Ciclo {apprentice.cycle}
            </div>
        </div>
    </motion.div>
);

export default function EvaluationBoard() {
    return (
        <div className="h-full flex flex-col gap-6">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Quadro de Avaliações</h2>
                    <p className="text-gray-500">Gerencie o progresso e status dos jovens aprendizes.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                        Filtrar
                    </button>
                    <button className="bg-agrovale-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-agrovale-green/90 shadow-lg shadow-agrovale-green/20">
                        Novo Ciclo
                    </button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-0 overflow-x-auto pb-4">
                {columns.map((column) => (
                    <div key={column.id} className="flex flex-col min-w-[280px]">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${column.id === 'dismiss' ? 'bg-red-500' :
                                        column.id === 'recover' ? 'bg-orange-500' :
                                            column.id === 'fit' ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                                <h3 className="font-bold text-gray-700">{column.title}</h3>
                            </div>
                            <span className="bg-white border border-gray-100 text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-400">
                                {apprentices.filter(a => a.column === column.id).length}
                            </span>
                        </div>

                        <div className={`flex-1 ${column.color} rounded-2xl p-3 border-2 border-dashed border-gray-200/50 overflow-y-auto`}>
                            <AnimatePresence mode="popLayout">
                                {apprentices
                                    .filter((a) => a.column === column.id)
                                    .map((apprentice) => (
                                        <ApprenticeCard key={apprentice.id} apprentice={apprentice} />
                                    ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
