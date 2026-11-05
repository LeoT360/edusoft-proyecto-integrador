-- ============================================================
-- EduSoft · Reiniciar la base de datos
-- ============================================================
-- ⚠ ELIMINA TODOS LOS DATOS (usuarios, perfiles, cursos, matrículas, notas,
--   asistencias y notificaciones) y reinicia los IDs: el próximo registro de
--   cada tabla tendrá ID 1. No se puede deshacer.
--
-- Antes de ejecutarlo, si quieres conservar algo, haz una copia:
--   mysqldump -u admin -p --default-character-set=utf8mb4 edusoft-db > respaldo.sql
--
-- Las tablas y columnas se conservan; solo se vacían.
--
-- Después de ejecutarlo no quedará ningún usuario, así que no podrás iniciar
-- sesión. Para volver a tener acceso:
--   · carga docs/datos-de-prueba.sql (incluye profesores y estudiantes), o
--   · crea el primer Profesor desde Swagger (ver README general).
--
-- Opción alternativa (esquema desde cero): borra la base completa y deja que
-- la API recree las tablas al iniciar. Úsala si además quieres eliminar
-- columnas antiguas que ya no existen en el código:
--   DROP DATABASE `edusoft-db`;
--   CREATE DATABASE `edusoft-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--   -- (si usas un usuario distinto de root, vuelve a darle permisos sobre la base)
-- ============================================================

USE `edusoft-db`;

-- Se desactivan las llaves foráneas para poder vaciar las tablas en cualquier orden.
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE notificaciones;
TRUNCATE TABLE asistencia;
TRUNCATE TABLE notas;
TRUNCATE TABLE matriculas;
TRUNCATE TABLE cursos;
TRUNCATE TABLE profesor_perfil;
TRUNCATE TABLE usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- Verificación: todas las tablas deben quedar con 0 filas.
SELECT 'usuarios' AS tabla, COUNT(*) AS filas FROM usuarios
UNION ALL SELECT 'profesor_perfil', COUNT(*) FROM profesor_perfil
UNION ALL SELECT 'cursos', COUNT(*) FROM cursos
UNION ALL SELECT 'matriculas', COUNT(*) FROM matriculas
UNION ALL SELECT 'notas', COUNT(*) FROM notas
UNION ALL SELECT 'asistencia', COUNT(*) FROM asistencia
UNION ALL SELECT 'notificaciones', COUNT(*) FROM notificaciones;
