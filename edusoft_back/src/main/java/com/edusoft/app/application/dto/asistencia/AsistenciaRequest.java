package com.edusoft.app.application.dto.asistencia;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

/** Datos de entrada para crear o actualizar asistencias. Se validan con Bean Validation. */
@Getter
@Setter
@NoArgsConstructor
public class AsistenciaRequest {
    @NotNull private Integer idUsuario;
    @NotNull private Integer idCurso;
    @NotNull private LocalDate fecha;
    private LocalTime horaEntrada;
    private Boolean asistio;
}
