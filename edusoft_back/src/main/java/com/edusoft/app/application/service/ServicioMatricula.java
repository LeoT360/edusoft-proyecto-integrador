package com.edusoft.app.application.service;

import com.edusoft.app.application.dto.matricula.MatriculaRequest;
import com.edusoft.app.application.dto.matricula.MatriculaResponse;
import com.edusoft.app.domain.exceptions.BusinessException;
import com.edusoft.app.domain.exceptions.ResourceAlreadyExistsException;
import com.edusoft.app.domain.exceptions.ResourceNotFoundException;
import com.edusoft.app.domain.models.Curso;
import com.edusoft.app.domain.models.Matricula;
import com.edusoft.app.domain.models.Usuario;
import com.edusoft.app.infrastructure.repository.IRepositorioCurso;
import com.edusoft.app.infrastructure.repository.IRepositorioMatricula;
import com.edusoft.app.infrastructure.repository.IRepositorioUsuario;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Casos de uso de matrículas: crear, consultar, actualizar y eliminar, validando que las entidades relacionadas existan. */
@Service
@Transactional
public class ServicioMatricula {

    private final IRepositorioMatricula repositorio;
    private final IRepositorioUsuario repositorioUsuario;
    private final IRepositorioCurso repositorioCurso;

    public ServicioMatricula(IRepositorioMatricula repositorio,
                             IRepositorioUsuario repositorioUsuario,
                             IRepositorioCurso repositorioCurso) {
        this.repositorio = repositorio;
        this.repositorioUsuario = repositorioUsuario;
        this.repositorioCurso = repositorioCurso;
    }

    public MatriculaResponse guardar(MatriculaRequest request) {
        if (repositorio.existsByUsuarioIdAndCursoId(request.getIdUsuario(), request.getIdCurso())) {
            throw new ResourceAlreadyExistsException("El estudiante ya está matriculado en este curso");
        }
        Matricula entity = new Matricula();
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public MatriculaResponse actualizar(Integer id, MatriculaRequest request) {
        Matricula entity = repositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Matrícula no encontrada: " + id));
        if (repositorio.existsByUsuarioIdAndCursoIdAndIdNot(request.getIdUsuario(), request.getIdCurso(), id)) {
            throw new ResourceAlreadyExistsException("El estudiante ya está matriculado en este curso");
        }
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public List<MatriculaResponse> buscarTodos() {
        return repositorio.findAll().stream().map(this::toResponse).toList();
    }

    public MatriculaResponse buscarPorId(Integer id) {
        return repositorio.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Matrícula no encontrada: " + id));
    }

    public void eliminar(Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResourceNotFoundException("Matrícula no encontrada: " + id);
        }
        repositorio.deleteById(id);
    }

    /** Copia los datos del request a la entidad, resolviendo las entidades relacionadas. */
    private void apply(MatriculaRequest request, Matricula entity) {
        Usuario usuario = repositorioUsuario.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + request.getIdUsuario()));
        Curso curso = repositorioCurso.findById(request.getIdCurso())
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + request.getIdCurso()));
        entity.setUsuario(usuario);
        entity.setCurso(curso);
        entity.setFechaMatricula(request.getFechaMatricula());
        entity.setValorMatricula(request.getValorMatricula());
        String estado = request.getEstado();
        if (estado == null || estado.isBlank()) {
            estado = "ACTIVA";
        }
        if (!estado.equals("ACTIVA") && !estado.equals("INACTIVA")) {
            throw new BusinessException("Estado debe ser ACTIVA o INACTIVA");
        }
        entity.setEstado(estado);
    }

    /** Convierte la entidad en el DTO de respuesta. */
    private MatriculaResponse toResponse(Matricula entity) {
        MatriculaResponse r = new MatriculaResponse();
        r.setId(entity.getId());
        r.setFechaMatricula(entity.getFechaMatricula());
        r.setValorMatricula(entity.getValorMatricula());
        r.setEstado(entity.getEstado());
        if (entity.getUsuario() != null) {
            r.setIdUsuario(entity.getUsuario().getId());
            r.setNombreEstudiante(entity.getUsuario().getNombre());
            r.setCorreoEstudiante(entity.getUsuario().getCorreo());
            r.setDocumentoEstudiante(entity.getUsuario().getDocumento());
        }
        if (entity.getCurso() != null) {
            r.setIdCurso(entity.getCurso().getId());
            r.setTituloCurso(entity.getCurso().getTitulo());
        }
        return r;
    }
}
