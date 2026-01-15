const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx0-aS7kq7dq1N2EUYuRQFKbYV2DNBoDtpehT7weGAqRzygkonGaU0qBDn-hhQbGYhQcA/exec';

export const fetchApprentices = async () => {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getApprentices`);
        const data = await response.json();
        return data.map(item => ({
            id: item.Matrícula,
            matricula: item.Matrícula,
            nome: item.Nome,
            cargo: item.Cargo,
            supervisor: item.Supervisor,
            admissao: item.Admissão,
            nascimento: item.Nascimento,
            sexo: item.Sexo,
            foto: item.Foto || null,
            column: item.Status || 'not_evaluated',
            cycle: parseInt(item.Ciclo) || 1,
            lastScore: parseFloat(item.Nota) || 0
        }));
    } catch (error) {
        console.error('Error fetching apprentices:', error);
        return [];
    }
};

export const saveApprentice = async (apprentice) => {
    try {
        const payload = {
            action: 'addApprentice',
            data: {
                matricula: apprentice.matricula,
                nome: apprentice.nome,
                cargo: apprentice.cargo,
                supervisor: apprentice.supervisor,
                nascimento: apprentice.nascimento,
                admissao: apprentice.admissao,
                termino: apprentice.termino,
                sexo: apprentice.genero,
                foto: apprentice.foto,
                status: 'not_evaluated'
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
        console.error('Error saving apprentice:', error);
        throw error;
    }
};

export const updateApprenticeEvaluation = async (evaluationData) => {
    try {
        const payload = {
            action: 'saveEvaluation',
            data: evaluationData
        };

        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating evaluation:', error);
        throw error;
    }
};
