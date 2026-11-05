-- ============================================================
-- EduSoft · Datos de prueba
-- ============================================================
-- Qué crea:
--   4 profesores (1 sin perfil profesional), 13 estudiantes (1 con cuenta inactiva),
--   3 perfiles, 9 cursos, 40 matrículas, 96 notas,
--   96 asistencias y 15 notificaciones.
--
-- Cómo usarlo:
--   1. Inicia la API al menos una vez (Hibernate crea las tablas).
--   2. Ejecuta este script sobre la base `edusoft-db`.
--   3. Ejecútalo UNA sola vez. Para repetirlo, corre antes datos-de-prueba-limpiar.sql.
--
-- Todos los usuarios usan la contraseña:  Edusoft123
--   Profesor   -> carlos.restrepo@edusoft.test   (también maria.gomez, julian.ospina, laura.zapata)
--   Estudiante -> valentina.arango@edusoft.test  (y los demás del listado)
--   Inactivo   -> tomas.agudelo@edusoft.test     (el login debe fallar con 401)
--
-- Las relaciones se resuelven por correo y título, no por ID, así que no choca
-- con datos que ya tengas. Solo se usan correos @edusoft.test.
-- ============================================================

SET NAMES utf8mb4;
START TRANSACTION;

-- ------------------------------------------------------------
-- 1. Usuarios
-- ------------------------------------------------------------
INSERT INTO usuarios (nombre, correo, contrasena, rol, telefono, documento, activo) VALUES
  ('Carlos Andrés Restrepo Londoño', 'carlos.restrepo@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Profesor', '3004561122', '71654321', 1),
  ('María Fernanda Gómez Pérez', 'maria.gomez@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Profesor', '3157893344', '43987654', 1),
  ('Julián David Ospina Cárdenas', 'julian.ospina@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Profesor', '3206677889', '1017223344', 1),
  ('Laura Cristina Zapata Builes', 'laura.zapata@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Profesor', '3124445566', '1036998877', 1),
  ('Valentina Arango Mejía', 'valentina.arango@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234501', '1038412301', 1),
  ('Santiago Cardona Ruiz', 'santiago.cardona@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234502', '1038412302', 1),
  ('Daniela Henao Torres', 'daniela.henao@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234503', '1038412303', 1),
  ('Mateo Giraldo Vélez', 'mateo.giraldo@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234504', '1038412304', 1),
  ('Isabella Montoya Castaño', 'isabella.montoya@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234505', '1038412305', 1),
  ('Samuel Londoño Pérez', 'samuel.londono@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234506', '1038412306', 1),
  ('Camila Úsuga Salazar', 'camila.usuga@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234507', '1038412307', 1),
  ('Juan Pablo Quintero Mora', 'juan.quintero@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234508', '1038412308', 1),
  ('Sofía Betancur Ríos', 'sofia.betancur@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234509', '1038412309', 1),
  ('Nicolás Echeverri Gil', 'nicolas.echeverri@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234510', '1038412310', 1),
  ('Mariana Cano Jaramillo', 'mariana.cano@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234511', '1038412311', 1),
  ('Andrés Felipe Muñoz Duque', 'andres.munoz@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234512', '1038412312', 1),
  ('Tomás Agudelo Herrera', 'tomas.agudelo@edusoft.test', '$2b$10$dgS6.62jv84zqmNkJvFpb.LvA8c/6DXrQBviq0GhWNOPso3ZJsY3a', 'Estudiante', '3101234513', '1038412313', 0);

-- ------------------------------------------------------------
-- 2. Perfiles de profesor (Laura Zapata queda sin perfil a propósito)
-- ------------------------------------------------------------
INSERT INTO profesor_perfil (usuario_id, areas_asignadas, nivel_academico, anos_experiencia, tipo_contrato, fecha_ingreso, vigencia, perfil_profesional)
SELECT u.id, t.areas, t.nivel, t.anos, t.contrato, t.ingreso, t.vigencia, t.perfil
FROM (
  SELECT 'carlos.restrepo@edusoft.test' AS correo, 'Programación y bases de datos' AS areas, 'Maestría' AS nivel, 9 AS anos, 'Tiempo completo' AS contrato, '2019-02-04' AS ingreso, 1 AS vigencia, 'Ingeniero de sistemas con maestría en Ingeniería de Software. Ha liderado proyectos de desarrollo y docencia en programación y bases de datos.' AS perfil
  UNION ALL SELECT 'maria.gomez@edusoft.test', 'Matemáticas y estadística', 'Doctorado', 14, 'Tiempo completo', '2014-07-21', 1, 'Matemática con doctorado en Estadística. Investigadora en modelos predictivos y analítica educativa.'
  UNION ALL SELECT 'julian.ospina@edusoft.test', 'Desarrollo web y redes', 'Profesional', 5, 'Cátedra', '2022-08-01', 1, 'Ingeniero de sistemas y desarrollador full stack. Experiencia en React, Spring Boot e infraestructura de redes.'
) t
JOIN usuarios u ON u.correo = t.correo;

