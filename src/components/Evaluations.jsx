import React, { useState } from 'react'
import { Plus, Search, Filter, Info, MoreHorizontal } from 'lucide-react'
import RegistrationModal from './RegistrationModal'

const Column = ({ title, count, color, children, description }) => (
    <div className="flex flex-col gap-4 min-w-[300px] flex-1">
        <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
                <h3 className={`font-black text-lg ${color}`}>{title}</h3>
                <span className="bg-gray-100 text-gray-500 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full">
                    {count}
                </span>
            </div>
            <button className="text-gray-300 hover:text-gray-500"><Info size={16} /></button>
        </div>
        {description && <p className="text-[10px] text-gray-400 px-2 leading-relaxed">{description}</p>}
        <div className="flex flex-col gap-3 h-full rounded-3xl">
            {children}
        </div>
    </div>
)

const ApprenticeCard = ({ name, role, photo, evaluation }) => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-agro-green/30 transition-all group cursor-pointer">
        <div className="flex items-center gap-3 mb-4">
            <img src={photo} alt={name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-50" />
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-agro-text text-sm truncate uppercase tracking-tight">{name}</h4>
                <p className="text-[10px] text-gray-400 font-bold truncate uppercase">{role}</p>
            </div>
            <button className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all"><MoreHorizontal size={16} /></button>
        </div>
        <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((n) => (
                <div
                    key={n}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${evaluation >= n ? 'bg-agro-green text-white shadow-sm' : 'bg-gray-50 text-gray-300'
                        }`}
                >
                    {n}
                </div>
            ))}
        </div>
    </div>
)

const Evaluations = ({ aprendizes = [], searchQuery }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activePeriod, setActivePeriod] = useState('Todos')

    // Mapeamento dos campos da planilha (normalizando nomes de colunas)
    const normalizedApprentices = aprendizes.map(a => ({
        id: a.Matrícula || a['Matrícula'] || Math.random(),
        name: a.Nome || a['Nome'] || 'Sem Nome',
        role: a.Cargo || a['Cargo'] || 'Sem Cargo',
        photo: a.Foto || a['Foto'] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
        status: a.Status || a['Status'] || 'nao-avaliado',
        evaluation: 0
    }))

    const filteredApprentices = normalizedApprentices.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const columns = {
        'nao-avaliado': { title: 'Não Avaliado', count: 0, color: 'text-agro-green', desc: 'Aprendizes que ainda não iniciaram o ciclo.' },
        'desligar': { title: 'Desligar', count: 0, color: 'text-red-500', desc: 'Encerramento do vínculo.' },
        'recuperar': { title: 'Recuperar', count: 0, color: 'text-orange-500', desc: 'Ações de correção.' },
        'apto': { title: 'Apto para Contratação', count: 0, color: 'text-emerald-500', desc: 'Possibilidade de contratação.' }
    }

    // Contagem real baseada nos dados
    normalizedApprentices.forEach(a => {
        if (columns[a.status]) columns[a.status].count++;
    })

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex-1 min-w-[200px] lg:max-w-md relative group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-agro-green transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar aprendiz..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-agro-green/10 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm flex gap-1">
                        {['Todos', 'P1', 'P2', 'P3', 'P4'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setActivePeriod(p)}
                                className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${activePeriod === p ? 'bg-agro-green text-white shadow-lg shadow-agro-green/20' : 'text-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-3 px-6 py-3 bg-agro-green text-white rounded-2xl font-black shadow-lg shadow-agro-green/20 hover:scale-105 active:scale-95 transition-all text-sm group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Adicionar
                    </button>
                </div>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
                {Object.entries(columns).map(([key, col]) => (
                    <Column
                        key={key}
                        title={col.title}
                        count={col.count}
                        color={col.color}
                        description={col.desc}
                    >
                        {filteredApprentices.filter(a => a.status === key).length > 0 ? (
                            filteredApprentices.filter(a => a.status === key).map(a => (
                                <ApprenticeCard key={a.id} {...a} />
                            ))
                        ) : (
                            <div className="h-64 border-2 border-dashed border-gray-50 rounded-3xl flex flex-col items-center justify-center bg-gray-50/20 text-gray-300 font-bold text-xs gap-3">
                                Nenhuma avaliação
                            </div>
                        )}
                    </Column>
                ))}
            </div>

            <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}


export default Evaluations
