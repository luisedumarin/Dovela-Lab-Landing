# DOVELA Lab Landing

Proyecto web creado con Astro y Node.js para la landing de DOVELA.

## Descripción

Sitio estático/dinámico con componentes UI en `src/components` y endpoints simples en `server/`.

## Estructura

- `src/` — código fuente (componentes, páginas, scripts cliente)
- `public/` — archivos estáticos (imágenes, `robots.txt`, `CNAME`)
- `server/` — servidor Node.js para API internas (si aplicable)
- `scripts/` — scripts de construcción/optimización de imágenes

## Requisitos

- Node.js 18+ (recomendado)
- npm o pnpm

## Desarrollo

Instala dependencias y arranca el servidor de desarrollo:

```bash
cd /Users/luisedumarin/Desktop/DOVELA/DOV2
npm install
npm run dev
```

## Construir para producción

```bash
npm run build
npm run preview
```

## Despliegue

Configura tu plataforma de hosting (Cloudflare Pages, Vercel, Netlify) y usa `npm run build` antes de publicar. Revisa `astro.config.mjs` para integraciones.

## Contribuciones

Abre un issue o PR si quieres colaborar. Sigue las buenas prácticas de commits y ramas.

## Licencia y contacto

Autor: Luis Eduardo Marín — contacta en tu cuenta de GitHub.
