# EduSoft · Backend

API REST de EduSoft construida con Spring Boot. Expone el CRUD de cada módulo y el inicio de sesión. Consulta el [README general](../README.md) para la puesta en marcha completa.

## Stack

Java 17 · Spring Boot 3.4.2 · Spring Data JPA · Bean Validation · MySQL · Lombok · springdoc-openapi 2.8 · `spring-security-crypto` (solo BCrypt).

## Arquitectura en capas

```
src/main/java/com/edusoft/app/
├── config/           CORS y codificador de contraseñas
├── domain/
│   ├── models/       Entidades JPA
│   └── exceptions/   Excepciones de negocio
├── application/
│   ├── dto/          Request / Response por módulo
│   └── service/      Casos de uso (el mapeo entidad ↔ DTO se hace aquí)
├── infrastructure/
│   └── repository/   Repositorios Spring Data JPA
└── presentation/
    ├── controller/   Endpoints REST
    └── advice/       GlobalExceptionHandler
```

## Configuración

Todo se define en `src/main/resources/application.yaml` y se puede sobrescribir con variables de entorno:

| Variable | Por defecto (solo desarrollo) | Descripción |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/edusoft-db?...` | URL JDBC |
| `DB_USER` | `admin` | Usuario de MySQL |
| `DB_PASSWORD` | `12345` | Contraseña de MySQL |
| `JPA_DDL_AUTO` | `update` | Gestión del esquema. En producción usa `validate` o `none` |
| `JPA_SHOW_SQL` | `false` | Muestra las consultas SQL en el log |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000` | Orígenes del frontend, separados por coma |

> En producción define siempre credenciales propias; los valores por defecto no deben usarse fuera de tu máquina.

## Ejecución

```bash
./mvnw spring-boot:run     # Windows: mvnw.cmd spring-boot:run
./mvnw test
./mvnw clean package       # genera target/*.jar
```

Si `./mvnw` no es ejecutable en Linux o macOS: `chmod +x mvnw`.

Swagger UI: `http://localhost:8080/swagger-ui.html` · OpenAPI: `/api-docs`.

## Endpoints

Base: `/apiedusoft/v1`

| Recurso | Ruta | Operaciones |
|---|---|---|
| Autenticación | `/auth/login` | `POST` (correo y contraseña → usuario, o 401) |
| Usuarios | `/usuarios` | CRUD |
| Profesores | `/profesores` | CRUD (perfil profesional de un usuario con rol Profesor) |
| Cursos | `/cursos` | CRUD |
| Matrículas | `/matriculas` | CRUD |
| Notas | `/notas` | CRUD · `GET /notas?email=` filtra por correo del estudiante |
| Asistencias | `/asistencias` | CRUD |
| Notificaciones | `/notificaciones` | CRUD |

CRUD = `POST /`, `GET /`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}`.

## Respuestas de error

El cuerpo es texto plano con el mensaje.

| Código | Cuándo |
|---|---|
| 400 | Datos inválidos o regla de negocio incumplida (por ejemplo, contraseña de menos de 6 caracteres) |
| 401 | Correo o contraseña incorrectos |
| 404 | El recurso no existe |
| 409 | Duplicado (correo repetido, estudiante ya matriculado en el curso) o intento de eliminar un registro que tiene otros registros asociados (el mensaje indica cuáles) |
| 500 | Error inesperado (se registra en el log) |

## Usuarios y contraseñas

- Las contraseñas se guardan con BCrypt y **ninguna respuesta las incluye**.
- Al actualizar un usuario, omitir la contraseña conserva la actual.
- Migración: si una cuenta antigua tiene la contraseña en texto plano, el primer inicio de sesión correcto la convierte a BCrypt.
- No hay autenticación por token: la API no valida roles (ver limitaciones en el [README general](../README.md#seguridad-qué-incluye-y-qué-no)).

## Eliminación de registros

Los registros **no se borran en cascada**: eliminar un usuario o un curso arrastraría notas y asistencias históricas sin que se note. En su lugar, `VerificadorDependencias` comprueba antes de eliminar y responde 409 con el detalle, por ejemplo:

> No se puede eliminar el usuario «Valentina Arango» porque tiene registros asociados (matrículas: 3, notas: 5, asistencias: 9). Elimínalos o reasígnalos primero.

| Se quiere eliminar | Lo bloquea |
|---|---|
| Usuario | Matrículas, notas, asistencias, notificaciones (enviadas o recibidas) y, si es profesor, cursos que dicta. Su perfil de profesor sin cursos se elimina junto con él |
| Perfil de profesor | Cursos asignados |
| Curso | Matrículas, notas, asistencias y notificaciones del curso |

Orden recomendado para limpiar datos a mano: notificaciones, asistencias, notas y matrículas → cursos → perfil de profesor → usuario. Matrículas, notas, asistencias y notificaciones se pueden eliminar siempre.

## Base de datos existente

`ddl-auto: update` crea tablas y columnas nuevas, pero **nunca borra** las que ya no se usan. Si tu tabla `notificaciones` se creó cuando la entidad tenía el campo `leida` (columna `NOT NULL` sin valor por defecto), ejecuta una vez:

```sql
ALTER TABLE notificaciones DROP COLUMN leida;
```

Sin ese paso, crear notificaciones falla con "Field 'leida' doesn't have a default value". En una base nueva no hace falta.
