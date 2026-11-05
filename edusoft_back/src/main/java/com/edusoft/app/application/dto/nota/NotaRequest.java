package com.edusoft.app.application.dto.nota;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Datos de entrada para crear o actualizar notas. Se validan con Bean Validation. */
@Getter
@Setter
@NoArgsConstructor
public class NotaRequest {
    @NotNull private Integer idUsuario;
    @NotNull private Integer idCurso;
    @NotBlank private String tipoExamen;
    @NotNull @DecimalMin("0.0") @DecimalMax("5.0") private Double nota;
    private LocalDate fechaExamen;
    private String observaciones;
}
