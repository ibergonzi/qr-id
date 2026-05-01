# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Idioma:** Toda comunicación con el usuario debe ser en español.

## Comandos

Siempre cargar la versión correcta de Node primero (el shell no activa nvm automáticamente):

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use
```

Luego usar los scripts estándar de npm:

```bash
npm run dev      # servidor de desarrollo en localhost:3000
npm run build    # build de producción (ejecutar para verificar TypeScript + lint antes de pushear)
npm run lint     # solo ESLint
```

No hay tests. `npm run build` es la verificación de correctitud principal.

## Arquitectura

**Sin base de datos.** Todos los datos de la persona viven en la URL. En `/create`, el formulario serializa un objeto `PersonData` a base64url JSON (`lib/encode.ts`) y lo embebe en un código QR que apunta a `/card?d=<encoded>`. La página `/card` decodifica el parámetro del lado del servidor y renderiza. La URL codificada es el único artefacto persistente.

**Almacenamiento de fotos** es Cloudinary (free tier). `lib/cloudinary.ts` hace una subida directa desde el browser usando un preset no firmado — sin proxy server-side. La `secure_url` resultante se guarda en el campo `ph` de `PersonData` y se embebe en la URL del QR.

**Auth** es una única contraseña compartida. `POST /api/auth` verifica `ADMIN_PASSWORD`, luego setea una cookie `httpOnly` cuyo valor es `SESSION_SECRET`. `middleware.ts` protege `/create` comparando la cookie contra `SESSION_SECRET`. Sin sesiones, sin tokens, sin usuarios.

**Generación de PDF** (`lib/pdfGen.ts`) usa `jsPDF` con dynamic import para mantenerlo fuera del bundle inicial. `buildPDF` es interna; `generatePDF` dispara una descarga y `getPDFBlob` devuelve un Blob para la Web Share API. `safeName` (exportada) hace normalización NFD para eliminar diacríticos antes de construir nombres de archivo — usarla en cualquier lugar donde un nombre de archivo se derive del nombre de una persona.

**División cliente/servidor:**
- `app/card/page.tsx` — Server Component; decodifica datos, los pasa a `CardTemplate`
- `components/CardTemplate.tsx` — `'use client'`; maneja estado del lightbox
- `app/create/page.tsx` — `'use client'`; maneja todo el estado del formulario, generación del QR y entrega del PDF
- `components/QRPreview.tsx` — `'use client'`; se muestra tras una generación exitosa

## Variables de entorno

Requeridas en `.env.local` (nunca commitear este archivo):

| Variable | Propósito |
|---|---|
| `ADMIN_PASSWORD` | Contraseña que se ingresa en la pantalla de login |
| `SESSION_SECRET` | Valor de la cookie que se setea tras el login |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nombre del cloud de Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Nombre del upload preset no firmado |

## Restricciones importantes

- `<img>` se usa intencionalmente (data URLs, object URLs, URLs de Cloudinary) — `@next/next/no-img-element` está deshabilitado en `.eslintrc.json`.
- El manejo de fechas es timezone-safe: usar `new Date(year, month-1, day)` (constructor en hora local) para validación, nunca `new Date(isoString)` que se desplaza en zonas UTC con offset.
- La función "cargar desde tarjeta existente" en `/create` parsea `?d=` de una URL pegada, la decodifica y pre-completa todos los campos del formulario — al editar una tarjeta solo se re-sube la foto si se selecciona un archivo nuevo.
- El manifest PWA (`app/manifest.ts`) tiene `start_url: '/create'` para que el ícono en el home screen de Android abra directamente el formulario de administración.
- Deploy: `git push origin main` dispara un redeploy automático en Vercel. No se necesita ningún paso manual.
