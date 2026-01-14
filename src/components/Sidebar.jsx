import React from 'react';
import { LayoutDashboard, ClipboardList, UserPlus, Settings, LogOut, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active
            ? 'bg-agrovale-green text-white shadow-lg shadow-agrovale-green/20'
            : 'text-gray-500 hover:bg-agrovale-green/10 hover:text-agrovale-green'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </motion.button>
);

export default function Sidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'evaluations', label: 'Avaliações', icon: ClipboardList },
        { id: 'register', label: 'Cadastrar', icon: UserPlus },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 p-6 flex flex-col z-50">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-agrovale-green rounded-xl flex items-center justify-center text-white shadow-lg">
                    <GraduationCap size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-800 leading-tight">Falcão Engenharia</h1>
                    <p className="text-[10px] text-agrovale-orange font-bold tracking-wider uppercase">Jovem Aprendiz</p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={activeTab === item.id}
                        onClick={() => setActiveTab(item.id)}
                    />
                ))}
            </nav>

            <div className="pt-6 border-t border-gray-100 flex flex-col gap-2">
                <SidebarItem
                    icon={Settings}
                    label="Configurações"
                    active={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')}
                />
                <SidebarItem icon={LogOut} label="Sair" />
            </div>
        </aside>
    );
}
