package com.edusoft.app.domain.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Calificación de un estudiante en un curso, en escala de 0.0 a 5.0. */
@Entity
@Table(name = "notas")
@Getter
@Setter
@NoArgsConstructor
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    /** Parcial, Final, Quiz, Taller, Otro */
    @Column(nullable = false)
    private String tipoExamen;

    /** Escala 0.0 – 5.0 */
    @Column(nullable = false)
    private Double nota;

    private LocalDate fechaExamen;
    private String observaciones;
}
