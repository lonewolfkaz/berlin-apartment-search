import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  base: "/berlin-apartment-search/",
  plugins: [react(), tailwindcss()],
  server: { port: 5173 }
})
