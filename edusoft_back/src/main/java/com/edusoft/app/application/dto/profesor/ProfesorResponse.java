package com.edusoft.app.application.dto.profesor;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Datos de perfiles de profesor devueltos por la API, con los nombres de las entidades relacionadas ya resueltos. */
@Getter
@Setter
@NoArgsConstructor
public class ProfesorResponse {
    private Integer id;
    private Integer idUsuario;
    private String nombre;
    private String correo;
    private String telefono;
    private String documento;
    private String areasAsignadas;
    private String nivelAcademico;
    private Integer anosExperiencia;
    private String tipoContrato;
    private LocalDate fechaIngreso;
    private Boolean vigencia;
    private String perfilProfesional;
}