-- ------------------------------------------------------------
-- 3. Cursos
-- ------------------------------------------------------------
INSERT INTO cursos (titulo, descripcion, tipo_curso, modalidad, duracion_horas, fecha_inicio, fecha_fin, profesor_id, activo)
SELECT t.titulo, t.descripcion, t.tipo, t.modalidad, t.horas, t.inicio, t.fin, p.id, t.activo
FROM (
  SELECT 'Fundamentos de Programación' AS titulo, 'Lógica de programación, estructuras de control y funciones en Java.' AS descripcion, 'Teórico-Práctico' AS tipo, 'Presencial' AS modalidad, 64.0 AS horas, '2026-08-03' AS inicio, '2026-12-04' AS fin, 'carlos.restrepo@edusoft.test' AS profesor, 1 AS activo
  UNION ALL SELECT 'Bases de Datos Relacionales', 'Modelo entidad-relación, normalización y SQL con MySQL.', 'Teórico-Práctico', 'Híbrida', 48.0, '2026-08-10', '2026-11-27', 'carlos.restrepo@edusoft.test', 1
  UNION ALL SELECT 'Estructuras de Datos', 'Listas, pilas, colas, árboles y análisis de complejidad. (Curso del semestre anterior)', 'Teórico', 'Presencial', 48.0, '2026-02-02', '2026-06-12', 'carlos.restrepo@edusoft.test', 0
  UNION ALL SELECT 'Cálculo Diferencial', 'Límites, derivadas y aplicaciones.', 'Teórico', 'Presencial', 64.0, '2026-08-04', '2026-12-03', 'maria.gomez@edusoft.test', 1
  UNION ALL SELECT 'Estadística Aplicada', 'Estadística descriptiva e inferencial con casos prácticos.', 'Teórico-Práctico', 'Virtual', 40.0, '2026-08-11', '2026-11-24', 'maria.gomez@edusoft.test', 1
  UNION ALL SELECT 'Matemáticas Discretas', 'Lógica, conjuntos, relaciones y grafos.', 'Electiva', 'Virtual', 32.0, '2026-08-12', '2026-11-25', 'maria.gomez@edusoft.test', 1
  UNION ALL SELECT 'Desarrollo Web con React', 'Componentes, hooks, rutas y consumo de APIs REST.', 'Práctico', 'Híbrida', 56.0, '2026-08-05', '2026-12-02', 'julian.ospina@edusoft.test', 1
  UNION ALL SELECT 'Redes de Computadores', 'Modelo OSI, direccionamiento IP y configuración básica de redes.', 'Teórico-Práctico', 'Presencial', 48.0, '2026-08-06', '2026-11-26', 'julian.ospina@edusoft.test', 1
  UNION ALL SELECT 'Diseño de Interfaces (UX/UI)', 'Principios de usabilidad y prototipado. (Inicia el próximo semestre)', 'Electiva', 'Virtual', 24.0, '2027-02-01', '2027-05-14', 'julian.ospina@edusoft.test', 1
) t
JOIN usuarios u ON u.correo = t.profesor
JOIN profesor_perfil p ON p.usuario_id = u.id;

