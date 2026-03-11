/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: '#DFFF00',
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
