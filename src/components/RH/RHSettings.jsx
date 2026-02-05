import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Building2, Landmark, DollarSign, Percent, Shield } from 'lucide-react';

const ConfigSection = ({ title, items, onAdd, onRemove, onUpdate, icon: Icon, placeholder, isAddition = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [amountValue, setAmountValue] = useState('');
    const [editingIdx, setEditingIdx] = useState(null);

    const handleAdd = () => {
        if (inputValue.trim()) {
            if (isAddition) {
                const newItem = { name: inputValue.trim(), value: parseFloat(amountValue || 0) };
                if (editingIdx !== null) {
                    onUpdate(editingIdx, newItem);
                } else {
                    onAdd(newItem);
                }
                setAmountValue('');
            } else {
                if (editingIdx !== null) {
                    onUpdate(editingIdx, inputValue.trim());
                } else {
                    onAdd(inputValue.trim());
                }
            }
            setInputValue('');
            setEditingIdx(null);
        }
    };

    const startEdit = (item, idx) => {
        setEditingIdx(idx);
        if (isAddition) {
            setInputValue(item.name);
            setAmountValue(item.value);
        } else {
            setInputValue(item);
        }
    };

    const cancelEdit = () => {
        setEditingIdx(null);
        setInputValue('');
        setAmountValue('');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-falcao-navy rounded-xl text-white">
                    <Icon size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>

            <div className="bg-white/40 rounded-[32px] border border-white/60 p-6 space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        placeholder={placeholder}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-falcao-navy/10"
                    />
                    {isAddition && (
                        <input
                            type="number"
                            value={amountValue}
                            onChange={(e) => setAmountValue(e.target.value)}
                            placeholder="R$ 0,00"
                            className="w-24 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-falcao-navy/10 font-mono"
                        />
                    )}
                    {editingIdx !== null ? (
                        <>
                            <button onClick={handleAdd} className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition-colors">
                                <Check size={20} />
                            </button>
                            <button onClick={cancelEdit} className="bg-gray-400 text-white p-2 rounded-xl hover:bg-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </>
                    ) : (
                        <button onClick={handleAdd} className="bg-falcao-navy text-white p-2 rounded-xl hover:bg-black transition-colors">
                            <Plus size={20} />
                        </button>
                    )}
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {items.map((item, idx) => {
                        const name = typeof item === 'object' ? item.name : item;
                        const value = typeof item === 'object' ? item.value : null;

                        return (
                            <div key={idx} className={`flex justify-between items-center group p-3 rounded-xl border transition-all ${editingIdx === idx ? 'bg-falcao-navy/5 border-falcao-navy/30' : 'bg-white/60 border-transparent hover:border-falcao-navy/20'}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">{name}</span>
                                    {value !== null && (
                                        <span className="bg-falcao-navy/10 text-falcao-navy text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            R$ {parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => startEdit(item, idx)} className="text-blue-400 opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-50 rounded-lg transition-all">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => onRemove(item)} className="text-red-400 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default function RHSettings({ configs, onUpdateConfigs }) {
    const handleAdd = (key, value) => {
        const exists = key === 'additionTypes'
            ? configs[key].some(i => i.name === value.name)
            : configs[key].includes(value);

        if (!exists) {
            onUpdateConfigs({ ...configs, [key]: [...configs[key], value] });
        }
    };

    const handleRemove = (key, value) => {
        const newItems = key === 'additionTypes'
            ? configs[key].filter(i => (typeof i === 'object' ? i.name !== value.name : i !== value))
            : configs[key].filter(i => i !== value);
        onUpdateConfigs({ ...configs, [key]: newItems });
    };

    const handleUpdate = (key, idx, newValue) => {
        const newItems = [...configs[key]];
        newItems[idx] = newValue;
        onUpdateConfigs({ ...configs, [key]: newItems });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="glass p-12 rounded-[48px] max-w-6xl mx-auto"
        >
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-4xl font-black text-falcao-navy mb-2 tracking-tighter uppercase">Configurações da Empresa</h2>
                <p className="text-gray-400 font-medium">Gerencie as listas de parâmetros para o módulo de RH.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                <ConfigSection
                    title="Empresas"
                    items={configs.companies}
                    onAdd={(val) => handleAdd('companies', val)}
                    onRemove={(val) => handleRemove('companies', val)}
                    onUpdate={(idx, val) => handleUpdate('companies', idx, val)}
                    icon={Landmark}
                    placeholder="Nova empresa..."
                />
                <ConfigSection
                    title="Setores"
                    items={configs.sectors}
                    onAdd={(val) => handleAdd('sectors', val)}
                    onRemove={(val) => handleRemove('sectors', val)}
                    onUpdate={(idx, val) => handleUpdate('sectors', idx, val)}
                    icon={Shield}
                    placeholder="Novo setor..."
                />
                <ConfigSection
                    title="Tipos de Adicionais"
                    items={configs.additionTypes}
                    onAdd={(val) => handleAdd('additionTypes', val)}
                    onRemove={(val) => handleRemove('additionTypes', val)}
                    onUpdate={(idx, val) => handleUpdate('additionTypes', idx, val)}
                    icon={DollarSign}
                    placeholder="Novo adicional..."
                    isAddition={true}
                />
            </div>
        </motion.div>
    );
}
