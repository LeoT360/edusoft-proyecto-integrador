package com.edusoft.app.application.dto.curso;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Datos de entrada para crear o actualizar cursos. Se validan con Bean Validation. */
@Getter
@Setter
@NoArgsConstructor
public class CursoRequest {
    @NotBlank private String titulo;
    private String descripcion;
    private String tipoCurso;
    private String modalidad;
    private Double duracionHoras;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    @NotNull private Integer idProfesor;
    private Boolean activo;
}
