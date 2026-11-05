-- ============================================================
-- EduSoft · Eliminar los datos de prueba
-- ============================================================
-- Borra únicamente lo creado por datos-de-prueba.sql: los usuarios con correo
-- @edusoft.test y todo lo que depende de ellos (perfiles, cursos, matrículas,
-- notas, asistencias y notificaciones). Tus datos reales no se tocan.
--
-- Nota: si registraste a mano matrículas, notas o asistencias de un usuario real
-- en un curso de prueba, también se borran (dependen del curso).
-- ============================================================

SET SQL_SAFE_UPDATES = 0;
START TRANSACTION;

DELETE FROM notificaciones
 WHERE remitente_id    IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test')
    OR destinatario_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test')
    OR curso_id IN (SELECT c.id FROM cursos c
                    JOIN profesor_perfil p ON p.id = c.profesor_id
                    JOIN usuarios u ON u.id = p.usuario_id
                    WHERE u.correo LIKE '%@edusoft.test');

DELETE FROM asistencia
 WHERE usuario_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test')
    OR curso_id IN (SELECT c.id FROM cursos c JOIN profesor_perfil p ON p.id = c.profesor_id
                    JOIN usuarios u ON u.id = p.usuario_id WHERE u.correo LIKE '%@edusoft.test');

DELETE FROM notas
 WHERE usuario_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test')
    OR curso_id IN (SELECT c.id FROM cursos c JOIN profesor_perfil p ON p.id = c.profesor_id
                    JOIN usuarios u ON u.id = p.usuario_id WHERE u.correo LIKE '%@edusoft.test');

DELETE FROM matriculas
 WHERE usuario_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test')
    OR curso_id IN (SELECT c.id FROM cursos c JOIN profesor_perfil p ON p.id = c.profesor_id
                    JOIN usuarios u ON u.id = p.usuario_id WHERE u.correo LIKE '%@edusoft.test');

DELETE FROM cursos
 WHERE profesor_id IN (SELECT p.id FROM profesor_perfil p JOIN usuarios u ON u.id = p.usuario_id
                       WHERE u.correo LIKE '%@edusoft.test');

DELETE FROM profesor_perfil
 WHERE usuario_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test');

DELETE FROM usuarios WHERE correo LIKE '%@edusoft.test';

COMMIT;
SET SQL_SAFE_UPDATES = 1;
