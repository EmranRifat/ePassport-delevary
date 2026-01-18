import { heroui } from '@heroui/react'
import type { Config } from 'tailwindcss'

const config: Config = {
 
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}", // ✅ required
  ],
  theme: {
    extend: { colors: { /* ... */ } },
  },
  plugins: [heroui()],
   darkMode: "class",
}

export default config


 