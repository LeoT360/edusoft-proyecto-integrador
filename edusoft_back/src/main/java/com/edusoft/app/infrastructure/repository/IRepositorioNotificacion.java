package com.edusoft.app.infrastructure.repository;

import com.edusoft.app.domain.models.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** Acceso a datos de notificaciones mediante Spring Data JPA. */
@Repository
public interface IRepositorioNotificacion extends JpaRepository<Notificacion, Integer> {

    /** Notificaciones enviadas o recibidas por un usuario. */
    long countByRemitenteIdOrDestinatarioId(Integer remitenteId, Integer destinatarioId);

    long countByCursoId(Integer cursoId);
}
