import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EvaluationBoard from './components/EvaluationBoard';
import RegistrationModal from './components/RegistrationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApprentices, saveApprentice } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apprentices, setApprentices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApprentices();
        setApprentices(data);
      } catch (error) {
        console.error("Failed to load apprentices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleTabChange = (tab) => {
    if (tab === 'register') {
      setIsModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleAddApprentice = async (newApprentice) => {
    try {
      await saveApprentice(newApprentice);
      // Optimistic update
      setApprentices((prev) => [...prev, {
        ...newApprentice,
        id: newApprentice.matricula,
        column: 'not_evaluated',
        cycle: 1,
      }]);
    } catch (error) {
      alert("Erro ao salvar na planilha. Verifique a conexão.");
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-falcao-soft-bg text-gray-800 font-inter antialiased">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-falcao-navy/10 border-t-falcao-navy rounded-full animate-spin" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Sincronizando Falcão Engenharia...</p>
            </div>
          ) : (
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
                  className="glass p-12 rounded-[48px] max-w-2xl"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-falcao-navy mb-2">Configurações</h2>
                    <p className="text-gray-400 font-medium">Painel de Controle Falcão Engenharia</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 bg-white/40 rounded-[32px] border border-white/60 shadow-sm transition-all hover:shadow-md">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Status da Conexão
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Planilha</span>
                          <span className="font-bold text-falcao-navy">AValiação Jovens</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Aba Ativa</span>
                          <span className="font-bold text-falcao-navy">Aprendizes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Apps Script</span>
                          <span className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded-md">AKfycbx0...hQcA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddApprentice}
      />

      {/* Floating Action Button */}
      {!isLoading && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-10 right-10 w-16 h-16 bg-falcao-navy text-white rounded-[22px] shadow-2xl shadow-falcao-navy/40 flex items-center justify-center hover:bg-black transition-all z-40 group"
        >
          <span className="text-3xl font-light group-hover:rotate-90 transition-transform duration-300">+</span>
        </motion.button>
      )}
    </div>
  );
}

export default App;
