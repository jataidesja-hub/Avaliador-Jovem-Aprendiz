import React from 'react';
import { LayoutDashboard, ClipboardList, UserPlus, Settings, LogOut, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <motion.button
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 ${active
            ? 'bg-falcao-navy text-white shadow-xl shadow-falcao-navy/20'
            : 'text-gray-400 hover:bg-falcao-navy/5 hover:text-falcao-navy'
            }`}
    >
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
        <span className={`text-sm tracking-tight ${active ? 'font-black' : 'font-bold'}`} translate="no">{label}</span>
    </motion.button>
);

export default function Sidebar({ activeTab, setActiveTab, onBackToMenu, module }) {
    const menuItems = [
        { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
        { id: 'evaluations', label: module === 'rh-gestao' ? 'Colaboradores' : 'Avaliações', icon: module === 'rh-gestao' ? UserPlus : ClipboardList },
        { id: 'register', label: 'Cadastro', icon: UserPlus },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100/50 p-8 flex flex-col z-50">
            <div className="flex items-center gap-3 mb-12 px-1">
                <div className="w-11 h-11 bg-falcao-navy rounded-2xl flex items-center justify-center text-white shadow-lg shadow-falcao-navy/20">
                    <Shield size={22} fill="currentColor" />
                </div>
                <div>
                    <h1 className="text-[12px] font-black text-falcao-navy leading-tight uppercase tracking-widest">Falcão</h1>
                    <p className="text-[10px] text-gray-300 font-bold tracking-[0.2em] uppercase">Engenharia</p>
                </div>
            </div>

            <nav className="flex-1 space-y-3">
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

            <div className="pt-8 border-t border-gray-50 flex flex-col gap-2">
                <SidebarItem
                    icon={Settings}
                    label="Configurações"
                    active={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')}
                />
                <SidebarItem
                    icon={ArrowLeft}
                    label="Voltar ao Menu"
                    onClick={onBackToMenu}
                />
                <SidebarItem icon={LogOut} label="Sair" />
            </div>

            <div className="mt-8 p-4 bg-falcao-soft-bg rounded-2xl border border-gray-100/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter text-center">v2.1.0 • Falcão App</p>
            </div>
        </aside>
    );
}
