import React from 'react';
import { Users, UserCheck, UserMinus, Calendar, TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const dataByRole = [
    { role: 'Adm', count: 12, color: '#1b5e20' },
    { role: 'Operacional', count: 25, color: '#4c8c4a' },
    { role: 'Manutenção', count: 18, color: '#ff9800' },
    { role: 'Logística', count: 8, color: '#2e7d32' },
];

const periodEvaluations = [
    { period: 'Ciclo 1', progress: 100, status: 'Concluído' },
    { period: 'Ciclo 2', progress: 75, status: 'Em andamento' },
    { period: 'Ciclo 3', progress: 20, status: 'Pendente' },
    { period: 'Ciclo 4', progress: 0, status: 'Agendado' },
];

export default function Dashboard() {
    return (
        <div className="space-y-8 pb-10">
            <header>
                <h2 className="text-3xl font-bold text-gray-800">Visão Geral</h2>
                <p className="text-gray-500">Bem-vindo ao sistema de avaliação do Jovem Aprendiz Agrovale.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatsCard label="Total Jovens" value="63" icon={Users} colorClass="bg-blue-500" trend={5} />
                <StatsCard label="Feminino" value="28" icon={UserCheck} colorClass="bg-pink-500" trend={2} />
                <StatsCard label="Masculino" value="35" icon={UserCheck} colorClass="bg-cyan-500" trend={3} />
                <StatsCard label="Média Idade" value="19.4" icon={Calendar} colorClass="bg-orange-500" />
                <StatsCard label="Média Geral" value="8.7" icon={TrendingUp} colorClass="bg-agrovale-green" trend={0.5} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Role Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-8 rounded-3xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Distribuição por Cargo</h3>
                        <span className="text-xs font-semibold text-agrovale-green bg-agrovale-green/10 px-3 py-1 rounded-full uppercase">Setores</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataByRole} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="role" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                                    {dataByRole.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Evaluations by Period */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-8 rounded-3xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Avaliações por Período</h3>
                        <span className="text-xs font-semibold text-orange-500 bg-orange-100 px-3 py-1 rounded-full uppercase">Ciclos</span>
                    </div>
                    <div className="space-y-6">
                        {periodEvaluations.map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-gray-700">{item.period}</span>
                                    <span className="text-gray-500">{item.progress}%</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.progress}%` }}
                                        transition={{ duration: 1, delay: idx * 0.2 }}
                                        className={`h-full rounded-full ${item.progress === 100 ? 'bg-agrovale-green' :
                                                item.progress > 50 ? 'bg-agrovale-orange' :
                                                    'bg-orange-300'
                                            }`}
                                    />
                                </div>
                                <span className={`text-[10px] font-bold uppercase ${item.status === 'Concluído' ? 'text-agrovale-green' :
                                        item.status === 'Em andamento' ? 'text-agrovale-orange' :
                                            'text-gray-400'
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
