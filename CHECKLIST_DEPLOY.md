# Deploy GitHub Pages

1. `cd webapp/kairos2.0/src/main/javascript && npm run build`
2. `cp -r webapp/kairos2.0/src/main/javascript/dist ./dist`
3. Incluir fallback SPA: `dist/404.html` e `dist/_redirects`
4. Commit `dist` + fallback e enviar para branch publicada