-- ------------------------------------------------------------
-- 4. Matrículas (únicas por estudiante y curso)
-- ------------------------------------------------------------
INSERT INTO matriculas (usuario_id, curso_id, fecha_matricula, valor_matricula, estado)
SELECT u.id, c.id, t.fecha, t.valor, t.estado
FROM (
  SELECT 'valentina.arango@edusoft.test' AS correo, 'Fundamentos de Programación' AS curso, '2026-07-18' AS fecha, 1200000.0 AS valor, 'ACTIVA' AS estado
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Bases de Datos Relacionales', '2026-07-25', 1100000.0, 'ACTIVA'
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Desarrollo Web con React', '2026-07-31', 1300000.0, 'ACTIVA'
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Fundamentos de Programación', '2026-07-31', 1200000.0, 'ACTIVA'
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Cálculo Diferencial', '2026-08-04', 950000.0, 'ACTIVA'
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Redes de Computadores', '2026-07-18', 1000000.0, 'ACTIVA'
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Fundamentos de Programación', '2026-07-22', 1200000.0, 'ACTIVA'
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Bases de Datos Relacionales', '2026-08-03', 1100000.0, 'ACTIVA'
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Estadística Aplicada', '2026-08-03', 900000.0, 'ACTIVA'
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Diseño de Interfaces (UX/UI)', '2026-10-28', 800000.0, 'ACTIVA'
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Bases de Datos Relacionales', '2026-07-28', 1100000.0, 'ACTIVA'
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Desarrollo Web con React', '2026-08-02', 1300000.0, 'ACTIVA'
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Redes de Computadores', '2026-08-01', 1000000.0, 'ACTIVA'
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Estructuras de Datos', '2026-01-27', 1100000.0, 'INACTIVA'
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Fundamentos de Programación', '2026-08-08', 1200000.0, 'ACTIVA'
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Estadística Aplicada', '2026-08-08', 900000.0, 'ACTIVA'
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Desarrollo Web con React', '2026-08-02', 1300000.0, 'ACTIVA'
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Cálculo Diferencial', '2026-07-29', 950000.0, 'ACTIVA'
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Estadística Aplicada', '2026-07-22', 900000.0, 'ACTIVA'
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Matemáticas Discretas', '2026-07-15', 650000.0, 'ACTIVA'
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Bases de Datos Relacionales', '2026-08-03', 1100000.0, 'ACTIVA'
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Desarrollo Web con React', '2026-07-17', 1300000.0, 'ACTIVA'
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Diseño de Interfaces (UX/UI)', '2026-10-21', 800000.0, 'ACTIVA'
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Fundamentos de Programación', '2026-07-24', 1200000.0, 'ACTIVA'
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Cálculo Diferencial', '2026-07-18', 950000.0, 'ACTIVA'
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Redes de Computadores', '2026-07-29', 1000000.0, 'ACTIVA'
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Estructuras de Datos', '2026-01-20', 1100000.0, 'INACTIVA'
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Estadística Aplicada', '2026-08-05', 900000.0, 'ACTIVA'
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Desarrollo Web con React', '2026-07-30', 1300000.0, 'ACTIVA'
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Estructuras de Datos', '2026-01-30', 1100000.0, 'INACTIVA'
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Fundamentos de Programación', '2026-07-25', 1200000.0, 'ACTIVA'
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Matemáticas Discretas', '2026-07-21', 650000.0, 'ACTIVA'
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Fundamentos de Programación', '2026-07-27', 1200000.0, 'ACTIVA'
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Bases de Datos Relacionales', '2026-07-23', 1100000.0, 'ACTIVA'
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Cálculo Diferencial', '2026-07-26', 950000.0, 'ACTIVA'
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Estructuras de Datos', '2026-01-25', 1100000.0, 'INACTIVA'
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Redes de Computadores', '2026-07-27', 1000000.0, 'ACTIVA'
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Desarrollo Web con React', '2026-08-07', 1300000.0, 'ACTIVA'
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Matemáticas Discretas', '2026-07-31', 650000.0, 'INACTIVA'
  UNION ALL SELECT 'tomas.agudelo@edusoft.test', 'Fundamentos de Programación', '2026-08-04', 1200000.0, 'INACTIVA'
) t
JOIN usuarios u ON u.correo = t.correo
JOIN cursos c ON c.titulo = t.curso;

