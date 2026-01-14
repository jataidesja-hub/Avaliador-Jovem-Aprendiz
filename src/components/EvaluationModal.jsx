import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Star, AlertCircle, TrendingUp } from 'lucide-react';

const EVALUATION_QUESTIONS = [
    {
        id: 'q1',
        text: 'Assiduidade e Pontualidade',
        description: 'Cumpre a jornada de trabalho conforme o contrato, evitando faltas e atrasos injustificados.',
        weight: 3
    },
    {
        id: 'q2',
        text: 'Produtividade e Qualidade',
        description: 'Desenvolve as tarefas com precisão, organização e dentro dos prazos estabelecidos.',
        weight: 3
    },
    {
        id: 'q3',
        text: 'Proatividade e Iniciativa',
        description: 'Demonstra interesse em aprender, busca novos conhecimentos e antecipa necessidades do setor.',
        weight: 2
    },
    {
        id: 'q4',
        text: 'Relacionamento e Trabalho em Equipe',
        description: 'Relaciona-se de forma cordial e profissional com colegas e supervisores.',
        weight: 2
    }
];

const OPTIONS = [
    { label: 'Não Atende', value: 0, color: 'bg-red-100 text-red-600 border-red-200' },
    { label: 'Em Desenvolvimento', value: 5, color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { label: 'Atende Expectativas', value: 8, color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { label: 'Supera Expectativas', value: 10, color: 'bg-green-100 text-green-600 border-green-200' }
];

export default function EvaluationModal({ isOpen, onClose, apprentice, onSave }) {
    const [answers, setAnswers] = useState({});
    const [currentCycle, setCurrentCycle] = useState(apprentice?.cycle || 1);

    const handleSelect = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const calculateTotal = () => {
        let totalWeightedScore = 0;
        let totalWeight = 0;

        EVALUATION_QUESTIONS.forEach(q => {
            if (answers[q.id] !== undefined) {
                totalWeightedScore += answers[q.id] * q.weight;
                totalWeight += q.weight;
            }
        });

        return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(1) : 0;
    };

    const isComplete = EVALUATION_QUESTIONS.every(q => answers[q.id] !== undefined);

    const handleSubmit = (e) => {
        e.preventDefault();
        const score = calculateTotal();
        onSave({
            apprenticeId: apprentice.id,
            cycleFinished: currentCycle,
            score: parseFloat(score),
            answers: answers,
            date: new Date().toISOString()
        });
        setAnswers({});
        onClose();
    };

    if (!apprentice) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="bg-falcao-navy p-8 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp size={18} className="text-blue-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Avaliação Periódica</span>
                                    </div>
                                    <h3 className="text-2xl font-black">{apprentice.nome}</h3>
                                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">
                                        Ciclo {currentCycle} de 4 • {apprentice.cargo}
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
                            {EVALUATION_QUESTIONS.map((q, idx) => (
                                <div key={q.id} className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-falcao-navy/5 flex items-center justify-center text-falcao-navy font-black text-xs border border-falcao-navy/10 shrink-0">
                                            0{idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-800 text-lg leading-tight">{q.text}</h4>
                                            <p className="text-sm text-gray-400 font-medium mt-1">{q.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-12">
                                        {OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => handleSelect(q.id, opt.value)}
                                                className={`px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tighter border-2 transition-all ${answers[q.id] === opt.value
                                                        ? 'bg-falcao-navy border-falcao-navy text-white shadow-lg shadow-falcao-navy/20'
                                                        : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer / Summary */}
                        <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nota Final</p>
                                    <div className={`text-4xl font-black ${parseFloat(calculateTotal()) >= 7 ? 'text-green-500' : 'text-orange-500'}`}>
                                        {calculateTotal()}
                                    </div>
                                </div>
                                {isComplete && (
                                    <div className="flex items-center gap-2 text-green-500 bg-green-50 px-4 py-2 rounded-2xl border border-green-100 animate-bounce">
                                        <CheckCircle2 size={18} />
                                        <span className="text-xs font-black uppercase">Pronto para Salvar</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-8 py-4 bg-white text-gray-400 font-black rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors text-xs uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isComplete}
                                    className={`px-10 py-4 font-black rounded-2xl transition-all text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 ${isComplete
                                            ? 'bg-falcao-navy text-white hover:bg-black shadow-falcao-navy/20'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed grayscale'
                                        }`}
                                >
                                    <Star size={18} />
                                    Finalizar Avaliação
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
