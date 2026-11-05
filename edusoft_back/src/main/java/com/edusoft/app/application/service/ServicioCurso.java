package com.edusoft.app.application.service;

import com.edusoft.app.application.dto.curso.CursoRequest;
import com.edusoft.app.application.dto.curso.CursoResponse;
import com.edusoft.app.domain.exceptions.ResourceNotFoundException;
import com.edusoft.app.domain.models.Curso;
import com.edusoft.app.domain.models.Profesor;
import com.edusoft.app.infrastructure.repository.IRepositorioCurso;
import com.edusoft.app.infrastructure.repository.IRepositorioProfesor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Casos de uso de cursos: crear, consultar, actualizar y eliminar, validando que las entidades relacionadas existan. */
@Service
@Transactional
public class ServicioCurso {

    private final IRepositorioCurso repositorio;
    private final IRepositorioProfesor repositorioProfesor;
    private final VerificadorDependencias verificador;

    public ServicioCurso(IRepositorioCurso repositorio,
                         IRepositorioProfesor repositorioProfesor,
                         VerificadorDependencias verificador) {
        this.repositorio = repositorio;
        this.repositorioProfesor = repositorioProfesor;
        this.verificador = verificador;
    }

    public CursoResponse guardar(CursoRequest request) {
        Curso entity = new Curso();
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public CursoResponse actualizar(Integer id, CursoRequest request) {
        Curso entity = repositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + id));
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public List<CursoResponse> buscarTodos() {
        return repositorio.findAll().stream().map(this::toResponse).toList();
    }

    public CursoResponse buscarPorId(Integer id) {
        return repositorio.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + id));
    }

    /** Elimina un curso solo si no tiene registros asociados (ver {@link VerificadorDependencias}). */
    public void eliminar(Integer id) {
        Curso curso = repositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + id));
        verificador.verificarCurso(id, curso.getTitulo());
        repositorio.delete(curso);
    }

    /** Copia los datos del request a la entidad, resolviendo las entidades relacionadas. */
    private void apply(CursoRequest request, Curso entity) {
        entity.setTitulo(request.getTitulo());
        entity.setDescripcion(request.getDescripcion());
        entity.setTipoCurso(request.getTipoCurso());
        entity.setModalidad(request.getModalidad());
        entity.setDuracionHoras(request.getDuracionHoras());
        entity.setFechaInicio(request.getFechaInicio());
        entity.setFechaFin(request.getFechaFin());
        if (request.getActivo() != null) {
            entity.setActivo(request.getActivo());
        } else if (entity.getActivo() == null) {
            entity.setActivo(true);
        }
        Profesor profesor = repositorioProfesor.findById(request.getIdProfesor())
                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado: " + request.getIdProfesor()));
        entity.setProfesor(profesor);
    }

    /** Convierte la entidad en el DTO de respuesta. */
    private CursoResponse toResponse(Curso entity) {
        CursoResponse r = new CursoResponse();
        r.setId(entity.getId());
        r.setTitulo(entity.getTitulo());
        r.setDescripcion(entity.getDescripcion());
        r.setTipoCurso(entity.getTipoCurso());
        r.setModalidad(entity.getModalidad());
        r.setDuracionHoras(entity.getDuracionHoras());
        r.setFechaInicio(entity.getFechaInicio());
        r.setFechaFin(entity.getFechaFin());
        r.setActivo(entity.getActivo());
        if (entity.getProfesor() != null) {
            r.setIdProfesor(entity.getProfesor().getId());
            if (entity.getProfesor().getUsuario() != null) {
                r.setNombreProfesor(entity.getProfesor().getUsuario().getNombre());
            }
        }
        r.setCantidadMatriculados(entity.getMatriculas() != null ? entity.getMatriculas().size() : 0);
        return r;
    }
}
