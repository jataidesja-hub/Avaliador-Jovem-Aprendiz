// TODO: Integrar com Google Apps Script quando Code.gs for atualizado
export const fetchEmployees = async () => {
    // Simulação de dados
    const mockData = [
        { id: 1, matricula: '1010', nome: 'João Silva', setor: 'Administrativo', empresa: 'Falcão Engenharia', salario: 3500, adicionais: 'Periculosidade', admissao: '2023-01-10', demissao: '' },
        { id: 2, matricula: '1020', nome: 'Maria Oliveira', setor: 'RH', empresa: 'Falcão Engenharia', salario: 4200, adicionais: 'Gratificação', admissao: '2022-05-15', demissao: '' },
        { id: 3, matricula: '1030', nome: 'Pedro Santos', setor: 'Operacional', empresa: 'Falcão Engenharia', salario: 2800, adicionais: 'Hora Extra', admissao: '2024-02-01', demissao: '' }
    ];
    return mockData;
};

export const saveEmployee = async (employee) => {
    console.log('Salvando funcionário (Mock):', employee);
    return { success: true };
};

export const deleteEmployee = async (id) => {
    console.log('Deletando funcionário (Mock):', id);
    return { success: true };
};

export const fetchRHConfigs = async () => {
    return {
        sectors: ['Administrativo', 'RH', 'Operacional', 'Vendas', 'T.I'],
        companies: ['Falcão Engenharia', 'Falcão Logística', 'Falcão Serviços'],
        additionTypes: ['Periculosidade', 'Insalubridade', 'Gratificação', 'Hora Extra']
    };
};

export const saveRHConfigs = async (configs) => {
    console.log('Salvando configurações de RH (Mock):', configs);
    return { success: true };
};
