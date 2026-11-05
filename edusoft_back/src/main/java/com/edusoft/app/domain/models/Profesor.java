package com.edusoft.app.domain.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** Perfil profesional de un usuario con rol Profesor (relación uno a uno con {@link Usuario}). */
@Entity
@Table(name = "profesor_perfil")
@Getter
@Setter
@NoArgsConstructor
public class Profesor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    private String areasAsignadas;
    private String nivelAcademico;
    private Integer anosExperiencia;
    private String tipoContrato;
    private LocalDate fechaIngreso;

    @Column(nullable = false)
    private Boolean vigencia = true;

    @Column(columnDefinition = "TEXT")
    private String perfilProfesional;

    @JsonIgnore
    @OneToMany(mappedBy = "profesor", fetch = FetchType.LAZY)
    private List<Curso> cursos = new ArrayList<>();
}
