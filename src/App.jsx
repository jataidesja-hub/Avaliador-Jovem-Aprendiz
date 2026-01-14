import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EvaluationBoard from './components/EvaluationBoard';
import RegistrationModal from './components/RegistrationModal';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabChange = (tab) => {
    if (tab === 'register') {
      setIsModalOpen(true);
    } else {
      setActiveTab(tab);
    }
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
                <Dashboard />
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
                <EvaluationBoard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
