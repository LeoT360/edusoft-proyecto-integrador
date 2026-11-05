package com.edusoft.app.application.dto.asistencia;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

/** Datos de asistencias devueltos por la API, con los nombres de las entidades relacionadas ya resueltos. */
@Getter
@Setter
@NoArgsConstructor
public class AsistenciaResponse {
    private Integer id;
    private Integer idUsuario;
    private String nombreEstudiante;
    private Integer idCurso;
    private String tituloCurso;
    private LocalDate fecha;
    private LocalTime horaEntrada;
    private Boolean asistio;
}
