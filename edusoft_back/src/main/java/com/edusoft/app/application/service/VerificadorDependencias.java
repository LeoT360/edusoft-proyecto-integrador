package com.edusoft.app.application.service;

import com.edusoft.app.domain.exceptions.ResourceConflictException;
import com.edusoft.app.infrastructure.repository.IRepositorioAsistencia;
import com.edusoft.app.infrastructure.repository.IRepositorioCurso;
import com.edusoft.app.infrastructure.repository.IRepositorioMatricula;
import com.edusoft.app.infrastructure.repository.IRepositorioNota;
import com.edusoft.app.infrastructure.repository.IRepositorioNotificacion;
import com.edusoft.app.infrastructure.repository.IRepositorioProfesor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Comprueba, antes de eliminar un usuario, un perfil de profesor o un curso, que no tengan
 * registros que dependan de ellos. Si los tienen, lanza {@link ResourceConflictException}
 * (HTTP 409) con un mensaje que indica exactamente qué lo bloquea, en lugar del error
 * genérico de la base de datos.
 *
 * <p>Los registros dependientes no se borran en cascada a propósito: eliminar un usuario o un
 * curso arrastraría notas y asistencias históricas sin que la persona lo note.
 */
@Component
public class VerificadorDependencias {

    private final IRepositorioMatricula matriculas;
    private final IRepositorioNota notas;
    private final IRepositorioAsistencia asistencias;
    private final IRepositorioNotificacion notificaciones;
    private final IRepositorioCurso cursos;
    private final IRepositorioProfesor profesores;

    public VerificadorDependencias(IRepositorioMatricula matriculas,
                                   IRepositorioNota notas,
                                   IRepositorioAsistencia asistencias,
                                   IRepositorioNotificacion notificaciones,
                                   IRepositorioCurso cursos,
                                   IRepositorioProfesor profesores) {
        this.matriculas = matriculas;
        this.notas = notas;
        this.asistencias = asistencias;
        this.notificaciones = notificaciones;
        this.cursos = cursos;
        this.profesores = profesores;
    }

    /**
     * Un usuario no se puede eliminar si tiene matrículas, notas, asistencias o notificaciones,
     * ni si es profesor y dicta cursos. Su perfil de profesor (sin cursos) se elimina con él.
     */
    public void verificarUsuario(Integer idUsuario, String nombre) {
        List<String> detalle = new ArrayList<>();
        agregar(detalle, "matrículas", matriculas.countByUsuarioId(idUsuario));
        agregar(detalle, "notas", notas.countByUsuarioId(idUsuario));
        agregar(detalle, "asistencias", asistencias.countByUsuarioId(idUsuario));
        agregar(detalle, "notificaciones", notificaciones.countByRemitenteIdOrDestinatarioId(idUsuario, idUsuario));
        profesores.findByUsuarioId(idUsuario)
                .ifPresent(perfil -> agregar(detalle, "cursos que dicta", cursos.countByProfesorId(perfil.getId())));
        lanzarSiHay("el usuario", nombre, detalle);
    }

    /** Un perfil de profesor no se puede eliminar mientras tenga cursos asignados. */
    public void verificarProfesor(Integer idProfesor, String nombre) {
        List<String> detalle = new ArrayList<>();
        agregar(detalle, "cursos asignados", cursos.countByProfesorId(idProfesor));
        lanzarSiHay("el perfil del profesor", nombre, detalle);
    }

    /** Un curso no se puede eliminar si tiene matrículas, notas, asistencias o notificaciones. */
    public void verificarCurso(Integer idCurso, String titulo) {
        List<String> detalle = new ArrayList<>();
        agregar(detalle, "matrículas", matriculas.countByCursoId(idCurso));
        agregar(detalle, "notas", notas.countByCursoId(idCurso));
        agregar(detalle, "asistencias", asistencias.countByCursoId(idCurso));
        agregar(detalle, "notificaciones", notificaciones.countByCursoId(idCurso));
        lanzarSiHay("el curso", titulo, detalle);
    }

    private static void agregar(List<String> detalle, String etiqueta, long cantidad) {
        if (cantidad > 0) {
            detalle.add(etiqueta + ": " + cantidad);
        }
    }

    private static void lanzarSiHay(String objeto, String nombre, List<String> detalle) {
        if (!detalle.isEmpty()) {
            throw new ResourceConflictException(
                    "No se puede eliminar " + objeto + " «" + nombre + "» porque tiene registros asociados ("
                            + String.join(", ", detalle) + "). Elimínalos o reasígnalos primero.");
        }
    }
}
