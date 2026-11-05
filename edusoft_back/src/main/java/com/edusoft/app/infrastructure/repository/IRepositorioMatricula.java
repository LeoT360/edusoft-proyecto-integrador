package com.edusoft.app.infrastructure.repository;

import com.edusoft.app.domain.models.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** Acceso a datos de matrículas mediante Spring Data JPA. */
@Repository
public interface IRepositorioMatricula extends JpaRepository<Matricula, Integer> {

    long countByUsuarioId(Integer usuarioId);

    long countByCursoId(Integer cursoId);

    boolean existsByUsuarioIdAndCursoId(Integer usuarioId, Integer cursoId);

    boolean existsByUsuarioIdAndCursoIdAndIdNot(Integer usuarioId, Integer cursoId, Integer id);
}
