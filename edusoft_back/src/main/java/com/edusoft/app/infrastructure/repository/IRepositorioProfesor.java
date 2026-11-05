package com.edusoft.app.infrastructure.repository;

import com.edusoft.app.domain.models.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/** Acceso a datos de perfiles de profesor mediante Spring Data JPA. */
@Repository
public interface IRepositorioProfesor extends JpaRepository<Profesor, Integer> {
    Optional<Profesor> findByUsuarioId(Integer usuarioId);

    /**
     * Nombre del usuario dueño del perfil. Es una consulta escalar a propósito: no carga el
     * {@code Usuario} en el contexto de persistencia, lo que evitaría problemas al borrar el perfil.
     */
    @Query("select p.usuario.nombre from Profesor p where p.id = :id")
    Optional<String> findNombreById(@Param("id") Integer id);
}
