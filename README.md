# HoldWise — Netlify Fixed Project (with Tailwind)

This project is ready for Netlify:
- React + Vite + React Router
- Tailwind CSS enabled (styles in `src/styles.css`)
- SPA routing via `public/_redirects` and `netlify.toml`
- Build outputs to `dist/index.html`

**Netlify settings**
- Build command: `npm run build`
- Publish directory: `dist`
- (Optional) Environment variable: `NODE_VERSION = 20`

After pushing to GitHub, use Netlify → Deploys → **Clear cache and deploy site**.
