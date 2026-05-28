Despliegue en Cloudflare Pages

Instrucciones para desplegar este sitio estático en Cloudflare Pages.

Pasos rápidos:

1. Asegúrate de que el repo está en GitHub (o GitLab). Cloudflare Pages se conecta al repo para desplegar automáticamente.
2. En Cloudflare → Pages → Create a project, conecta tu repositorio y selecciona la rama (p. ej. `main`).
3. Configura los valores de build:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Inicia la primera build. Cuando termine, tu sitio estará disponible en `*.pages.dev`.

Formulario y backend:

- Este proyecto ya está configurado para usar Formspree: los formularios incluyen `data-endpoint="https://formspree.io/f/xaqklajq"` en `src/components/Hero.astro` y `src/components/CTA.astro`.
- Como Cloudflare Pages sirve el sitio como estático, no necesitas desplegar `server/index.js` para el envío de formularios.

Dominio personalizado:

1. En el panel de Pages, abre tu proyecto → Domains → Add custom domain.
2. Añade `dovelalab.com.mx` o `www.dovelalab.com.mx` según quieras.
3. Cloudflare te mostrará los registros DNS que debes crear. Si tu DNS ya está gestionado por Cloudflare, normalmente el proceso es automático.

GitHub Actions (opcional):

Si prefieres desplegar desde GitHub Actions (por ejemplo para invocar despliegues manuales), añade el workflow `./github/workflows/deploy-pages.yml` con la acción oficial de Cloudflare Pages. Debes configurar secrets en GitHub: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_PROJECT_NAME`.

Problemas comunes:

- Revisar que `dist/` se genere correctamente con `npm run build`.
- Formspree puede tener límite de envíos en plan gratuito; revisa el dashboard de Formspree para ver envíos y ajustes del destinatario.
- Si usas funciones de servidor (emails, webhooks) más avanzadas, considera desplegar una API separada (Render, Railway) y apuntar los formularios a esa URL.

Comandos útiles localmente:

```bash
npm install
npm run build
npm run preview
```

Si quieres, puedo crear el workflow de GitHub Actions y un README más detallado para la configuración de dominio. Dime si lo genero ahora.
