package com.edusoft.app.application.service;

import com.edusoft.app.application.dto.asistencia.AsistenciaRequest;
import com.edusoft.app.application.dto.asistencia.AsistenciaResponse;
import com.edusoft.app.domain.exceptions.ResourceNotFoundException;
import com.edusoft.app.domain.models.Asistencia;
import com.edusoft.app.domain.models.Curso;
import com.edusoft.app.domain.models.Usuario;
import com.edusoft.app.infrastructure.repository.IRepositorioAsistencia;
import com.edusoft.app.infrastructure.repository.IRepositorioCurso;
import com.edusoft.app.infrastructure.repository.IRepositorioUsuario;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Casos de uso de asistencias: crear, consultar, actualizar y eliminar, validando que las entidades relacionadas existan. */
@Service
@Transactional
public class ServicioAsistencia {

    private final IRepositorioAsistencia repositorio;
    private final IRepositorioUsuario repositorioUsuario;
    private final IRepositorioCurso repositorioCurso;

    public ServicioAsistencia(IRepositorioAsistencia repositorio,
                              IRepositorioUsuario repositorioUsuario,
                              IRepositorioCurso repositorioCurso) {
        this.repositorio = repositorio;
        this.repositorioUsuario = repositorioUsuario;
        this.repositorioCurso = repositorioCurso;
    }

    public AsistenciaResponse guardar(AsistenciaRequest request) {
        Asistencia entity = new Asistencia();
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public AsistenciaResponse actualizar(Integer id, AsistenciaRequest request) {
        Asistencia entity = repositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asistencia no encontrada: " + id));
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public List<AsistenciaResponse> buscarTodos() {
        return repositorio.findAll().stream().map(this::toResponse).toList();
    }

    public AsistenciaResponse buscarPorId(Integer id) {
        return repositorio.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Asistencia no encontrada: " + id));
    }

    public void eliminar(Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResourceNotFoundException("Asistencia no encontrada: " + id);
        }
        repositorio.deleteById(id);
    }

    /** Copia los datos del request a la entidad, resolviendo las entidades relacionadas. */
    private void apply(AsistenciaRequest request, Asistencia entity) {
        Usuario usuario = repositorioUsuario.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + request.getIdUsuario()));
        Curso curso = repositorioCurso.findById(request.getIdCurso())
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + request.getIdCurso()));
        entity.setUsuario(usuario);
        entity.setCurso(curso);
        entity.setFecha(request.getFecha());
        entity.setHoraEntrada(request.getHoraEntrada());
        entity.setAsistio(request.getAsistio() != null ? request.getAsistio() : true);
    }

    /** Convierte la entidad en el DTO de respuesta. */
    private AsistenciaResponse toResponse(Asistencia entity) {
        AsistenciaResponse r = new AsistenciaResponse();
        r.setId(entity.getId());
        r.setFecha(entity.getFecha());
        r.setHoraEntrada(entity.getHoraEntrada());
        r.setAsistio(entity.getAsistio());
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
