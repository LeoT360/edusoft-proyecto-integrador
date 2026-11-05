package com.edusoft.app.application.dto.curso;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Datos de cursos devueltos por la API, con los nombres de las entidades relacionadas ya resueltos. */
@Getter
@Setter
@NoArgsConstructor
public class CursoResponse {
    private Integer id;
    private String titulo;
    private String descripcion;
    private String tipoCurso;
    private String modalidad;
    private Double duracionHoras;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer idProfesor;
    private String nombreProfesor;
    private Boolean activo;
    private Integer cantidadMatriculados;
}
