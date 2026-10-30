# Mapa del tesoro ✨
React + Phaser + Vite. Web estática, sin backend.

    npm install
    npm run dev      # abre la dirección "Network" en el móvil (misma wifi)
    npm run build    # genera dist/ para publicar (Netlify Drop, Vercel, GitHub Pages)

Todo lo personal está en `src/contenido.js`. 

- `src/App.jsx` fases y progreso · `src/Mapa.jsx` mapa SVG · `src/Tesoro.jsx` cofre y carta
- `src/minijuegos/` un archivo por minijuego; se registran en `index.js`. `Atrapa.jsx` es el de Phaser.

## Probar
- El progreso se guarda en el móvil. Para empezar de cero: añade `?reset` a la dirección (ej. `tuweb.netlify.app/?reset`).
