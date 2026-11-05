package com.edusoft.app.infrastructure.repository;

import com.edusoft.app.domain.models.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/** Acceso a datos de notas mediante Spring Data JPA. */
@Repository
public interface IRepositorioNota extends JpaRepository<Nota, Integer> {

    List<Nota> findByUsuarioCorreoIgnoreCase(String correo);

    long countByUsuarioId(Integer usuarioId);

    long countByCursoId(Integer cursoId);
}
