import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        watch: {
            usePolling: true,
            interval: 1000,
        },
    },
    resolve: {
        alias: {
            "@app": "/src/app",
            "@componente": "/src/componente",
            "@dominio": "/src/dominio",
            "@pagina": "/src/pagina",
            "@assets": "/src/assets",
        },
    },
});
