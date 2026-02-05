// TODO: Integrar com Google Apps Script quando Code.gs for atualizado
export const fetchEmployees = async () => {
    // Simulação de dados
    const mockData = [
        { id: 1, nome: 'João Silva', setor: 'Administrativo', empresa: 'Falcão Engenharia', salario: 3500, adicionais: 500, descontos: 200, admissao: '2023-01-10', demissao: '' },
        { id: 2, nome: 'Maria Oliveira', setor: 'RH', empresa: 'Falcão Engenharia', salario: 4200, adicionais: 300, descontos: 150, admissao: '2022-05-15', demissao: '' },
        { id: 3, nome: 'Pedro Santos', setor: 'Operacional', empresa: 'Falcão Engenharia', salario: 2800, adicionais: 400, descontos: 100, admissao: '2024-02-01', demissao: '' }
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
