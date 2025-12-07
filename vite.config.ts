import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig({
    plugins: [
        react(), 
        tailwindcss(),
        removeConsole()
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
