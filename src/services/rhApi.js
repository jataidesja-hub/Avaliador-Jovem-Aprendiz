// Integrado com Google Apps Script - Mesmo endpoint do módulo Jovem Aprendiz
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx0-aS7kq7dq1N2EUYuRQFKbYV2DNBoDtpehT7weGAqRzygkonGaU0qBDn-hhQbGYhQcA/exec';

export const fetchEmployees = async () => {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getEmployees`);
        const data = await response.json();
        return data.map(item => ({
            id: item.id,
            matricula: item.matricula,
            nome: item.nome,
            setor: item.setor,
            empresa: item.empresa,
            salario: parseFloat(item.salario) || 0,
            adicionais: item.adicionais || '',
            admissao: item.admissao,
            demissao: item.demissao || ''
        }));
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
};

export const saveEmployee = async (employee) => {
    try {
        const isUpdate = employee.id && employee.id > 0;
        const payload = {
            action: isUpdate ? 'updateEmployee' : 'addEmployee',
            data: {
                matricula: employee.matricula,
                nome: employee.nome,
                setor: employee.setor,
                empresa: employee.empresa,
                salario: employee.salario,
                adicionais: employee.adicionais,
                admissao: employee.admissao,
                demissao: employee.demissao || ''
            }
        };

        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        return { success: true };
    } catch (error) {
        console.error('Error saving employee:', error);
        throw error;
    }
};

export const deleteEmployee = async (matricula) => {
    try {
        const payload = {
            action: 'deleteEmployee',
            matricula: matricula
        };

        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        return { success: true };
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};

export const fetchRHConfigs = async () => {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getRHConfigs`);
        const data = await response.json();
        return {
            sectors: data.sectors || [],
            companies: data.companies || [],
            additionTypes: data.additionTypes || []
        };
    } catch (error) {
        console.error('Error fetching RH configs:', error);
        return { sectors: [], companies: [], additionTypes: [] };
    }
};

export const saveRHConfigs = async (configs) => {
    try {
        const payload = {
            action: 'saveRHConfigs',
            sectors: configs.sectors,
            companies: configs.companies,
            additionTypes: configs.additionTypes
        };

        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        return { success: true };
    } catch (error) {
        console.error('Error saving RH configs:', error);
        throw error;
    }
};

// ==================== PONTO FACIAL ====================

export const registerClockIn = async (clockData) => {
    try {
        const payload = {
            action: 'registerClockIn',
            data: {
                matricula: clockData.matricula,
                nome: clockData.nome,
                setor: clockData.setor,
                tipo: clockData.tipo || 'Entrada'
            }
        };

        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        return { success: true };
    } catch (error) {
        console.error('Error registering clock in:', error);
        throw error;
    }
};

// Registro facial (pode aceitar embedding ou imagem para processamento em nuvem)
export const registerFace = async (faceData) => {
    try {
        const payload = {
            action: 'registerFace',
            data: {
                matricula: faceData.matricula,
                nome: faceData.nome,
                // Pode enviar embedding (local) ou image (nuvem)
                faceData: faceData.embedding ? JSON.stringify(faceData.embedding) : null,
                image: faceData.image || null
            }
        };

        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        return { success: true };
    } catch (error) {
        console.error('Error registering face:', error);
        throw error;
    }
};

// Nova função para identificar face na nuvem (Google Vision)
export const identifyFaceOnCloud = async (imageBase64) => {
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'identifyFace',
                data: { image: imageBase64 }
            }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error identifying face on cloud:', error);
        return { success: false, error: 'Erro de conexão com o servidor.' };
    }
};

export const fetchAttendanceLogs = async () => {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getAttendanceLogs`);
        const data = await response.json();
        return data.map(item => ({
            matricula: item.matricula,
            nome: item.nome,
            setor: item.setor,
            data: item.data,
            hora: item.hora,
            tipo: item.tipo || 'Entrada'
        }));
    } catch (error) {
        console.error('Error fetching attendance logs:', error);
        return [];
    }
};

export const fetchFaceRegistrations = async () => {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getFaceRegistrations`);
        const data = await response.json();
        return data.map(item => String(item.matricula));
    } catch (error) {
        console.error('Error fetching face registrations:', error);
        return [];
    }
};

// Busca embeddings faciais completos para comparação
export const fetchFaceEmbeddings = async () => {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getFaceEmbeddings`);
        const data = await response.json();
        return data.map(item => ({
            matricula: String(item.matricula),
            nome: item.nome,
            embedding: item.embedding ? JSON.parse(item.embedding) : null
        })).filter(item => item.embedding && Array.isArray(item.embedding));
    } catch (error) {
        console.error('Error fetching face embeddings:', error);
        return [];
    }
};
