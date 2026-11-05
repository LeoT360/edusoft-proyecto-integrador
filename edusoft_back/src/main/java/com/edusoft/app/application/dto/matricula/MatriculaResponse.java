package com.edusoft.app.application.dto.matricula;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Datos de matrículas devueltos por la API, con los nombres de las entidades relacionadas ya resueltos. */
@Getter
@Setter
@NoArgsConstructor
public class MatriculaResponse {
    private Integer id;
    private Integer idUsuario;
    private String nombreEstudiante;
    private String correoEstudiante;
    private String documentoEstudiante;
    private Integer idCurso;
    private String tituloCurso;
    private LocalDate fechaMatricula;
    private Double valorMatricula;
    private String estado;
}