-- ------------------------------------------------------------
-- 5. Notas (escala 0.0 a 5.0; incluye notas bajas para probar promedios)
-- ------------------------------------------------------------
INSERT INTO notas (usuario_id, curso_id, tipo_examen, nota, fecha_examen, observaciones)
SELECT u.id, c.id, t.tipo, t.nota, t.fecha, t.obs
FROM (
  SELECT 'valentina.arango@edusoft.test' AS correo, 'Fundamentos de Programación' AS curso, 'Quiz' AS tipo, 3.9 AS nota, '2026-09-08' AS fecha, NULL AS obs
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Fundamentos de Programación', 'Taller', 4.3, '2026-09-29', 'Excelente participación'
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Fundamentos de Programación', 'Parcial', 4.8, '2026-10-15', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Bases de Datos Relacionales', 'Quiz', 4.3, '2026-09-08', NULL
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Bases de Datos Relacionales', 'Taller', 2.4, '2026-09-29', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Bases de Datos Relacionales', 'Parcial', 4.4, '2026-10-15', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Desarrollo Web con React', 'Quiz', 3.8, '2026-09-08', 'Debe reforzar los temas vistos'
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Desarrollo Web con React', 'Taller', 4.7, '2026-09-29', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Desarrollo Web con React', 'Parcial', 4.8, '2026-10-15', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Fundamentos de Programación', 'Quiz', 4.1, '2026-09-08', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Fundamentos de Programación', 'Taller', 2.4, '2026-09-29', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Fundamentos de Programación', 'Parcial', 4.9, '2026-10-15', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Cálculo Diferencial', 'Quiz', 3.8, '2026-09-08', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Cálculo Diferencial', 'Taller', 2.0, '2026-09-29', 'Buen desempeño'
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Cálculo Diferencial', 'Parcial', 4.9, '2026-10-15', NULL
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Redes de Computadores', 'Quiz', 4.9, '2026-09-08', NULL
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Redes de Computadores', 'Taller', 3.6, '2026-09-29', NULL
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Redes de Computadores', 'Parcial', 4.3, '2026-10-15', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Fundamentos de Programación', 'Quiz', 2.7, '2026-09-08', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Fundamentos de Programación', 'Taller', 2.8, '2026-09-29', NULL
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Fundamentos de Programación', 'Parcial', 3.6, '2026-10-15', NULL
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Bases de Datos Relacionales', 'Quiz', 3.6, '2026-09-08', NULL
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Bases de Datos Relacionales', 'Taller', 2.4, '2026-09-29', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Estadística Aplicada', 'Quiz', 3.6, '2026-09-08', NULL
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Estadística Aplicada', 'Taller', 4.1, '2026-09-29', NULL
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Estadística Aplicada', 'Parcial', 5.0, '2026-10-15', 'Debe reforzar los temas vistos'
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Bases de Datos Relacionales', 'Quiz', 4.2, '2026-09-08', NULL
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Bases de Datos Relacionales', 'Taller', 4.9, '2026-09-29', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Bases de Datos Relacionales', 'Parcial', 4.0, '2026-10-15', 'Excelente participación'
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Desarrollo Web con React', 'Quiz', 4.3, '2026-09-08', 'Buen desempeño'
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Desarrollo Web con React', 'Taller', 4.5, '2026-09-29', NULL
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Redes de Computadores', 'Quiz', 3.8, '2026-09-08', NULL
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Redes de Computadores', 'Taller', 4.7, '2026-09-29', NULL
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Redes de Computadores', 'Parcial', 4.6, '2026-10-15', NULL
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Estructuras de Datos', 'Parcial', 3.9, '2026-04-14', 'Excelente participación'
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Estructuras de Datos', 'Final', 4.4, '2026-06-02', 'Excelente participación'
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Fundamentos de Programación', 'Quiz', 2.5, '2026-09-08', 'Excelente participación'
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Fundamentos de Programación', 'Taller', 4.9, '2026-09-29', NULL
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Fundamentos de Programación', 'Parcial', 2.3, '2026-10-15', 'Debe reforzar los temas vistos'
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Estadística Aplicada', 'Quiz', 4.8, '2026-09-08', 'Buen desempeño'
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Estadística Aplicada', 'Taller', 2.4, '2026-09-29', NULL
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Estadística Aplicada', 'Parcial', 3.8, '2026-10-15', 'Excelente participación'
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Desarrollo Web con React', 'Quiz', 3.5, '2026-09-08', NULL
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Desarrollo Web con React', 'Taller', 4.5, '2026-09-29', 'Debe reforzar los temas vistos'
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Cálculo Diferencial', 'Quiz', 4.3, '2026-09-08', NULL
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Cálculo Diferencial', 'Taller', 4.7, '2026-09-29', 'Excelente participación'
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Cálculo Diferencial', 'Parcial', 3.4, '2026-10-15', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Estadística Aplicada', 'Quiz', 3.6, '2026-09-08', 'Excelente participación'
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Estadística Aplicada', 'Taller', 3.3, '2026-09-29', 'Excelente participación'
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Estadística Aplicada', 'Parcial', 4.2, '2026-10-15', 'Buen desempeño'
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Matemáticas Discretas', 'Quiz', 4.2, '2026-09-08', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Matemáticas Discretas', 'Taller', 3.5, '2026-09-29', NULL
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Matemáticas Discretas', 'Parcial', 4.3, '2026-10-15', NULL
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Bases de Datos Relacionales', 'Quiz', 3.5, '2026-09-08', NULL
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Bases de Datos Relacionales', 'Taller', 1.9, '2026-09-29', 'Buen desempeño'
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Bases de Datos Relacionales', 'Parcial', 3.6, '2026-10-15', NULL
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Desarrollo Web con React', 'Quiz', 3.8, '2026-09-08', NULL
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Desarrollo Web con React', 'Taller', 2.0, '2026-09-29', 'Excelente participación'
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Desarrollo Web con React', 'Parcial', 2.1, '2026-10-15', 'Excelente participación'
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Fundamentos de Programación', 'Quiz', 4.6, '2026-09-08', NULL
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Fundamentos de Programación', 'Taller', 3.6, '2026-09-29', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Cálculo Diferencial', 'Quiz', 5.0, '2026-09-08', 'Debe reforzar los temas vistos'
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Cálculo Diferencial', 'Taller', 3.9, '2026-09-29', 'Excelente participación'
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Redes de Computadores', 'Quiz', 3.7, '2026-09-08', 'Buen desempeño'
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Redes de Computadores', 'Taller', 4.0, '2026-09-29', 'Buen desempeño'
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Redes de Computadores', 'Parcial', 2.6, '2026-10-15', 'Excelente participación'
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Estructuras de Datos', 'Parcial', 3.8, '2026-04-14', 'Buen desempeño'
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Estructuras de Datos', 'Final', 3.8, '2026-06-02', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Estadística Aplicada', 'Quiz', 2.2, '2026-09-08', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Estadística Aplicada', 'Taller', 4.0, '2026-09-29', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Estadística Aplicada', 'Parcial', 4.6, '2026-10-15', NULL
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Desarrollo Web con React', 'Quiz', 4.6, '2026-09-08', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Desarrollo Web con React', 'Taller', 3.8, '2026-09-29', 'Excelente participación'
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Desarrollo Web con React', 'Parcial', 2.0, '2026-10-15', 'Buen desempeño'
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Estructuras de Datos', 'Parcial', 3.0, '2026-04-14', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Estructuras de Datos', 'Final', 3.5, '2026-06-02', NULL
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Fundamentos de Programación', 'Quiz', 3.3, '2026-09-08', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Fundamentos de Programación', 'Taller', 4.0, '2026-09-29', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Matemáticas Discretas', 'Quiz', 4.2, '2026-09-08', 'Debe reforzar los temas vistos'
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Matemáticas Discretas', 'Taller', 4.2, '2026-09-29', 'Debe reforzar los temas vistos'
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Matemáticas Discretas', 'Parcial', 3.5, '2026-10-15', 'Muestra mejoría frente a la nota anterior'
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Fundamentos de Programación', 'Quiz', 4.4, '2026-09-08', 'Excelente participación'
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Fundamentos de Programación', 'Taller', 3.4, '2026-09-29', 'Debe reforzar los temas vistos'
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Bases de Datos Relacionales', 'Quiz', 3.6, '2026-09-08', NULL
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Bases de Datos Relacionales', 'Taller', 3.3, '2026-09-29', 'Debe reforzar los temas vistos'
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Cálculo Diferencial', 'Quiz', 4.5, '2026-09-08', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Cálculo Diferencial', 'Taller', 3.9, '2026-09-29', NULL
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Cálculo Diferencial', 'Parcial', 2.7, '2026-10-15', 'Debe reforzar los temas vistos'
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Estructuras de Datos', 'Parcial', 3.7, '2026-04-14', NULL
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Estructuras de Datos', 'Final', 3.2, '2026-06-02', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Redes de Computadores', 'Quiz', 3.6, '2026-09-08', 'Excelente participación'
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Redes de Computadores', 'Taller', 4.5, '2026-09-29', NULL
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Redes de Computadores', 'Parcial', 3.6, '2026-10-15', 'Excelente participación'
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Desarrollo Web con React', 'Quiz', 4.7, '2026-09-08', 'Entregó fuera de tiempo'
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Desarrollo Web con React', 'Taller', 4.5, '2026-09-29', 'Buen desempeño'
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Desarrollo Web con React', 'Parcial', 4.6, '2026-10-15', 'Buen desempeño'
) t
JOIN usuarios u ON u.correo = t.correo
JOIN cursos c ON c.titulo = t.curso;

