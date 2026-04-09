/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rgb-glow': 'rgb-glow 3s linear infinite',
        'bokeh-float': 'bokeh-float 20s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
        },
        'rgb-glow': {
          '0%': { 'text-shadow': '0 0 5px #ff0000, 0 0 10px #ff0000' },
          '20%': { 'text-shadow': '0 0 5px #ff8800, 0 0 10px #ff8800' },
          '40%': { 'text-shadow': '0 0 5px #ffff00, 0 0 10px #ffff00' },
          '60%': { 'text-shadow': '0 0 5px #00ff00, 0 0 10px #00ff00' },
          '80%': { 'text-shadow': '0 0 5px #0000ff, 0 0 10px #0000ff' },
          '100%': { 'text-shadow': '0 0 5px #ff0000, 0 0 10px #ff0000' },
        },
        'bokeh-float': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, 15px)' },
          '50%': { transform: 'translate(-15px, 10px)' },
          '75%': { transform: 'translate(15px, -15px)' },
        }
      }
    },
  },
  plugins: [],
}
