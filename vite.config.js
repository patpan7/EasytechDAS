import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ⚠️ Αν ο Spring Boot τρέχει στο http://localhost:8080 και τα endpoints είναι π.χ. /api/customers
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',   // Επιτρέπει πρόσβαση από άλλες συσκευές στο LAN
    port: 5173,        // Default Vite port (προαιρετικό)
  },
})
