/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Dubai', 'sans-serif'], // الخط الأساسي العربي
                serif: ['Playfair Display', 'serif'], // الخط الثانوي الإنجليزي
            },
            colors: {
                brand: {
                    black: '#0a0a0a', // الأسود الداكن للخلفية
                    dark: '#171717',
                    gray: '#262626',
                    light: '#e5e5e5',
                    white: '#ffffff',
                    lime: '#ccff00', // اللون الأخضر الليموني المميز للهوية
                    accent: '#ccff00'
                }
            },
        },
        animation: {
            'spin-slow': 'spin 15s linear infinite', // إضافة حركة الدوران لـ Tailwind
        }
    },
    plugins: [],
}
