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
            "@app": "/src/main/javascript/app",
            "@componente": "/src/main/javascript/componente",
            "@dominio": "/src/main/javascript/dominio",
            "@pagina": "/src/main/javascript/pagina",
            "@assets": "/src/main/javascript/assets",
        },
    },
});
