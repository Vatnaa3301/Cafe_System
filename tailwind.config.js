/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.jsx',
        './resources/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50:  '#fff8f0',
                    100: '#ffecd5',
                    200: '#ffd4a8',
                    300: '#ffb86a',
                    400: '#ff9130',
                    500: '#f97316',
                    600: '#e85d04',
                    700: '#c84b03',
                    800: '#a03a09',
                    900: '#82330b',
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
        },
    },
    plugins: [],
};
