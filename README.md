# EduSoft

Sistema web de gestión estudiantil: administra usuarios, profesores, cursos, matrículas, notas, asistencias y notificaciones, con vistas distintas para **Estudiante** y **Profesor**.

Proyecto final del programa de Desarrollo de Software (CESDE).

> **Estado:** todos los módulos operativos, excepto **Reportes estadísticos**, que se desarrolla aparte y hoy es solo un marcador de posición.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 19, React Router 7, Create React App, lucide-react, SweetAlert2 |
| Backend | Java 17, Spring Boot 3.4 (Web, Data JPA, Validation), Lombok, springdoc-openapi (Swagger UI) |
| Base de datos | MySQL 8 |
| Contraseñas | BCrypt (`spring-security-crypto`) |

## Estructura del repositorio

```
edusoft/
├── edusoft_back/    API REST (Spring Boot) → ver edusoft_back/README.md
├── edusoft_front/   Aplicación web (React)  → ver edusoft_front/README.md
└── docs/    Scripts SQL
```

```
Navegador (React) ──HTTP/JSON──▶ API REST (Spring Boot) ──JPA──▶ MySQL
   :3000                    :8080/apiedusoft/v1                    :3306
```

## Requisitos

- JDK 17 o superior
- Node.js 18 o superior y npm
- MySQL 8 en ejecución

## Puesta en marcha

### 1. Base de datos

```sql
CREATE DATABASE `edusoft-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'admin'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON `edusoft-db`.* TO 'admin'@'localhost';
```

Esas credenciales son los valores por defecto **de desarrollo**. Para usar otras, define las variables de entorno `DB_USER` y `DB_PASSWORD` (ver `edusoft_back/README.md`). Las tablas se crean solas al iniciar la API.

### 2. Backend

```bash
cd edusoft_back
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

La API queda en `http://localhost:8080/apiedusoft/v1` y la documentación interactiva en `http://localhost:8080/swagger-ui.html`.

### 3. Frontend

```bash
cd edusoft_front
npm install
npm start
```

Se abre en `http://localhost:3000`.

### 4. Primer profesor

El registro público **solo crea estudiantes**. Para crear el primer Profesor, usa Swagger UI: `POST /apiedusoft/v1/usuarios` con `"rol": "Profesor"` (nombre, correo, documento y contraseña de al menos 6 caracteres). Con esa cuenta ya puedes crear más usuarios desde el módulo **Usuarios**.

## Roles y permisos

| Módulo | Estudiante | Profesor |
|---|---|---|
| Usuarios | — | Crear, editar, eliminar |
| Cursos, Profesores | Consultar | Gestionar |
| Matrículas, Notas, Asistencias | Consultar las propias | Gestionar todas |
| Notificaciones | Ver las recibidas | Enviar, editar, eliminar y ver todas |
| Reportes | — | Pendiente (desarrollo aparte) |

## Seguridad: qué incluye y qué no

Incluye:

- Inicio de sesión validado **en el servidor** (`POST /auth/login`, respuesta 401 si falla).
- Contraseñas guardadas con BCrypt; la API nunca las devuelve.
- Los usuarios antiguos con contraseña en texto plano se migran automáticamente a BCrypt en su primer inicio de sesión.

Limitaciones conocidas (decisión de alcance del proyecto):

- **La API no valida roles ni tokens.** El control de acceso por rol se aplica solo en la interfaz: quien llame a la API directamente puede leer o modificar datos y crear usuarios con cualquier rol.
- Los estudiantes ven solo sus registros porque el navegador filtra; la API devuelve todos.
- Una mejora futura natural es Spring Security con JWT y autorización por rol en el backend.

## Pruebas

```bash
cd edusoft_back  && ./mvnw test
cd edusoft_front && npm test
```

## Despliegue

Frontend y backend se configuran con variables de entorno: `REACT_APP_API_URL` (frontend) y `DB_URL`, `DB_USER`, `DB_PASSWORD`, `CORS_ALLOWED_ORIGINS` (backend). Detalles en cada README.