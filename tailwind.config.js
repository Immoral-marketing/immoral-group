/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./*.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Lexend', 'sans-serif'],
            },
            fontSize: {
                'xl': ['clamp(1.125rem, 1.04vw, 1.25rem)', { lineHeight: '1.75rem' }],
                '2xl': ['clamp(1.25rem, 1.25vw, 1.5rem)', { lineHeight: '2rem' }],
                '3xl': ['clamp(1.5rem, 1.56vw, 1.875rem)', { lineHeight: '2.25rem' }],
                '4xl': ['clamp(1.75rem, 1.875vw, 2.25rem)', { lineHeight: '2.5rem' }],
                '5xl': ['clamp(2.25rem, 2.5vw, 3rem)', { lineHeight: '1' }],
                '6xl': ['clamp(3rem, 3.125vw, 3.75rem)', { lineHeight: '1' }],
            },
        },
    },
    plugins: [],
}
