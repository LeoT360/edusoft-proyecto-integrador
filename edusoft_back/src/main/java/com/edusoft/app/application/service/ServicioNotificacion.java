package com.edusoft.app.application.service;

import com.edusoft.app.application.dto.notificacion.NotificacionRequest;
import com.edusoft.app.application.dto.notificacion.NotificacionResponse;
import com.edusoft.app.domain.exceptions.ResourceNotFoundException;
import com.edusoft.app.domain.models.Curso;
import com.edusoft.app.domain.models.Notificacion;
import com.edusoft.app.domain.models.Usuario;
import com.edusoft.app.infrastructure.repository.IRepositorioCurso;
import com.edusoft.app.infrastructure.repository.IRepositorioNotificacion;
import com.edusoft.app.infrastructure.repository.IRepositorioUsuario;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/** Casos de uso de notificaciones: crear, consultar, actualizar y eliminar, validando que las entidades relacionadas existan. */
@Service
@Transactional
public class ServicioNotificacion {

    private final IRepositorioNotificacion repositorio;
    private final IRepositorioUsuario repositorioUsuario;
    private final IRepositorioCurso repositorioCurso;

    public ServicioNotificacion(IRepositorioNotificacion repositorio,
                                IRepositorioUsuario repositorioUsuario,
                                IRepositorioCurso repositorioCurso) {
        this.repositorio = repositorio;
        this.repositorioUsuario = repositorioUsuario;
        this.repositorioCurso = repositorioCurso;
    }

    public NotificacionResponse guardar(NotificacionRequest request) {
        Notificacion entity = new Notificacion();
        apply(request, entity);
        if (entity.getCreadaEn() == null) {
            entity.setCreadaEn(LocalDateTime.now());
        }
        return toResponse(repositorio.save(entity));
    }

    public NotificacionResponse actualizar(Integer id, NotificacionRequest request) {
        Notificacion entity = repositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada: " + id));
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public List<NotificacionResponse> buscarTodos() {
        return repositorio.findAll().stream().map(this::toResponse).toList();
    }

    public NotificacionResponse buscarPorId(Integer id) {
        return repositorio.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada: " + id));
    }

    public void eliminar(Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResourceNotFoundException("Notificación no encontrada: " + id);
        }
        repositorio.deleteById(id);
    }

    /** Copia los datos del request a la entidad, resolviendo las entidades relacionadas. */
    private void apply(NotificacionRequest request, Notificacion entity) {
        Usuario remitente = repositorioUsuario.findById(request.getIdRemitente())
                .orElseThrow(() -> new ResourceNotFoundException("Remitente no encontrado"));
        Usuario destinatario = repositorioUsuario.findById(request.getIdDestinatario())
                .orElseThrow(() -> new ResourceNotFoundException("Destinatario no encontrado"));
        entity.setRemitente(remitente);
        entity.setDestinatario(destinatario);
        entity.setAsunto(request.getAsunto());
        entity.setCuerpo(request.getCuerpo());
        entity.setTipo(request.getTipo());
        entity.setPrioridad(request.getPrioridad());
        if (request.getIdCurso() != null) {
            Curso curso = repositorioCurso.findById(request.getIdCurso())
                    .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado"));
            entity.setCurso(curso);
        } else {
            entity.setCurso(null);
        }
    }

    /** Convierte la entidad en el DTO de respuesta. */
    private NotificacionResponse toResponse(Notificacion entity) {
        NotificacionResponse r = new NotificacionResponse();
        r.setId(entity.getId());
        r.setAsunto(entity.getAsunto());
        r.setCuerpo(entity.getCuerpo());
        r.setTipo(entity.getTipo());
        r.setPrioridad(entity.getPrioridad());
        r.setCreadaEn(entity.getCreadaEn());
        if (entity.getRemitente() != null) {
            r.setIdRemitente(entity.getRemitente().getId());
            r.setNombreRemitente(entity.getRemitente().getNombre());
        }
        if (entity.getDestinatario() != null) {
            r.setIdDestinatario(entity.getDestinatario().getId());
            r.setNombreDestinatario(entity.getDestinatario().getNombre());
        }
        if (entity.getCurso() != null) {
            r.setIdCurso(entity.getCurso().getId());
            r.setTituloCurso(entity.getCurso().getTitulo());
        }
        return r;
    }
}
