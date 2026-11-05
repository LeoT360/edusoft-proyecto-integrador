package com.edusoft.app.application.service;

import com.edusoft.app.application.dto.profesor.ProfesorRequest;
import com.edusoft.app.application.dto.profesor.ProfesorResponse;
import com.edusoft.app.domain.exceptions.BusinessException;
import com.edusoft.app.domain.exceptions.ResourceAlreadyExistsException;
import com.edusoft.app.domain.exceptions.ResourceNotFoundException;
import com.edusoft.app.domain.models.Profesor;
import com.edusoft.app.domain.models.Usuario;
import com.edusoft.app.infrastructure.repository.IRepositorioProfesor;
import com.edusoft.app.infrastructure.repository.IRepositorioUsuario;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Casos de uso de perfiles de profesor: crear, consultar, actualizar y eliminar, validando que las entidades relacionadas existan. */
@Service
@Transactional
public class ServicioProfesor {

    private final IRepositorioProfesor repositorio;
    private final IRepositorioUsuario repositorioUsuario;
    private final VerificadorDependencias verificador;

    public ServicioProfesor(IRepositorioProfesor repositorio,
                            IRepositorioUsuario repositorioUsuario,
                            VerificadorDependencias verificador) {
        this.repositorio = repositorio;
        this.repositorioUsuario = repositorioUsuario;
        this.verificador = verificador;
    }

    public ProfesorResponse guardar(ProfesorRequest request) {
        Usuario usuario = repositorioUsuario.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + request.getIdUsuario()));
        if (!"Profesor".equalsIgnoreCase(usuario.getRol())) {
            throw new BusinessException("El usuario debe tener rol Profesor");
        }
        if (repositorio.findByUsuarioId(usuario.getId()).isPresent()) {
            throw new ResourceAlreadyExistsException("Ya existe un perfil de profesor para este usuario");
        }
        Profesor entity = new Profesor();
        entity.setUsuario(usuario);
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public ProfesorResponse actualizar(Integer id, ProfesorRequest request) {
        Profesor entity = repositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado: " + id));
        apply(request, entity);
        return toResponse(repositorio.save(entity));
    }

    public List<ProfesorResponse> buscarTodos() {
        return repositorio.findAll().stream().map(this::toResponse).toList();
    }

    public ProfesorResponse buscarPorId(Integer id) {
        return repositorio.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado: " + id));
    }

    /** Elimina un perfil solo si no tiene cursos asignados (ver {@link VerificadorDependencias}). */
    public void eliminar(Integer id) {
        String nombre = repositorio.findNombreById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado: " + id));
        verificador.verificarProfesor(id, nombre);
        repositorio.deleteById(id);
    }

    /** Copia los datos del request a la entidad, resolviendo las entidades relacionadas. */
    private void apply(ProfesorRequest request, Profesor entity) {
        entity.setAreasAsignadas(request.getAreasAsignadas());
        entity.setNivelAcademico(request.getNivelAcademico());
        entity.setAnosExperiencia(request.getAnosExperiencia());
        entity.setTipoContrato(request.getTipoContrato());
        entity.setFechaIngreso(request.getFechaIngreso());
        if (request.getVigencia() != null) {
            entity.setVigencia(request.getVigencia());
        }
        entity.setPerfilProfesional(request.getPerfilProfesional());
    }

    /** Convierte la entidad en el DTO de respuesta. */
    private ProfesorResponse toResponse(Profesor entity) {
        ProfesorResponse r = new ProfesorResponse();
        r.setId(entity.getId());
        Usuario u = entity.getUsuario();
        if (u != null) {
            r.setIdUsuario(u.getId());
            r.setNombre(u.getNombre());
            r.setCorreo(u.getCorreo());
            r.setTelefono(u.getTelefono());
            r.setDocumento(u.getDocumento());
        }
        r.setAreasAsignadas(entity.getAreasAsignadas());
        r.setNivelAcademico(entity.getNivelAcademico());
        r.setAnosExperiencia(entity.getAnosExperiencia());
        r.setTipoContrato(entity.getTipoContrato());
        r.setFechaIngreso(entity.getFechaIngreso());
        r.setVigencia(entity.getVigencia());
        r.setPerfilProfesional(entity.getPerfilProfesional());
        return r;
    }
}
