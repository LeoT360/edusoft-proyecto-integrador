package com.edusoft.app.application.service;

import com.edusoft.app.domain.exceptions.ResourceConflictException;
import com.edusoft.app.domain.models.Profesor;
import com.edusoft.app.infrastructure.repository.IRepositorioAsistencia;
import com.edusoft.app.infrastructure.repository.IRepositorioCurso;
import com.edusoft.app.infrastructure.repository.IRepositorioMatricula;
import com.edusoft.app.infrastructure.repository.IRepositorioNota;
import com.edusoft.app.infrastructure.repository.IRepositorioNotificacion;
import com.edusoft.app.infrastructure.repository.IRepositorioProfesor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class VerificadorDependenciasTest {

    private IRepositorioMatricula matriculas;
    private IRepositorioNota notas;
    private IRepositorioAsistencia asistencias;
    private IRepositorioNotificacion notificaciones;
    private IRepositorioCurso cursos;
    private IRepositorioProfesor profesores;
    private VerificadorDependencias verificador;

    @BeforeEach
    void preparar() {
        matriculas = mock(IRepositorioMatricula.class);
        notas = mock(IRepositorioNota.class);
        asistencias = mock(IRepositorioAsistencia.class);
        notificaciones = mock(IRepositorioNotificacion.class);
        cursos = mock(IRepositorioCurso.class);
        profesores = mock(IRepositorioProfesor.class);
        verificador = new VerificadorDependencias(matriculas, notas, asistencias, notificaciones, cursos, profesores);
        when(profesores.findByUsuarioId(7)).thenReturn(Optional.empty());
    }

    @Test
    void usuarioSinRegistrosPuedeEliminarse() {
        assertDoesNotThrow(() -> verificador.verificarUsuario(7, "Ana"));
    }

    @Test
    void usuarioConRegistrosLanzaConflictoConElDetalle() {
        when(matriculas.countByUsuarioId(7)).thenReturn(3L);
        when(notas.countByUsuarioId(7)).thenReturn(5L);

        ResourceConflictException error = assertThrows(ResourceConflictException.class,
                () -> verificador.verificarUsuario(7, "Ana"));

        assertTrue(error.getMessage().contains("«Ana»"));
        assertTrue(error.getMessage().contains("matrículas: 3"));
        assertTrue(error.getMessage().contains("notas: 5"));
    }

    @Test
    void usuarioProfesorQueDictaCursosNoPuedeEliminarse() {
        Profesor perfil = new Profesor();
        perfil.setId(4);
        when(profesores.findByUsuarioId(7)).thenReturn(Optional.of(perfil));
        when(cursos.countByProfesorId(4)).thenReturn(2L);

        ResourceConflictException error = assertThrows(ResourceConflictException.class,
                () -> verificador.verificarUsuario(7, "Carlos"));

        assertTrue(error.getMessage().contains("cursos que dicta: 2"));
    }

    @Test
    void usuarioProfesorSinCursosPuedeEliminarse() {
        Profesor perfil = new Profesor();
        perfil.setId(4);
        when(profesores.findByUsuarioId(7)).thenReturn(Optional.of(perfil));

        assertDoesNotThrow(() -> verificador.verificarUsuario(7, "Carlos"));
    }

    @Test
    void perfilConCursosAsignadosNoPuedeEliminarse() {
        when(cursos.countByProfesorId(4)).thenReturn(1L);

        ResourceConflictException error = assertThrows(ResourceConflictException.class,
                () -> verificador.verificarProfesor(4, "Carlos"));

        assertTrue(error.getMessage().contains("cursos asignados: 1"));
    }

    @Test
    void cursoConAsistenciasYNotificacionesNoPuedeEliminarse() {
        when(asistencias.countByCursoId(9)).thenReturn(12L);
        when(notificaciones.countByCursoId(9)).thenReturn(2L);

        ResourceConflictException error = assertThrows(ResourceConflictException.class,
                () -> verificador.verificarCurso(9, "Redes"));

        assertTrue(error.getMessage().contains("asistencias: 12"));
        assertTrue(error.getMessage().contains("notificaciones: 2"));
    }

    @Test
    void cursoSinRegistrosPuedeEliminarse() {
        assertDoesNotThrow(() -> verificador.verificarCurso(9, "Redes"));
    }
}
