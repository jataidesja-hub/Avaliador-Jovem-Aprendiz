import React from 'react';
import { Users, Building2, TrendingUp, DollarSign } from 'lucide-react';
import StatsCard from '../StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { motion } from 'framer-motion';

export default function RHDashboard({ employees = [] }) {
    const total = employees.length;

    const totalSalaries = employees.reduce((acc, emp) => acc + (parseFloat(emp.salario) || 0), 0);
    const avgSalary = total > 0 ? (totalSalaries / total).toFixed(2) : "0.00";

    const companies = [...new Set(employees.map(e => e.empresa))];
    const dataByCompany = companies.map(company => ({
        name: company,
        count: employees.filter(e => e.empresa === company).length
    })).filter(d => d.count > 0);

    const sectors = [...new Set(employees.map(e => e.setor))];
    const dataBySector = sectors.map(sector => ({
        name: sector,
        count: employees.filter(e => e.setor === sector).length
    })).filter(d => d.count > 0);

    const COLORS = ['#001f3f', '#003366', '#004080', '#0059b3', '#0073e6'];

    return (
        <div className="space-y-10 pb-10">
            <header>
                <h2 className="text-4xl font-black text-falcao-navy tracking-tight">Dashboard de RH</h2>
                <p className="text-gray-400 font-medium mt-1">Visão geral do capital humano da Falcão Engenharia.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard label="Colaboradores" value={total} icon={Users} colorClass="bg-falcao-navy" />
                <StatsCard label="Empresas" value={companies.length} icon={Building2} colorClass="bg-blue-600" />
                <StatsCard label="Média Salarial" value={`R$ ${avgSalary}`} icon={DollarSign} colorClass="bg-green-600" />
                <StatsCard label="Setores Ativos" value={sectors.length} icon={TrendingUp} colorClass="bg-orange-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-10 rounded-[48px]"
                >
                    <h3 className="text-2xl font-black text-gray-800 mb-8">Colaboradores por Empresa</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataByCompany}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {dataByCompany.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-10 rounded-[48px]"
                >
                    <h3 className="text-2xl font-black text-gray-800 mb-8">Distribuição por Setor</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataBySector}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" fill="#001f3f" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
