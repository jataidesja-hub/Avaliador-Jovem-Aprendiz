import React from 'react'
import { LayoutDashboard, Users, UserPlus, Settings, LogOut } from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'evaluations', icon: Users, label: 'Avaliações' },
    ]

    return (
        <div className="w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-agro-green rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">AV</span>
                </div>
                <div className="hidden md:block">
                    <h1 className="font-bold text-agro-text leading-tight">Agrovale</h1>
                    <p className="text-xs text-gray-400">Gente & Gestão</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-agro-green text-white shadow-lg shadow-agro-green/20'
                                : 'text-gray-400 hover:bg-agro-lightgreen hover:text-agro-green'
                            }`}
                    >
                        <item.icon size={22} strokeWidth={2.5} />
                        <span className="hidden md:block font-semibold">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100 space-y-2">
                <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
                    <Settings size={22} />
                    <span className="hidden md:block font-medium">Configurações</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                    <LogOut size={22} />
                    <span className="hidden md:block font-medium">Sair</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
