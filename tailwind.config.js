/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: '#6c5ce7',
                primaryLight: '#a29bfe',
                primaryDark: '#4834d4',
                secondary: '#fd79a8',
                secondaryLight: '#fab1c9',
                secondaryDark: '#e84393',
                accent1: '#ffeaa7',
                accent2: '#55efc4',
                accent3: '#ff7675',
                backgroundLight: '#f8fafc',
                backgroundDark: '#1a1a2e',
                cardLight: '#ffffff',
                cardDark: '#16213e',
                textPrimary: '#2d3748',
                textSecondary: '#718096',
                textLight: '#a0aec0',
                textWhite: '#ffffff',
                textDark: '#1a202c',
            }
        },
    },
    plugins: [],
}