-- ------------------------------------------------------------
-- 6. Asistencias (3 sesiones por curso vigente; algunas ausencias)
-- ------------------------------------------------------------
INSERT INTO asistencia (usuario_id, curso_id, fecha, hora_entrada, asistio)
SELECT u.id, c.id, t.fecha, t.hora, t.asistio
FROM (
  SELECT 'valentina.arango@edusoft.test' AS correo, 'Fundamentos de Programación' AS curso, '2026-10-22' AS fecha, NULL AS hora, 0 AS asistio
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Fundamentos de Programación', '2026-10-27', '07:00:00', 1
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Fundamentos de Programación', '2026-10-29', NULL, 0
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Bases de Datos Relacionales', '2026-10-22', '09:00:00', 1
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Bases de Datos Relacionales', '2026-10-27', '08:57:00', 1
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Bases de Datos Relacionales', '2026-10-29', '08:55:00', 1
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Desarrollo Web con React', '2026-10-22', '14:00:00', 1
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Desarrollo Web con React', '2026-10-27', '14:02:00', 1
  UNION ALL SELECT 'valentina.arango@edusoft.test', 'Desarrollo Web con React', '2026-10-29', '13:55:00', 1
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Fundamentos de Programación', '2026-10-22', '07:05:00', 1
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Fundamentos de Programación', '2026-10-27', '07:00:00', 1
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Fundamentos de Programación', '2026-10-29', '06:57:00', 1
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Cálculo Diferencial', '2026-10-22', '07:05:00', 1
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Cálculo Diferencial', '2026-10-27', '07:00:00', 1
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Cálculo Diferencial', '2026-10-29', '07:00:00', 1
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Redes de Computadores', '2026-10-22', '10:02:00', 1
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Redes de Computadores', '2026-10-27', '10:00:00', 1
  UNION ALL SELECT 'santiago.cardona@edusoft.test', 'Redes de Computadores', '2026-10-29', NULL, 0
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Fundamentos de Programación', '2026-10-22', '06:57:00', 1
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Fundamentos de Programación', '2026-10-27', '06:57:00', 1
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Fundamentos de Programación', '2026-10-29', '07:00:00', 1
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Bases de Datos Relacionales', '2026-10-22', '09:02:00', 1
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Bases de Datos Relacionales', '2026-10-27', '08:55:00', 1
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Bases de Datos Relacionales', '2026-10-29', NULL, 0
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Estadística Aplicada', '2026-10-22', '18:00:00', 1
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Estadística Aplicada', '2026-10-27', '18:05:00', 1
  UNION ALL SELECT 'daniela.henao@edusoft.test', 'Estadística Aplicada', '2026-10-29', '18:00:00', 1
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Bases de Datos Relacionales', '2026-10-22', '09:12:00', 1
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Bases de Datos Relacionales', '2026-10-27', '09:12:00', 1
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Bases de Datos Relacionales', '2026-10-29', '08:55:00', 1
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Desarrollo Web con React', '2026-10-22', '14:00:00', 1
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Desarrollo Web con React', '2026-10-27', '14:02:00', 1
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Desarrollo Web con React', '2026-10-29', '14:02:00', 1
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Redes de Computadores', '2026-10-22', NULL, 0
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Redes de Computadores', '2026-10-27', '10:00:00', 1
  UNION ALL SELECT 'mateo.giraldo@edusoft.test', 'Redes de Computadores', '2026-10-29', '10:12:00', 1
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Fundamentos de Programación', '2026-10-22', '07:00:00', 1
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Fundamentos de Programación', '2026-10-27', '07:02:00', 1
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Fundamentos de Programación', '2026-10-29', '07:00:00', 1
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Estadística Aplicada', '2026-10-22', '17:55:00', 1
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Estadística Aplicada', '2026-10-27', '17:57:00', 1
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Estadística Aplicada', '2026-10-29', '18:00:00', 1
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Desarrollo Web con React', '2026-10-22', '13:55:00', 1
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Desarrollo Web con React', '2026-10-27', '13:55:00', 1
  UNION ALL SELECT 'isabella.montoya@edusoft.test', 'Desarrollo Web con React', '2026-10-29', '14:02:00', 1
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Cálculo Diferencial', '2026-10-22', '07:12:00', 1
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Cálculo Diferencial', '2026-10-27', NULL, 0
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Cálculo Diferencial', '2026-10-29', '07:00:00', 1
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Estadística Aplicada', '2026-10-22', NULL, 0
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Estadística Aplicada', '2026-10-27', '18:05:00', 1
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Estadística Aplicada', '2026-10-29', NULL, 0
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Matemáticas Discretas', '2026-10-22', '18:00:00', 1
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Matemáticas Discretas', '2026-10-27', '18:12:00', 1
  UNION ALL SELECT 'samuel.londono@edusoft.test', 'Matemáticas Discretas', '2026-10-29', NULL, 0
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Bases de Datos Relacionales', '2026-10-22', '09:00:00', 1
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Bases de Datos Relacionales', '2026-10-27', '08:57:00', 1
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Bases de Datos Relacionales', '2026-10-29', '09:12:00', 1
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Desarrollo Web con React', '2026-10-22', '14:00:00', 1
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Desarrollo Web con React', '2026-10-27', '14:00:00', 1
  UNION ALL SELECT 'camila.usuga@edusoft.test', 'Desarrollo Web con React', '2026-10-29', '14:00:00', 1
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Fundamentos de Programación', '2026-10-22', NULL, 0
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Fundamentos de Programación', '2026-10-27', '06:55:00', 1
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Fundamentos de Programación', '2026-10-29', '07:12:00', 1
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Cálculo Diferencial', '2026-10-22', '06:57:00', 1
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Cálculo Diferencial', '2026-10-27', NULL, 0
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Cálculo Diferencial', '2026-10-29', '07:12:00', 1
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Redes de Computadores', '2026-10-22', '10:05:00', 1
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Redes de Computadores', '2026-10-27', '10:00:00', 1
  UNION ALL SELECT 'juan.quintero@edusoft.test', 'Redes de Computadores', '2026-10-29', '10:02:00', 1
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Estadística Aplicada', '2026-10-22', '18:02:00', 1
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Estadística Aplicada', '2026-10-27', '18:00:00', 1
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Estadística Aplicada', '2026-10-29', '18:02:00', 1
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Desarrollo Web con React', '2026-10-22', '13:57:00', 1
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Desarrollo Web con React', '2026-10-27', '14:12:00', 1
  UNION ALL SELECT 'sofia.betancur@edusoft.test', 'Desarrollo Web con React', '2026-10-29', '13:55:00', 1
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Fundamentos de Programación', '2026-10-22', '07:00:00', 1
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Fundamentos de Programación', '2026-10-27', '06:55:00', 1
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Fundamentos de Programación', '2026-10-29', '06:55:00', 1
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Matemáticas Discretas', '2026-10-22', '18:12:00', 1
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Matemáticas Discretas', '2026-10-27', '18:00:00', 1
  UNION ALL SELECT 'nicolas.echeverri@edusoft.test', 'Matemáticas Discretas', '2026-10-29', NULL, 0
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Fundamentos de Programación', '2026-10-22', '06:57:00', 1
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Fundamentos de Programación', '2026-10-27', NULL, 0
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Fundamentos de Programación', '2026-10-29', '07:05:00', 1
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Bases de Datos Relacionales', '2026-10-22', NULL, 0
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Bases de Datos Relacionales', '2026-10-27', '09:02:00', 1
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Bases de Datos Relacionales', '2026-10-29', '09:00:00', 1
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Cálculo Diferencial', '2026-10-22', '06:55:00', 1
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Cálculo Diferencial', '2026-10-27', '07:05:00', 1
  UNION ALL SELECT 'mariana.cano@edusoft.test', 'Cálculo Diferencial', '2026-10-29', '07:02:00', 1
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Redes de Computadores', '2026-10-22', '09:55:00', 1
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Redes de Computadores', '2026-10-27', NULL, 0
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Redes de Computadores', '2026-10-29', NULL, 0
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Desarrollo Web con React', '2026-10-22', NULL, 0
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Desarrollo Web con React', '2026-10-27', '14:00:00', 1
  UNION ALL SELECT 'andres.munoz@edusoft.test', 'Desarrollo Web con React', '2026-10-29', '13:55:00', 1
) t
JOIN usuarios u ON u.correo = t.correo
JOIN cursos c ON c.titulo = t.curso;

