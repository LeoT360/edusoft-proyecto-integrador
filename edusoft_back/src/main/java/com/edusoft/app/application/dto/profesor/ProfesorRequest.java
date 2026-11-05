package com.edusoft.app.application.dto.profesor;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Datos de entrada para crear o actualizar perfiles de profesor. Se validan con Bean Validation. */
@Getter
@Setter
@NoArgsConstructor
public class ProfesorRequest {
    @NotNull private Integer idUsuario;
    private String areasAsignadas;
    private String nivelAcademico;
    private Integer anosExperiencia;
    private String tipoContrato;
    private LocalDate fechaIngreso;
    private Boolean vigencia;
    private String perfilProfesional;
}
