package com.edusoft.app.application.dto.matricula;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Datos de entrada para crear o actualizar matrículas. Se validan con Bean Validation. */
@Getter
@Setter
@NoArgsConstructor
public class MatriculaRequest {
    @NotNull private Integer idUsuario;
    @NotNull private Integer idCurso;
    @NotNull private LocalDate fechaMatricula;
    @NotNull private Double valorMatricula;
    private String estado;
}