-- ------------------------------------------------------------
-- 7. Notificaciones
-- ------------------------------------------------------------
INSERT INTO notificaciones (remitente_id, destinatario_id, asunto, cuerpo, tipo, prioridad, curso_id, creada_en)
SELECT r.id, d.id, t.asunto, t.cuerpo, t.tipo, t.prioridad, c.id, t.creada
FROM (
  SELECT 'julian.ospina@edusoft.test' AS remitente, 'valentina.arango@edusoft.test' AS destinatario, 'Entrega del taller de React' AS asunto, 'Recuerda subir el taller de hooks antes del viernes a las 11:59 p. m.' AS cuerpo, 'Academica' AS tipo, 'Media' AS prioridad, 'Desarrollo Web con React' AS curso, '2026-10-26 08:30:00' AS creada
  UNION ALL SELECT 'julian.ospina@edusoft.test', 'mateo.giraldo@edusoft.test', 'Entrega del taller de React', 'Recuerda subir el taller de hooks antes del viernes a las 11:59 p. m.', 'Academica', 'Media', 'Desarrollo Web con React', '2026-10-26 08:31:00'
  UNION ALL SELECT 'carlos.restrepo@edusoft.test', 'daniela.henao@edusoft.test', 'Cambio de salón', 'La clase de Bases de Datos del jueves será en el laboratorio 3.', 'Informativa', 'Baja', 'Bases de Datos Relacionales', '2026-10-27 15:10:00'
  UNION ALL SELECT 'carlos.restrepo@edusoft.test', 'juan.quintero@edusoft.test', 'Parcial de Fundamentos de Programación', 'El parcial será el 5 de noviembre. Se evalúan funciones y arreglos.', 'Urgente', 'Alta', 'Fundamentos de Programación', '2026-10-28 10:00:00'
  UNION ALL SELECT 'carlos.restrepo@edusoft.test', 'isabella.montoya@edusoft.test', 'Parcial de Fundamentos de Programación', 'El parcial será el 5 de noviembre. Se evalúan funciones y arreglos.', 'Urgente', 'Alta', 'Fundamentos de Programación', '2026-10-28 10:01:00'
  UNION ALL SELECT 'maria.gomez@edusoft.test', 'samuel.londono@edusoft.test', 'Resultados del quiz', 'Ya están publicadas las notas del quiz de límites. Revisa tus observaciones.', 'Academica', 'Media', 'Cálculo Diferencial', '2026-10-20 17:45:00'
  UNION ALL SELECT 'maria.gomez@edusoft.test', 'camila.usuga@edusoft.test', 'Material de apoyo', 'Subí a la plataforma la guía de ejercicios de estadística inferencial.', 'Informativa', 'Baja', 'Estadística Aplicada', '2026-10-21 19:00:00'
  UNION ALL SELECT 'maria.gomez@edusoft.test', 'andres.munoz@edusoft.test', 'Matrícula inactiva en Matemáticas Discretas', 'Tu matrícula figura como inactiva. Comunícate con secretaría académica.', 'Administrativa', 'Alta', 'Matemáticas Discretas', '2026-10-23 09:20:00'
  UNION ALL SELECT 'julian.ospina@edusoft.test', 'santiago.cardona@edusoft.test', 'Práctica de laboratorio de redes', 'Trae el cable de red y la laptop para la práctica de direccionamiento IP.', 'Informativa', 'Media', 'Redes de Computadores', '2026-10-29 07:45:00'
  UNION ALL SELECT 'laura.zapata@edusoft.test', 'carlos.restrepo@edusoft.test', 'Reunión de profesores', 'Reunión de cierre de periodo el viernes a las 3:00 p. m. en la sala de juntas.', 'Administrativa', 'Media', NULL, '2026-10-30 11:00:00'
  UNION ALL SELECT 'laura.zapata@edusoft.test', 'maria.gomez@edusoft.test', 'Reunión de profesores', 'Reunión de cierre de periodo el viernes a las 3:00 p. m. en la sala de juntas.', 'Administrativa', 'Media', NULL, '2026-10-30 11:01:00'
  UNION ALL SELECT 'laura.zapata@edusoft.test', 'julian.ospina@edusoft.test', 'Reunión de profesores', 'Reunión de cierre de periodo el viernes a las 3:00 p. m. en la sala de juntas.', 'Administrativa', 'Media', NULL, '2026-10-30 11:02:00'
  UNION ALL SELECT 'carlos.restrepo@edusoft.test', 'sofia.betancur@edusoft.test', 'Notas definitivas de Estructuras de Datos', 'Las notas finales del semestre anterior ya están cargadas en el sistema.', 'Informativa', 'Baja', 'Estructuras de Datos', '2026-06-15 14:00:00'
  UNION ALL SELECT 'julian.ospina@edusoft.test', 'camila.usuga@edusoft.test', 'Inscripción a Diseño de Interfaces', 'Tu preinscripción para el próximo semestre quedó registrada.', 'Administrativa', 'Baja', 'Diseño de Interfaces (UX/UI)', '2026-10-31 16:20:00'
  UNION ALL SELECT 'carlos.restrepo@edusoft.test', 'nicolas.echeverri@edusoft.test', 'Tutoría disponible', 'Hay tutorías de refuerzo los martes a las 4:00 p. m. Es opcional pero muy recomendable.', 'Academica', 'Media', 'Fundamentos de Programación', '2026-11-02 09:00:00'
) t
JOIN usuarios r ON r.correo = t.remitente
JOIN usuarios d ON d.correo = t.destinatario
LEFT JOIN cursos c ON c.titulo = t.curso;

