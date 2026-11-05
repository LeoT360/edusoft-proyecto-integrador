package com.edusoft.app.application.dto.nota;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Datos de notas devueltos por la API, con los nombres de las entidades relacionadas ya resueltos. */
@Getter
@Setter
@NoArgsConstructor
public class NotaResponse {
    private Integer id;
    private Integer idUsuario;
    private String nombreEstudiante;
    private Integer idCurso;
    private String tituloCurso;
    private String tipoExamen;
    private Double nota;
    private LocalDate fechaExamen;
    private String observaciones;
}
