import React from 'react'
import {
    Users,
    UserCircle2,
    GraduationCap,
    Target,
    TrendingUp,
    Filter,
    LayoutGrid,
    Plus
} from 'lucide-react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
    <div className="card flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-agro-text">{value}</h3>
            </div>
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-transform hover:scale-110 cursor-default`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} strokeWidth={2.5} />
            </div>
        </div>
        <p className="text-xs text-gray-400 font-medium">{subtext}</p>
    </div>
)

const Dashboard = ({ aprendizes = [] }) => {
    const total = aprendizes.length;
    const feminino = aprendizes.filter(a => a.Sexo === 'Feminino').length;
    const masculino = aprendizes.filter(a => a.Sexo === 'Masculino').length;

    // Agrupar por cargo
    const cargosMap = aprendizes.reduce((acc, curr) => {
        acc[curr.Cargo] = (acc[curr.Cargo] || 0) + 1;
        return acc;
    }, {});

    const barData = {
        labels: Object.keys(cargosMap),
        datasets: [
            {
                label: 'Aprendizes',
                data: Object.values(cargosMap),
                backgroundColor: '#1b5e20',
                borderRadius: 8,
            },
        ],
    }

    const doughnutData = {
        labels: ['Concluídos', 'Em andamento', 'Pendentes'],
        datasets: [
            {
                data: [75, 20, 5],
                backgroundColor: ['#1b5e20', '#e67e22', '#cbd5e1'],
                borderWidth: 0,
            },
        ],
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-400 hover:text-agro-green transition-all shadow-sm">
                        <Filter size={16} /> Filtros
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-400 hover:text-agro-green transition-all shadow-sm">
                        Cargo
                    </button>
                </div>
                <div className="flex gap-2">
                    <span className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                        ⭐ {total} Aprendizes
                    </span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-400 hover:text-agro-green transition-all shadow-sm">
                        <LayoutGrid size={16} /> Editar Layout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard label="Total" value={total} subtext="100% da Time" icon={Users} color="bg-blue-500" />
                <StatCard label="Feminino" value={feminino} subtext={`${total > 0 ? Math.round((feminino / total) * 100) : 0}% da Time`} icon={UserCircle2} color="bg-purple-500" />
                <StatCard label="Masculino" value={masculino} subtext={`${total > 0 ? Math.round((masculino / total) * 100) : 0}% da Time`} icon={UserCircle2} color="bg-cyan-500" />
                <StatCard label="Idade Média" value="18 anos" subtext="18 (min) - 18 (max)" icon={GraduationCap} color="bg-indigo-500" />
                <StatCard label="Média Geral" value="2.23" subtext="≥ 2.0 Regular" icon={Target} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card">
                    <h4 className="font-bold text-agro-text mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-agro-green" /> Distribuição por Cargo
                    </h4>
                    <div className="h-64">
                        {total > 0 ? (
                            <Bar
                                data={barData}
                                options={{
                                    maintainAspectRatio: false,
                                    indexAxis: 'y',
                                    plugins: { legend: { display: false } }
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-300 font-bold">Sem dados para exibir</div>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h4 className="font-bold text-agro-text mb-6">Status das Avaliações</h4>
                    <div className="h-64 relative">
                        <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '75%' }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-agro-green">75%</span>
                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Sucesso</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-agro-text">Avaliações por Período</h4>
                    <span className="text-xs text-gray-400 font-medium">1 / {total - 1 > 0 ? total - 1 : 0} pendentes</span>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3, 4].map((p) => (
                        <div key={p} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-agro-text">{p}º Período</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${p === 1 ? 'bg-agro-lightgreen text-agro-green' : 'bg-orange-50 text-orange-600'}`}>
                                        {p === 1 ? 'Liberado' : 'Bloqueado'}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 font-bold">1 / {total}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-agro-orange rounded-full" style={{ width: p === 1 ? '70%' : '0%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default Dashboard
