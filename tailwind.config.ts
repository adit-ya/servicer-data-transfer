import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: '#10c195',
                    dark: '#10c195',
                },
                secondary: {
                    DEFAULT: '#000',
                    dark: '#fff',
                },
                tertiary: {
                    DEFAULT: 'rgb(36, 61, 52)',
                    dark: '#B5BAD0',
                },
            },
            fontFamily: {
                heading: ['var(--font-sometype-mono)', 'monospace'],
                body: ['var(--font-cabin)', 'sans-serif'],
            },
        },
    },
    darkMode: 'class',
    plugins: [],
} satisfies Config

export default config
