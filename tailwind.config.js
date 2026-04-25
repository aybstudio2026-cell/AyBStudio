/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nueva Paleta Studio (Unisex & Flat)
        studio: {
          bg: '#F8FAFC',        // Slate-50 (Fondo limpio)
          surface: '#FFFFFF',   // Blanco (Cards y contenedores)
          primary: '#0D9488',   // Teal-600 (Botones y acciones principales)
          secondary: '#64748B', // Slate-500 (Botones secundarios e iconos)
          accent: '#F59E0B',    // Amber-500 (Badges de oferta/nuevo)
          border: '#E2E8F0',    // Slate-200 (Bordes finos estilo flat)
          text: {
            title: '#0F172A',   // Slate-900 (Títulos de alta legibilidad)
            body: '#475569',    // Slate-600 (Cuerpo de texto)
          }
        },
        // Mantengo tus colores antiguos por si tienes componentes que aún los usan,
        // pero te sugiero ir migrando a la nomenclatura 'studio-'
        'soft-snow': '#F8FAFC',
        'panda-black': '#1E293B',
      },
      borderRadius: {
        'kawaii': '1.5rem',     // Mantengo tu radio muy redondeado
        'studio': '0.625rem',   // Una opción más sobria y moderna (10px)
      },
      boxShadow: {
        // En diseño flat usamos sombras muy sutiles o ninguna
        'flat': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}