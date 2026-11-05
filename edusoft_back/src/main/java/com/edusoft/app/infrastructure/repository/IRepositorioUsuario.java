package com.edusoft.app.infrastructure.repository;

import com.edusoft.app.domain.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/** Acceso a datos de usuarios mediante Spring Data JPA. */
@Repository
public interface IRepositorioUsuario extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByCorreoIgnoreCase(String correo);
}
