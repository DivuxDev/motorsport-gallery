# Motorsport Gallery

Galería de fotografía profesional de motocross y enduro. Aplicación web full-stack con panel de administración para gestionar álbumes, fotos, slider y personalización visual completa.

## Stack tecnológico

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, NextAuth.js (autenticación)
- **Base de datos:** SQLite con Prisma ORM
- **Procesamiento de imágenes:** Sharp (redimensionado, conversión a WebP)
- **Tipografía:** Space Grotesk (headings) + Inter (body)

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

## Instalación

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
# Editar .env y cambiar NEXTAUTH_SECRET por un valor seguro
```

El archivo `.env` contiene:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="cambia-esto-por-un-secreto-seguro-en-produccion"
NEXTAUTH_URL="http://localhost:3000"
```

```bash
# 4. Crear la base de datos y generar el cliente Prisma
npx prisma db push

# 5. Crear el usuario administrador
npm run seed
```

### Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

### Ejecutar en producción

```bash
npm run build
npm start
```

## Acceso al panel de administración

- **URL:** http://localhost:3000/login
- **Email:** `admin@mxshots.com`
- **Password:** `admin123`

> Cambia estas credenciales después del primer acceso.

## Estructura del proyecto

```
motorsport-gallery/
├── prisma/
│   ├── schema.prisma      # Modelos: User, Album, Photo, SliderImage, SiteSetting
│   ├── seed.ts             # Script para crear usuario admin
│   └── dev.db              # Base de datos SQLite (se genera automáticamente)
├── public/
│   ├── images/
│   │   ├── logo.jpg        # Logo del sitio
│   │   └── slider/         # Imágenes del hero slider
│   └── uploads/
│       ├── full/           # Fotos a resolución completa
│       └── thumbs/         # Thumbnails
├── src/
│   ├── app/
│   │   ├── page.tsx        # Homepage
│   │   ├── layout.tsx      # Layout raíz (inyecta tema)
│   │   ├── login/          # Página de login
│   │   ├── album/[slug]/   # Página de álbum público
│   │   ├── admin/          # Panel de administración
│   │   │   ├── page.tsx    # Dashboard
│   │   │   ├── albums/     # CRUD de álbumes
│   │   │   ├── slider/     # Gestión del slider
│   │   │   └── settings/   # Ajustes de la web
│   │   └── api/            # API Routes
│   │       ├── albums/     # CRUD álbumes
│   │       ├── photos/     # Eliminar fotos
│   │       ├── upload/     # Subir fotos
│   │       ├── slider/     # CRUD slider
│   │       ├── settings/   # Leer/actualizar ajustes
│   │       └── auth/       # NextAuth
│   ├── components/
│   │   ├── Navbar.tsx      # Barra de navegación
│   │   ├── Footer.tsx      # Pie de página con contacto
│   │   ├── AlbumCard.tsx   # Tarjeta de álbum
│   │   ├── HeroSlider.tsx  # Slider del hero
│   │   └── Lightbox.tsx    # Visor de fotos fullscreen
│   └── lib/
│       ├── prisma.ts       # Cliente Prisma singleton
│       ├── auth.ts         # Configuración NextAuth
│       └── settings.ts     # Lectura/escritura de ajustes
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run seed` | Crear usuario administrador |

## Licencia

ISC
