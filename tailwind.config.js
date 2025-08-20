/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#1E3A5F',
        accent: '#00D9FF',
        success: '#00C853',
        warning: '#FFB300',
        error: '#FF3D00',
        info: '#2196F3'
      },
      fontFamily: {
        display: ['Bebas Neue', 'cursive'],
        body: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF6B35 0%, #FF3D00 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #1E3A5F 0%, #0D1B2A 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00D9FF 0%, #0099CC 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}