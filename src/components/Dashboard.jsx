import React from 'react';
import { Users, UserCheck, Calendar, TrendingUp, Search } from 'lucide-react';
import StatsCard from './StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

export default function Dashboard({ apprentices = [] }) {
    const total = apprentices.length;
    const female = apprentices.filter(a => a.genero === 'Feminino').length;
    const male = apprentices.filter(a => a.genero === 'Masculino').length;

    const sectors = [...new Set(apprentices.map(a => a.cargo))];
    const dataByRole = sectors.map(sector => ({
        role: sector,
        count: apprentices.filter(a => a.cargo === sector).length,
        color: '#001f3f' // Navy
    })).filter(d => d.count > 0);

    const periodEvaluations = [
        { period: 'Ciclo 1', progress: total > 0 ? 10 : 0, status: total > 0 ? 'Em andamento' : 'Pendente' },
        { period: 'Ciclo 2', progress: 0, status: 'Pendente' },
        { period: 'Ciclo 3', progress: 0, status: 'Pendente' },
        { period: 'Ciclo 4', progress: 0, status: 'Pendente' },
    ];

    return (
        <div className="space-y-10 pb-10">
            <header>
                <h2 className="text-4xl font-black text-falcao-navy tracking-tight">Painel de Controle</h2>
                <p className="text-gray-400 font-medium mt-1">Bem-vindo ao sistema de gestão Falcão Engenharia.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatsCard label="Total Jovens" value={total} icon={Users} colorClass="bg-falcao-navy" />
                <StatsCard label="Feminino" value={female} icon={UserCheck} colorClass="bg-pink-600" />
                <StatsCard label="Masculino" value={male} icon={UserCheck} colorClass="bg-blue-600" />
                <StatsCard label="Média Idade" value={total > 0 ? "19.2" : "0"} icon={Calendar} colorClass="bg-orange-600" />
                <StatsCard label="Média Geral" value={total > 0 ? "8.5" : "0"} icon={TrendingUp} colorClass="bg-green-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Role Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-10 rounded-[48px]"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black text-gray-800">Cargos / Setores</h3>
                        <span className="text-[10px] font-black text-falcao-navy bg-falcao-navy/5 border border-falcao-navy/10 px-3 py-1 rounded-full uppercase tracking-widest">Distribuição</span>
                    </div>
                    {total > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataByRole} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="role" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
                                        {dataByRole.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-gray-300 gap-2">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                <Search size={24} />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-tighter">Nenhum dado disponível</p>
                        </div>
                    )}
                </motion.div>

                {/* Evaluations by Period */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-10 rounded-[48px]"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black text-gray-800">Progresso Anual</h3>
                        <span className="text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full uppercase tracking-widest">Ciclos</span>
                    </div>
                    <div className="space-y-8">
                        {periodEvaluations.map((item, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-700">{item.period}</span>
                                    <span className="text-gray-400 font-black">{item.progress}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.progress}%` }}
                                        transition={{ duration: 1, delay: idx * 0.2 }}
                                        className={`h-full rounded-full ${item.progress === 100 ? 'bg-green-500' :
                                            item.progress > 0 ? 'bg-falcao-navy' :
                                                'bg-gray-200'
                                            }`}
                                    />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-wider ${item.status === 'Concluído' ? 'text-green-500' :
                                    item.status === 'Em andamento' ? 'text-falcao-navy' :
                                        'text-gray-300'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
