package com.edusoft.app.infrastructure.repository;

import com.edusoft.app.domain.models.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** Acceso a datos de asistencias mediante Spring Data JPA. */
@Repository
public interface IRepositorioAsistencia extends JpaRepository<Asistencia, Integer> {

    long countByUsuarioId(Integer usuarioId);

    long countByCursoId(Integer cursoId);
}
