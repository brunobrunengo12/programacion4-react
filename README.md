# Programación 4 — React + TypeScript

Repositorio con los trabajos prácticos de frontend desarrollados con **React**, **TypeScript** y **Vite**.

## Estructura del repositorio

```text
programacion4-react/
├── ejercicios-basicos/     # Proyecto Vite con los ejercicios Ej1 a Ej7 integrados en App.tsx
└── frontend-endpoints/     # Prácticas acumulativas conectadas a la API (practica1 a practica8)
    ├── practica1/          # Login, saludo con /user/me/id, listado y detalle de usuario
    ├── practica2/          # Estado de carga ("Cargando...") y manejo de errores
    ├── practica3/          # Búsqueda por nombre con encodeURIComponent y botón Limpiar
    ├── practica4/          # Visualización de roles del usuario autenticado en el header
    ├── practica5/          # Alta de usuarios con POST /user y manejo de errores 403/422
    ├── practica6/          # Filtro alternable Todos / Solo mayores (GET /user_mayores)
    ├── practica7/          # Borrado de usuarios con confirmación (DELETE /user/{id})
    └── practica8/          # Manejo de sesión vencida (401) con redirección al login
```

## Requisitos previos

- Node.js y npm instalados.
- Backend de la cátedra corriendo localmente para las prácticas de `frontend-endpoints`.

## Cómo ejecutar `ejercicios-basicos`

```bash
cd ejercicios-basicos
npm install
npm run dev
```

## Cómo ejecutar las prácticas de `frontend-endpoints`

Cada carpeta (`practica1` a `practica8`) es un proyecto independiente configurado en el puerto **5175** (`vite.config.ts`) para coincidir con la configuración de CORS de la API.

1. Ingresar a la práctica deseada (por ejemplo, `practica8`):
   ```bash
   cd frontend-endpoints/practica8
   ```
2. Crear el archivo `.env` a partir de `.env.example` configurando la URL de la API:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
3. Instalar dependencias y levantar el entorno de desarrollo:
   ```bash
   npm install
   npm run dev
   ```
4. Para verificar los tipos de TypeScript y la compilación de producción:
   ```bash
   npm run build
   ```

> **Nota:** Los archivos `.env` y las carpetas `node_modules` y `dist` están excluidos del repositorio mediante `.gitignore`.

---

## Respuestas "Para pensar"

- **Práctica 1 — ¿Por qué `GET /user` devuelve solo un resumen y el detalle se pide con `GET /user/{id}`?**
  Por rendimiento y ancho de banda: evita transferir campos pesados o relaciones (email, país, roles) de todos los registros cuando solo se necesita listar los nombres, trayendo el detalle bajo demanda al hacer clic. También reduce la exposición innecesaria de datos.

- **Práctica 2 — ¿Por qué chequear `respuesta.ok` si ya existe `.catch()`?**
  Porque `fetch` solo entra al `.catch()` ante fallos de red (servidor caído, sin conexión o error de CORS). Las respuestas HTTP con error como `404`, `403` o `500` resuelven la promesa normalmente, por lo que hay que verificar `respuesta.ok` manualmente y leer `data.detail`.

- **Práctica 3 — ¿Qué ocurre al buscar `#` sin `encodeURIComponent`?**
  El navegador interpreta `#` como un fragmento local de la URL y recorta todo lo que sigue antes de enviar la petición al servidor. Con `encodeURIComponent`, `#` se codifica como `%23` y llega correctamente al endpoint `/user/search/%23`.

- **Práctica 4 — ¿Por qué no fue necesario agregar otro `fetch` para mostrar los roles?**
  Porque `App.tsx` ya consultaba `GET /user/{id}` para obtener el nombre del usuario autenticado, y esa respuesta ya incluye el arreglo `roles`. Solo se amplió la interfaz de TypeScript y se formateó la salida con `.map(...).join(", ")`.

- **Práctica 5 — ¿Por qué convertir `age` y `country_id` con `Number(...)` y qué muestra probar con `sfer`?**
  Los valores de inputs y selects en React siempre son `string`, por lo que `Number(...)` asegura enviar los tipos numéricos que espera la API. Al probar con `sfer` (rol `REGULAR`), la API devuelve `403` (`Missing permission: write_users`), confirmando que los permisos se validan en el servidor.

- **Práctica 6 — ¿Por qué usar `GET /user_mayores` en lugar de filtrar en el frontend?**
  Porque `GET /user` no incluye la edad en el resumen y porque delegar el filtro al backend evita transferir registros innecesarios y mantiene la lógica de negocio centralizada en el servidor.

- **Práctica 7 — ¿Conviene mostrar el botón "Borrar" a usuarios sin permiso?**
  Desde la experiencia de usuario conviene ocultarlo o deshabilitarlo según los permisos para no ofrecer acciones que van a fallar. Sin embargo, ocultar botones en el frontend nunca reemplaza la seguridad: la validación real siempre debe hacerla el backend devolviendo `403`.

- **Práctica 8 — ¿Por qué pasar `onUnauthorized` desde `App.tsx` y validar `401` en cada petición?**
  Porque el token puede vencer mientras la app está en uso. Como el estado `token` vive en `App.tsx`, los componentes hijos le avisan mediante el callback `onUnauthorized` para limpiar `localStorage`, cerrar la sesión y mostrar el aviso en la pantalla de login.