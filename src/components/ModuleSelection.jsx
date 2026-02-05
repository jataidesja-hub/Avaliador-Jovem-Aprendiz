import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, LayoutGrid, Users, Shield } from 'lucide-react';

const modules = [
  {
    id: 'jovem-aprendiz',
    title: 'Avaliador Jovem Aprendiz',
    description: 'Gestão de competências, acompanhamento de ciclos e avaliações de desempenho.',
    icon: ClipboardList,
    color: 'bg-falcao-navy',
    active: true
  },
  {
    id: 'rh-gestao',
    title: 'Gestão de RH',
    description: 'Controle de documentos, feedbacks e histórico profissional.',
    icon: Users,
    color: 'bg-falcao-navy',
    active: true
  }
];

export default function ModuleSelection({ onSelectModule }) {
  return (
    <div className="min-h-screen bg-falcao-soft-bg flex flex-col items-center justify-center p-6 font-inter">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 bg-falcao-navy rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-falcao-navy/20">
            <Shield size={32} fill="currentColor" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black text-falcao-navy leading-tight uppercase tracking-widest">Falcão</h1>
            <p className="text-sm text-gray-400 font-bold tracking-[0.2em] uppercase">Engenharia</p>
          </div>
        </div>
        <h2 className="text-4xl font-black text-gray-800 tracking-tight mb-2">Selecione o Módulo</h2>
        <p className="text-gray-500 font-medium">Bem-vindo ao ecossistema de gestão integrada.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {modules.map((module, idx) => (
          <motion.button
            key={module.id}
            whileHover={module.active ? { scale: 1.02, y: -5 } : {}}
            whileTap={module.active ? { scale: 0.98 } : {}}
            onClick={() => module.active && onSelectModule(module.id)}
            className={`glass p-10 rounded-[48px] text-left transition-all relative overflow-hidden group ${!module.active ? 'opacity-60 cursor-not-allowed shadow-none' : 'hover:shadow-2xl hover:shadow-falcao-navy/10'
              }`}
          >
            <div className={`w-16 h-16 ${module.color} rounded-[22px] flex items-center justify-center text-white mb-8 shadow-lg`}>
              <module.icon size={28} />
            </div>

            <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-falcao-navy transition-colors">{module.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed mb-6">
              {module.description}
            </p>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${module.active
                  ? 'bg-falcao-navy/5 border-falcao-navy/10 text-falcao-navy'
                  : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}>
                {module.active ? 'Acessar Agora' : 'Em Breve'}
              </span>
            </div>

            {/* Background Accent */}
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${module.color} opacity-[0.03] rounded-full blur-3xl`} />
          </motion.button>
        ))}
      </div>

      <footer className="mt-20">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Falcão Engenharia • v2.1.0</p>
      </footer>
    </div>
  );
}
