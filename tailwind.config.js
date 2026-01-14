/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                agrovale: {
                    green: '#1b5e20', // Verde Escuro
                    orange: '#ff9800', // Laranja suave (ajustado para ser suave mas perceptível)
                    lightGreen: '#4c8c4a',
                    softBg: '#f5f7f5',
                }
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
