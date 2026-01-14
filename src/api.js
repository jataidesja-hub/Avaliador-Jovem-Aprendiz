const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx0-aS7kq7dq1N2EUYuRQFKbYV2DNBoDtpehT7weGAqRzygkonGaU0qBDn-hhQbGYhQcA/exec'

export const fetchAprendizes = async () => {
    try {
        const response = await fetch(APPS_SCRIPT_URL)
        return await response.json()
    } catch (error) {
        console.error('Erro ao buscar aprendizes:', error)
        return []
    }
}

export const saveAprendiz = async (data) => {
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'add', ...data })
        })
        return await response.json()
    } catch (error) {
        console.error('Erro ao salvar aprendiz:', error)
        return { status: 'error' }
    }
}
