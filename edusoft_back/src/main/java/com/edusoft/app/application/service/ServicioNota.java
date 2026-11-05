package com.edusoft.app.application.service;

import com.edusoft.app.application.dto.nota.NotaRequest;
import com.edusoft.app.application.dto.nota.NotaResponse;
import com.edusoft.app.domain.exceptions.ResourceNotFoundException;
import com.edusoft.app.domain.models.Curso;
import com.edusoft.app.domain.models.Nota;
import com.edusoft.app.domain.models.Usuario;
import com.edusoft.app.infrastructure.repository.IRepositorioCurso;
import com.edusoft.app.infrastructure.repository.IRepositorioNota;
import com.edusoft.app.infrastructure.repository.IRepositorioUsuario;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Casos de uso de notas: crear, consultar, actualizar y eliminar, validando que las entidades relacionadas existan. */
@Service
@Transactional
public class ServicioNota {

    private final IRepositorioNota repositorio;
    private final IRepositorioUsuario repositorioUsuario;
    private final IRepositorioCurso repositorioCurso;

    public ServicioNota(IRepositorioNota repositorio,
                        IRepositorioUsuario repositorioUsuario,
                        IRepositorioCurso repositorioCurso) {
        this.repositorio = repositorio;
        this.repositorioUsuario = repositorioUsuario;
        this.repositorioCurso = repositorioCurso;
    }

    public NotaResponse guardar(NotaRequest request) {
        Nota entity = new Nota();
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public NotaResponse actualizar(Integer id, NotaRequest request) {
        Nota entity = repositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota no encontrada: " + id));
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public List<NotaResponse> buscarTodos() {
        return repositorio.findAll().stream().map(this::toResponse).toList();
    }

    public List<NotaResponse> buscarPorEmail(String email) {
        return repositorio.findByUsuarioCorreoIgnoreCase(email).stream()
                .map(this::toResponse)
                .toList();
    }

    public NotaResponse buscarPorId(Integer id) {
        return repositorio.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Nota no encontrada: " + id));
    }

    public void eliminar(Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResourceNotFoundException("Nota no encontrada: " + id);
        }
        repositorio.deleteById(id);
    }

    /** Copia los datos del request a la entidad, resolviendo las entidades relacionadas. */
    private void apply(NotaRequest request, Nota entity) {
        Usuario usuario = repositorioUsuario.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + request.getIdUsuario()));
        Curso curso = repositorioCurso.findById(request.getIdCurso())
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + request.getIdCurso()));
        entity.setUsuario(usuario);
        entity.setCurso(curso);
        entity.setTipoExamen(request.getTipoExamen());
        entity.setNota(request.getNota());
        entity.setFechaExamen(request.getFechaExamen());
        entity.setObservaciones(request.getObservaciones());
    }

    /** Convierte la entidad en el DTO de respuesta. */
    private NotaResponse toResponse(Nota entity) {
        NotaResponse r = new NotaResponse();
        r.setId(entity.getId());
        r.setTipoExamen(entity.getTipoExamen());
        r.setNota(entity.getNota());
        r.setFechaExamen(entity.getFechaExamen());
        r.setObservaciones(entity.getObservaciones());
        if (entity.getUsuario() != null) {
            r.setIdUsuario(entity.getUsuario().getId());
            r.setNombreEstudiante(entity.getUsuario().getNombre());
        }
        if (entity.getCurso() != null) {
            r.setIdCurso(entity.getCurso().getId());
            r.setTituloCurso(entity.getCurso().getTitulo());
        }
        return r;
    }
}
