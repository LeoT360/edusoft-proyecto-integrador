package com.edusoft.app.infrastructure.repository;

import com.edusoft.app.domain.models.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** Acceso a datos de cursos mediante Spring Data JPA. */
@Repository
public interface IRepositorioCurso extends JpaRepository<Curso, Integer> {

    long countByProfesorId(Integer profesorId);
}
