# LYN AutoSales (Node + MySQL) — Guía Hostinger

## Stack
- Node.js + Express + EJS
- MySQL (mysql2)
- Sesiones + bcrypt
- Multer (uploads), Sharp (miniaturas)
- i18n ES/EN (ES por defecto)
- **RBAC (roles):** admin, manager, lister, viewer

## Permisos
- **admin:** todo
- **manager:** CRUD completo, importar CSV, borrar
- **lister:** crear y editar vehículos, subir fotos/videos (no borrar, no importar)
- **viewer:** solo ver panel

## Despliegue
1. Sube el proyecto al hosting.
2. En Terminal de hPanel:
   ```bash
   npm install
   ```
3. Copia `.env.example` a `.env` y completa variables (DB, SESSION_SECRET, PORT).
4. Crea tablas importando `schema.sql` en phpMyAdmin.
5. Crea usuarios:
   ```bash
   node tools/create_admin.js admin@lyn.com TuClaveFuerte123! admin
   node tools/create_admin.js vendedor@lyn.com OtraClave! lister
   ```
6. Configura App Node apuntando a `server.js` (puerto 3000 o el que elijas) desde hPanel.

## Uso
- Inventario público en `/inventory` con paginación, filtros y orden.
- Detalle con galería y video.
- Formulario de contacto con verificación reCAPTCHA opcional (`RECAPTCHA_SECRET`).
- **Admin** en `/admin` con login, dashboard y gestión.
- **Cargas desde móvil:** inputs con `capture="environment"` para abrir cámara.

## CSV
Columnas: `year,make,model,price,mileage,vin,title_status,transmission,fuel_type,location,status,description`.

## Archivos
- Imágenes en `uploads/images` (+ miniatura `.webp`).
- Videos en `uploads/videos` (usa MP4 H.264 para compatibilidad).

## Personalización
- Colores negro/dorado y logo en `src/assets/logo.png`.
- Textos ES/EN en `src/locales`.
- Estilos en `src/assets/styles.css`.
