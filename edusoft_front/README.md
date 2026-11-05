# EduSoft · Frontend

Aplicación web en React que consume la API de EduSoft. Consulta el [README general](../README.md) para la puesta en marcha completa.

## Stack

React 19 · React Router 7 · Create React App (react-scripts 5) · lucide-react (iconos) · SweetAlert2 (alertas).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Compilación de producción en `build/` |

## Configuración

La URL de la API se define en `src/utils/api.js`. Por defecto es `http://localhost:8080/apiedusoft/v1`; para cambiarla copia `.env.example` a `.env` y ajusta `REACT_APP_API_URL`. La variable se lee al compilar, así que reinicia `npm start` o vuelve a ejecutar `npm run build` tras cambiarla.

## Estructura

```
src/
├── App.jsx                 Rutas y guard de rutas privadas
├── utils/                  api.js (URL base), auth.js (sesión), swalConfig.js (alertas)
├── services/               Un cliente HTTP por recurso + http.js (manejo común de respuestas)
└── components/
    ├── pages/              Inicio (pública) y Home (panel)
    ├── usuarios/           Login, registro y gestión de usuarios
    ├── notificaciones/ profesores/ cursos/ matricula/ notas/ asistencias/
    ├── reportes/           Pendiente (desarrollo aparte)
    └── shared/             Navbar, tablas, tarjetas, modales y buscador reutilizables
```

## Cómo funciona

- **Sesión:** `POST /auth/login` valida las credenciales en el servidor. El usuario devuelto (sin contraseña) se guarda en `localStorage` y las rutas privadas lo leen con `utils/auth.js`.
- **Rutas:** públicas (`/`, `/login`, `/registro`), privadas para cualquier rol y exclusivas de Profesor (`/usuarios`, `/reportes`). Un estudiante que entra a una ruta de Profesor vuelve a `/home`. Cualquier ruta desconocida lleva al inicio.
- **Módulos:** cada listado (`Lista*.jsx`) incluye búsqueda en tiempo real, indicadores de resumen, ventana de detalle y un modal para crear o editar. Las acciones de escritura solo se muestran al Profesor.
- **Modo oscuro:** interruptor en la barra de navegación; la preferencia se guarda y se aplica antes del primer render.
- **Errores:** los servicios lanzan un `Error` con el mensaje del backend y el código en `status`.

## Módulos

| Módulo | Estudiante | Profesor |
|---|---|---|
| Usuarios | — | Crear, editar, eliminar, buscar |
| Notificaciones | Ver las suyas | Gestionar todas |
| Profesores | Consultar | Crear o editar el perfil profesional |
| Cursos | Consultar | Gestionar |
| Matrícula | Ver las suyas | Gestionar (valor en COP) |
| Notas | Ver las suyas | Gestionar |
| Asistencias | Ver las suyas | Registrar y gestionar |
| Reportes | — | Pendiente |

## Limitaciones conocidas

- Los estudiantes ven solo sus registros de asistencias, matrículas y notificaciones porque el navegador filtra; la API devuelve todos. El control de roles de la interfaz no sustituye una autorización en el servidor.
- El inicio y el login cargan imágenes externas (Pexels); sin internet se muestran sin imagen.
- `jspdf` y `jspdf-autotable` están instalados pero hoy no se usan; quedan reservados para los reportes.
