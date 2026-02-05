import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EvaluationBoard from './components/EvaluationBoard';
import RegistrationModal from './components/RegistrationModal';
import EvaluationModal from './components/EvaluationModal';
import ModuleSelection from './components/ModuleSelection';
import RHDashboard from './components/RH/RHDashboard';
import RHCollaborators from './components/RH/RHCollaborators';
import RHEmployeeModal from './components/RH/RHEmployeeModal';
import RHSettings from './components/RH/RHSettings';
import RHAttendanceLogs from './components/RH/RHAttendanceLogs';
import RHFaceClock from './components/RH/RHFaceClock';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApprentices, saveApprentice, updateApprenticeEvaluation, updateApprentice, deleteApprentice, fetchConfigs, saveConfigs } from './services/api';
import { fetchEmployees, saveEmployee, deleteEmployee, fetchRHConfigs, saveRHConfigs, fetchAttendanceLogs, fetchFaceRegistrations } from './services/rhApi';
import { Plus, Trash2, Building2, UserCheck, ArrowLeft } from 'lucide-react';

function App() {
  const [currentModule, setCurrentModule] = useState(null); // 'jovem-aprendiz' or null
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [selectedApprentice, setSelectedApprentice] = useState(null);
  const [editingApprentice, setEditingApprentice] = useState(null);
  const [apprentices, setApprentices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // RH Specific States
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [rhConfigs, setRhConfigs] = useState({
    sectors: [], companies: [], additionTypes: []
  });
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [faceRegistrations, setFaceRegistrations] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic Config State
  const [sectors, setSectors] = useState(['Administrativo', 'Operacional', 'Manutenção', 'RH', 'Financeiro']);
  const [supervisors, setSupervisors] = useState(['Carlos Silva', 'Ana Oliveira', 'Roberto Santos']);

  const loadData = async () => {
    try {
      const [apprenticeData, configData, employeeData, rhConfigData, logsData] = await Promise.all([
        fetchApprentices(),
        fetchConfigs(),
        fetchEmployees(),
        fetchRHConfigs(),
        fetchAttendanceLogs()
      ]);

      setApprentices(apprenticeData);
      setEmployees(employeeData);
      setRhConfigs(rhConfigData);
      setAttendanceLogs(logsData);

      // Carregar cadastros faciais
      try {
        const faceData = await fetchFaceRegistrations();
        setFaceRegistrations(faceData);
      } catch (e) {
        console.error('Error loading face registrations:', e);
      }

      // Merge backend configs with any unique ones from apprentice data
      const backendSectors = configData.sectors || [];
      const backendSupervisors = configData.supervisors || [];

      const dataSectors = [...new Set(apprenticeData.map(a => a.cargo).filter(Boolean))];
      const dataSupervisors = [...new Set(apprenticeData.map(a => a.supervisor).filter(Boolean))];

      setSectors([...new Set([...backendSectors, ...dataSectors])]);
      setSupervisors([...new Set([...backendSupervisors, ...dataSupervisors])]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleTabChange = (tab) => {
    if (tab === 'register') {
      if (currentModule === 'jovem-aprendiz') setIsModalOpen(true);
      else setIsEmployeeModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleAddApprentice = async (newApprentice, isEdit = false) => {
    try {
      if (isEdit) {
        await updateApprentice(newApprentice);
        setApprentices(prev => prev.map(a =>
          a.matricula === newApprentice.matricula ? { ...a, ...newApprentice } : a
        ));
        // Force refresh from server to confirm persistence
        setTimeout(loadData, 1000);
      } else {
        await saveApprentice(newApprentice);
        setApprentices((prev) => [...prev, {
          ...newApprentice,
          id: newApprentice.matricula || Date.now(),
          column: 'not_evaluated',
          cycle: 1,
        }]);
      }
    } catch (error) {
      alert("Erro ao processar dados. Verifique a conexão.");
    } finally {
      setIsModalOpen(false);
      setEditingApprentice(null);
    }
  };

  const handleEdit = (apprentice) => {
    setEditingApprentice(apprentice);
    setIsModalOpen(true);
  };

  const handleDelete = async (matricula) => {
    if (window.confirm("Tem certeza que deseja excluir este jovem aprendiz?")) {
      try {
        await deleteApprentice(matricula);
        setApprentices(prev => prev.filter(a => a.matricula !== matricula));
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  const handleEvaluate = (apprentice) => {
    setSelectedApprentice(apprentice);
    setIsEvalModalOpen(true);
  };

  const handleSaveEvaluation = async (evaluationData) => {
    try {
      await updateApprenticeEvaluation(evaluationData);

      setApprentices((prev) => prev.map(a => {
        if (a.id === evaluationData.apprenticeId) {
          const nextCycle = (a.cycle || 1) >= 4 ? 4 : (a.cycle || 1) + 1;
          return {
            ...a,
            cycle: nextCycle,
            lastScore: evaluationData.score
          };
        }
        return a;
      }));
    } catch (error) {
      console.error("Error saving evaluation:", error);
      alert("Erro ao salvar avaliação na planilha.");
    }
  };

  // Config Handlers
  const addSector = async (name) => {
    if (name && !sectors.includes(name)) {
      const newSectors = [...sectors, name];
      setSectors(newSectors);
      await saveConfigs(newSectors, supervisors);
    }
  };
  const removeSector = async (name) => {
    const newSectors = sectors.filter(s => s !== name);
    setSectors(newSectors);
    await saveConfigs(newSectors, supervisors);
  };

  const addSupervisor = async (name) => {
    if (name && !supervisors.includes(name)) {
      const newSupervisors = [...supervisors, name];
      setSupervisors(newSupervisors);
      await saveConfigs(sectors, newSupervisors);
    }
  };
  const removeSupervisor = async (name) => {
    const newSupervisors = supervisors.filter(s => s !== name);
    setSupervisors(newSupervisors);
    await saveConfigs(sectors, newSupervisors);
  };

  const handleUpdateRHConfigs = async (newConfigs) => {
    setRhConfigs(newConfigs);
    await saveRHConfigs(newConfigs);
  };

  // RH Handlers
  const handleSaveEmployee = async (employeeData) => {
    await saveEmployee(employeeData);
    setEmployees(prev => {
      const exists = prev.find(e => e.id === employeeData.id);
      if (exists) return prev.map(e => e.id === employeeData.id ? employeeData : e);
      return [...prev, { ...employeeData, id: Date.now() }];
    });
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Deseja realmente excluir este colaborador?")) {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  if (!currentModule) {
    return <ModuleSelection onSelectModule={setCurrentModule} />;
  }

  if (currentModule === 'ponto-facial') {
    return (
      <RHFaceClock
        onClockIn={(log) => setAttendanceLogs(prev => [log, ...prev])}
        employees={employees}
        attendanceLogs={attendanceLogs}
        onBack={() => setCurrentModule(null)}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-falcao-soft-bg text-gray-800 font-inter antialiased" lang="pt-BR">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onBackToMenu={() => setCurrentModule(null)}
        module={currentModule}
      />

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
              {/* Jovem Aprendiz Tabs */}
              {currentModule === 'jovem-aprendiz' && activeTab === 'dashboard' && (
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

              {currentModule === 'jovem-aprendiz' && activeTab === 'evaluations' && (
                <motion.div
                  key="evaluations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-[calc(100vh-80px)]"
                >
                  <EvaluationBoard
                    apprentices={apprentices}
                    setApprentices={setApprentices}
                    onEvaluate={handleEvaluate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              )}

              {/* RH Tabs */}
              {currentModule === 'rh-gestao' && activeTab === 'dashboard' && (
                <motion.div
                  key="rh-dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <RHDashboard employees={employees} />
                </motion.div>
              )}

              {currentModule === 'rh-gestao' && activeTab === 'evaluations' && (
                <motion.div
                  key="rh-collaborators"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <RHCollaborators
                    employees={employees}
                    faceRegistrations={faceRegistrations}
                    onEdit={(emp) => { setEditingEmployee(emp); setIsEmployeeModalOpen(true); }}
                    onDelete={handleDeleteEmployee}
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                  />
                </motion.div>
              )}

              {currentModule === 'rh-gestao' && activeTab === 'attendance' && (
                <motion.div
                  key="rh-attendance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <RHAttendanceLogs
                    logs={attendanceLogs}
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                  />
                </motion.div>
              )}

              {/* Settings Tab Handle */}
              {activeTab === 'settings' && (
                currentModule === 'rh-gestao' ? (
                  <RHSettings
                    configs={rhConfigs}
                    onUpdateConfigs={handleUpdateRHConfigs}
                  />
                ) : (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="glass p-12 rounded-[48px] max-w-4xl"
                  >
                    <div className="mb-10">
                      <h2 className="text-4xl font-black text-falcao-navy mb-2">Administração</h2>
                      <p className="text-gray-400 font-medium">Gerencie os parâmetros do sistema Falcão Engenharia.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Sectors Management */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-falcao-navy rounded-xl text-white">
                            <Building2 size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">Setores / Cargos</h3>
                        </div>

                        <div className="bg-white/40 rounded-[32px] border border-white/60 p-6 space-y-4">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              id="newSector"
                              placeholder="Novo setor..."
                              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-falcao-navy/10"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  addSector(e.target.value);
                                  e.target.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById('newSector');
                                addSector(input.value);
                                input.value = '';
                              }}
                              className="bg-falcao-navy text-white p-2 rounded-xl hover:bg-black transition-colors"
                            >
                              <Plus size={20} />
                            </button>
                          </div>

                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {sectors.map(s => (
                              <div key={s} className="flex justify-between items-center group bg-white/60 p-3 rounded-xl border border-transparent hover:border-falcao-navy/20 transition-all">
                                <span className="text-sm font-medium text-gray-700">{s}</span>
                                <button onClick={() => removeSector(s)} className="text-red-400 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition-all">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Supervisors Management */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-falcao-navy rounded-xl text-white">
                            <UserCheck size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">Supervisores</h3>
                        </div>

                        <div className="bg-white/40 rounded-[32px] border border-white/60 p-6 space-y-4">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              id="newSupervisor"
                              placeholder="Novo supervisor..."
                              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-falcao-navy/10"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  addSupervisor(e.target.value);
                                  e.target.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById('newSupervisor');
                                addSupervisor(input.value);
                                input.value = '';
                              }}
                              className="bg-falcao-navy text-white p-2 rounded-xl hover:bg-black transition-colors"
                            >
                              <Plus size={20} />
                            </button>
                          </div>

                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {supervisors.map(s => (
                              <div key={s} className="flex justify-between items-center group bg-white/60 p-3 rounded-xl border border-transparent hover:border-falcao-navy/20 transition-all">
                                <span className="text-sm font-medium text-gray-700">{s}</span>
                                <button onClick={() => removeSupervisor(s)} className="text-red-400 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition-all">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingApprentice(null);
        }
        }
        onSave={handleAddApprentice}
        sectors={sectors}
        supervisors={supervisors}
        apprentice={editingApprentice}
      />

      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={isEvalModalOpen}
        onClose={() => setIsEvalModalOpen(false)}
        apprentice={selectedApprentice}
        onSave={handleSaveEvaluation}
      />

      {/* RH Specific Modals */}
      <RHEmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => { setIsEmployeeModalOpen(false); setEditingEmployee(null); }}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
        configs={rhConfigs}
      />

      {/* Floating Action Button */}
      {
        !isLoading && (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentModule === 'jovem-aprendiz') setIsModalOpen(true);
              else setIsEmployeeModalOpen(true);
            }}
            className="fixed bottom-10 right-10 w-16 h-16 bg-falcao-navy text-white rounded-[22px] shadow-2xl shadow-falcao-navy/40 flex items-center justify-center hover:bg-black transition-all z-40 group"
          >
            <span className="text-3xl font-light group-hover:rotate-90 transition-transform duration-300">+</span>
          </motion.button>
        )
      }
    </div>
  );
}

export default App;
