package com.edusoft.app.presentation.controller;

import com.edusoft.app.application.dto.curso.CursoRequest;
import com.edusoft.app.application.dto.curso.CursoResponse;
import com.edusoft.app.application.service.ServicioCurso;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Endpoints REST de cursos (<code>/apiedusoft/v1/cursos</code>): crear, listar, buscar por ID, actualizar y eliminar. */
@RestController
@RequestMapping("/apiedusoft/v1/cursos")
@Validated
public class ControladorCurso {

    private final ServicioCurso servicio;

    public ControladorCurso(ServicioCurso servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    public ResponseEntity<CursoResponse> guardar(@Valid @RequestBody CursoRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(datos));
    }

    @GetMapping
    public ResponseEntity<List<CursoResponse>> buscar() {
        return ResponseEntity.ok(servicio.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoResponse> buscarPorId(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(servicio.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CursoResponse> actualizar(
            @PathVariable @Positive Integer id,
            @Valid @RequestBody CursoRequest datos) {
        return ResponseEntity.ok(servicio.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @Positive Integer id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
