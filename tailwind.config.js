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
                    50:  '#fdf3ed',
                    100: '#fae0cf',
                    200: '#f5c0a0',
                    300: '#ee9b6c',
                    400: '#d97a4d',
                    500: '#C96A3D',
                    600: '#B85C30',
                    700: '#964a26',
                    800: '#7a3b1f',
                    900: '#633019',
                },
            },
            fontFamily: {
                sodo: ['Inter', 'ui-sans-serif', 'system-ui'],
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
        },
    },
    plugins: [],
};
