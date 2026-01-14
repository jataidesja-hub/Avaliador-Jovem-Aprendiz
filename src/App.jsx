import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EvaluationBoard from './components/EvaluationBoard';
import RegistrationModal from './components/RegistrationModal';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apprentices, setApprentices] = useState([]);

  const handleTabChange = (tab) => {
    if (tab === 'register') {
      setIsModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleAddApprentice = (newApprentice) => {
    setApprentices((prev) => [...prev, {
      ...newApprentice,
      id: Date.now(),
      column: 'not_evaluated',
      cycle: 1,
      photo: null
    }]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-agrovale-soft-bg text-gray-800 font-inter">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard apprentices={apprentices} />
              </motion.div>
            )}

            {activeTab === 'evaluations' && (
              <motion.div
                key="evaluations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-[calc(100vh-80px)]"
              >
                <EvaluationBoard apprentices={apprentices} setApprentices={setApprentices} />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass p-10 rounded-[40px] max-w-2xl"
              >
                <h2 className="text-3xl font-bold mb-2">Configurações</h2>
                <p className="text-gray-500 mb-8">Administração do sistema Falcão Engenharia.</p>

                <div className="space-y-6">
                  <div className="p-6 bg-white/50 rounded-3xl border border-white/40 shadow-sm">
                    <h3 className="font-bold text-gray-800">Conexão com a Planilha</h3>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-gray-600">Integrado: "AValiação Jovens" (Sheet: Aprendizes)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddApprentice}
      />

      {/* Floating Action Button (Optional/Modern touch) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-agrovale-orange text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-orange-600 transition-colors z-40"
      >
        <span className="text-2xl font-bold">+</span>
      </motion.button>
    </div>
  );
}

export default App;
