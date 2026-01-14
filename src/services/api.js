const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx0-aS7kq7dq1N2EUYuRQFKbYV2DNBoDtpehT7weGAqRzygkonGaU0qBDn-hhQbGYhQcA/exec';

export const fetchApprentices = async () => {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getApprentices`);
        const data = await response.json();
        return data.map(item => ({
            id: item.Matrícula,
            nome: item.Nome,
            cargo: item.Cargo,
            supervisor: item.Supervisor,
            inicio: item.Admissão,
            termino: item.Término || '', // Handle if missing
            genero: item.Sexo,
            column: item.Status || 'not_evaluated',
            cycle: 1 // Default cycle for now
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
                admissao: apprentice.inicio,
                termino: apprentice.termino,
                sexo: apprentice.genero,
                status: 'not_evaluated'
            }
        };

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script often requires no-cors if not handling CORS explicitly
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // With no-cors, we won't get a proper response body, but the data should be sent
        return { success: true };
    } catch (error) {
        console.error('Error saving apprentice:', error);
        throw error;
    }
};
