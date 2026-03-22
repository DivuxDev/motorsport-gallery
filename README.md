# Motorsport Gallery

Galería de fotografía profesional de motocross y enduro. Aplicación web full-stack con panel de administración para gestionar álbumes, fotos, slider y personalización visual completa.

<img width="1274" height="1129" alt="image" src="https://github.com/user-attachments/assets/e3d3d7c4-074d-4e9b-97a0-dba81a44e262" />


## Stack tecnológico

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, NextAuth.js v5 (autenticación)
- **Base de datos:** SQLite con Prisma 5
- **Procesamiento de imágenes:** Sharp (redimensionado, conversión a WebP)
- **Tipografía:** Space Grotesk (headings) + Inter (body)
- **Despliegue:** Docker (optimizado para Coolify)

## Características

### Galería pública
- Homepage con hero slider de imágenes a pantalla completa (crossfade automático)
- Grid de álbumes con efecto grayscale/color configurable
- Página de álbum con galería masonry y lightbox con navegación por teclado
- Diseño responsive y optimizado para rendimiento

### Panel de administración (`/admin`)
- **Dashboard** con estadísticas, álbumes recientes y actividad
- **Álbumes** — crear, editar, publicar/despublicar, eliminar. Subir fotos con drag & drop
- **Slider** — gestionar las imágenes del hero slider (subir, activar/desactivar, reordenar)
- **Ajustes de la web:**
  - Nombre del sitio (se refleja en navbar, footer, login, metadata)
  - Tema de colores — 6 presets predefinidos + personalización total con color pickers
  - Toggle de fotos en blanco y negro
  - Intervalo del slider
  - Datos de contacto (email, Instagram, teléfono, ubicación)

### Procesamiento de imágenes
- Las fotos se convierten automáticamente a WebP
- Se generan dos versiones: full (2000px) y thumbnail (400x300px)
- Las imágenes del slider se redimensionan a 1920px
- Almacenamiento local en `/public/uploads/` y `/public/images/slider/`

## Instalación local

### Requisitos previos
- Node.js 18+
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd motorsport-gallery

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Crear la base de datos
npx prisma db push

# 5. Crear el usuario administrador
npm run seed

# 6. Arrancar
npm run dev
```

Abre http://localhost:3000

El archivo `.env` contiene:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="un-secreto-seguro"
```

### Ejecutar en producción (sin Docker)

```bash
npm run build
npm start
```

## Despliegue con Docker / Coolify

El proyecto incluye un `Dockerfile` multi-stage optimizado para Coolify.

### Variables de entorno en Coolify

| Variable | Valor | Requerida |
|----------|-------|-----------|
| `DATABASE_URL` | `file:/app/data/prod.db` | Si (ya tiene default en Dockerfile) |
| `AUTH_SECRET` | Un string aleatorio largo | Recomendada |

`AUTH_TRUST_HOST` ya está configurado en el Dockerfile.

### Volúmenes persistentes

Configura estos volúmenes en Coolify para que los datos sobrevivan a los redeploys:

| Volumen | Contenido |
|---------|-----------|
| `/app/data` | Base de datos SQLite |
| `/app/public/uploads` | Fotos de álbumes (full + thumbs) |
| `/app/public/images/slider` | Imágenes del hero slider |

### Que ocurre al arrancar el container

1. Se ejecuta `prisma db push` para crear/actualizar las tablas automáticamente
2. Se crea el usuario admin si no existe (usuario: `admin`, contraseña: `admin`)
3. Se inicia el servidor Next.js

### Puerto

El container expone el puerto `3000`.

## Acceso al panel de administración

- **URL:** `/login`
- **Usuario:** `admin`
- **Contraseña:** `admin`

> Cambia estas credenciales después del primer acceso.

## Estructura del proyecto

```
motorsport-gallery/
├── prisma/
│   ├── schema.prisma        # Modelos: User, Album, Photo, SliderImage, SiteSetting
│   ├── seed.ts              # Seed para desarrollo (npm run seed)
│   └── seed-docker.js       # Seed automático en Docker
├── public/
│   ├── images/
│   │   ├── logo.jpg         # Logo del sitio (también usado como favicon)
│   │   └── slider/          # Imágenes del hero slider
│   └── uploads/
│       ├── full/            # Fotos a resolución completa
│       └── thumbs/          # Thumbnails
├── src/
│   ├── app/
│   │   ├── page.tsx         # Homepage
│   │   ├── layout.tsx       # Layout raíz (inyecta tema dinámico)
│   │   ├── login/           # Página de login
│   │   ├── album/[slug]/    # Página de álbum público
│   │   ├── admin/           # Panel de administración
│   │   │   ├── page.tsx     # Dashboard
│   │   │   ├── albums/      # CRUD de álbumes
│   │   │   ├── slider/      # Gestión del slider
│   │   │   └── settings/    # Ajustes de la web
│   │   └── api/             # API Routes
│   │       ├── albums/      # CRUD álbumes
│   │       ├── photos/      # Eliminar fotos
│   │       ├── upload/      # Subir fotos (Sharp -> WebP)
│   │       ├── slider/      # CRUD slider
│   │       ├── settings/    # Leer/actualizar ajustes
│   │       └── auth/        # NextAuth v5
│   ├── components/
│   │   ├── Navbar.tsx       # Barra de navegación (nombre dinámico)
│   │   ├── Footer.tsx       # Pie de página (contacto dinámico)
│   │   ├── AlbumCard.tsx    # Tarjeta de álbum
│   │   ├── HeroSlider.tsx   # Slider del hero (crossfade)
│   │   └── Lightbox.tsx     # Visor de fotos fullscreen
│   └── lib/
│       ├── prisma.ts        # Cliente Prisma singleton
│       ├── auth.ts          # Configuración NextAuth v5
│       └── settings.ts      # Lectura/escritura de ajustes del sitio
├── Dockerfile               # Multi-stage build para Coolify
├── docker-entrypoint.sh     # Script de arranque (DB + seed + server)
└── .dockerignore
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run seed` | Crear usuario administrador (dev) |

## Licencia

ISC