COMMIT;

-- ------------------------------------------------------------
-- Verificación rápida (cantidades esperadas)
-- ------------------------------------------------------------
-- usuarios de prueba ..... 17
-- profesor_perfil ........ 3
-- cursos ................. 9
-- matriculas ............. 40
-- notas .................. 96
-- asistencia ............. 96
-- notificaciones ......... 15
SELECT 'usuarios' AS tabla, COUNT(*) AS filas FROM usuarios WHERE correo LIKE '%@edusoft.test'
UNION ALL SELECT 'profesor_perfil', COUNT(*) FROM profesor_perfil WHERE usuario_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test')
UNION ALL SELECT 'cursos', COUNT(*) FROM cursos WHERE profesor_id IN (SELECT id FROM profesor_perfil WHERE usuario_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test'))
UNION ALL SELECT 'matriculas', COUNT(*) FROM matriculas WHERE usuario_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test')
UNION ALL SELECT 'notas', COUNT(*) FROM notas WHERE usuario_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test')
UNION ALL SELECT 'asistencia', COUNT(*) FROM asistencia WHERE usuario_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test')
UNION ALL SELECT 'notificaciones', COUNT(*) FROM notificaciones WHERE remitente_id IN (SELECT id FROM usuarios WHERE correo LIKE '%@edusoft.test');
