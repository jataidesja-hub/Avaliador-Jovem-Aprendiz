import React from 'react'
import { Bell, Search, Settings, LogOut } from 'lucide-react'

const Navbar = ({ activeTab, searchQuery, setSearchQuery }) => {
    const titles = {
        dashboard: 'Dashboard Analítico',
        evaluations: 'Quadro de Avaliações',
    }

    return (
        <header className="h-20 bg-white border-b border-gray-100 px-6 md:px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-agro-text to-agro-orange bg-clip-text text-transparent capitalize">
                    {titles[activeTab]}
                </h2>
                <p className="text-sm text-gray-400 font-medium">Visão geral do time</p>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
                <div className="hidden lg:flex items-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 focus-within:ring-2 focus-within:ring-agro-green/10 transition-all">
                    <Search size={18} className="text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Buscar aprendiz..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-48 xl:w-64"
                    />
                </div>

                <div className="flex items-center gap-4 border-l pl-4 md:pl-8 border-gray-100">
                    <div className="hidden sm:block text-right">
                        <h4 className="font-bold text-agro-text leading-none">Taiane</h4>
                        <span className="text-[10px] font-bold text-agro-green bg-agro-lightgreen px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Gente & Gestão
                        </span>
                    </div>
                    <div className="relative group">
                        <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=688&ixlib=rb-4.0.3"
                            alt="Profile"
                            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-agro-green transition-all cursor-pointer shadow-md"
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
