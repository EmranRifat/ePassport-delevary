import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#673AB7',
                    50: '#EDE7F6',
                    100: '#D1C4E9',
                    200: '#B39DDB',
                    300: '#9575CD',
                    400: '#7E57C2',
                    500: '#673AB7',
                    600: '#5E35B1',
                    700: '#512DA8',
                    800: '#4527A0',
                    900: '#311B92',
                },
            },
        },
    },
    plugins: [],
}
export default config
