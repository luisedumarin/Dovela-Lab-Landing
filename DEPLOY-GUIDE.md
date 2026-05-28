## Guía Rápida: Subir a GitHub y Desplegar en Vercel

Esta guía resume los pasos y comandos útiles para subir el proyecto a GitHub, desplegarlo en Vercel y mantener tus cuentas/tokens en orden. Mantén tus credenciales en un gestor de contraseñas; NUNCA las pongas en el repositorio.

**Preparación local**

- Asegúrate de tener Git y Node instalados.
- Configura tu identidad Git si aún no lo hiciste:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@correo.com"
```

**Subir al repositorio remoto (GitHub)**

- Inicializar (si el repo no existe localmente):

```bash
git init
git add -A
git commit -m "Inicial: proyecto"
```

- Crear repo remoto con `gh` (opcional si usas la web):

```bash
gh auth login           # autentica con GitHub CLI
gh repo create NOMBRE_REPO --private --source=. --remote=origin --confirm
```

- Pasos habituales para actualizar remoto:

```bash
git add -A
git commit -m "Describe el cambio"
git push origin main
```

Comprobar estado y remotos:

```bash
git status
git remote -v
gh auth status
```

**Desplegar en Vercel (CLI)**

- Recomendado: tener el `VERCEL_TOKEN` en tu entorno (o usar `vercel login`).
- Comando de deploy (producción):

```bash
export VERCEL_TOKEN="<tu_token>"   # mejor usar .env/local o gestor seguro
npx vercel --prod --yes --debug
```

- Notas importantes para proyectos Astro + Tailwind:
  - Asegura que Tailwind sea procesado en build. Si Vercel no instala `devDependencies` por defecto, añade en `package.json`:

```json
"scripts": {
  "vercel-build": "npm install --include=dev && npm run build",
  "build": "astro build"
}
```

  - Importa tu CSS global en `src/pages/index.astro` (o en el entrypoint apropiado) para que Astro incluya las clases generadas por Tailwind.
  - Sirve scripts cliente desde `public/` para que en producción la ruta sea `/scripts/tu-script.js`.

**Comprobaciones post-deploy**

- Abrir la URL de producción (ej. `https://tudominio.vercel.app` o tu alias custom).
- Revisar consola y Network en DevTools para 404s de `/src/...` (si aparecen, mover archivos a `public/` o corregir rutas).

**Buenas prácticas con tokens y cuentas**

- No publiques `VERCEL_TOKEN`, claves o contraseñas en el repo.
- Usa un gestor de contraseñas (1Password, Bitwarden, etc.) y registra:
  - usuario GitHub
  - usuario Vercel (email)
  - `VERCEL_TOKEN` si lo usas para CI/CLI
- Si un token se filtró, revócalo inmediatamente desde el panel de Vercel y crea uno nuevo.
- Para GitHub, usa claves SSH o tokens personales (PAT) con permisos mínimos.

**Comandos útiles de diagnóstico**

```bash
npx vercel --debug            # deploy con logs detallados
git log --oneline -n 5       # últimos commits
git show --name-only HEAD    # archivos cambiados en el último commit
curl -I https://tudominio.vercel.app  # comprobar cabeceras / 200
```

**Recordatorios rápidos**

- Antes de deploy: `npm run build` localmente para validar.
- Si el sitio no carga estilos en Vercel: revisa que Tailwind esté siendo compilado y que `global.css` se importe desde el entrypoint de Astro.
- Si el JS de cliente no funciona en producción: asegúrate de servirlo desde `public/` o usar rutas absolutas correctas.

Si quieres, puedo:
- Añadir este archivo al repo y hacer commit/push por ti.
- Crear un pequeño checklist en `/docs` con pasos personalizados.

---
Fecha: 27/05/2026
