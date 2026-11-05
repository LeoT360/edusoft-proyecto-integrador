package com.edusoft.app.presentation.controller;

import com.edusoft.app.application.dto.matricula.MatriculaRequest;
import com.edusoft.app.application.dto.matricula.MatriculaResponse;
import com.edusoft.app.application.service.ServicioMatricula;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Endpoints REST de matrículas (<code>/apiedusoft/v1/matriculas</code>): crear, listar, buscar por ID, actualizar y eliminar. */
@RestController
@RequestMapping("/apiedusoft/v1/matriculas")
@Validated
public class ControladorMatricula {

    private final ServicioMatricula servicio;

    public ControladorMatricula(ServicioMatricula servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    public ResponseEntity<MatriculaResponse> guardar(@Valid @RequestBody MatriculaRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(datos));
    }

    @GetMapping
    public ResponseEntity<List<MatriculaResponse>> buscar() {
        return ResponseEntity.ok(servicio.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatriculaResponse> buscarPorId(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(servicio.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MatriculaResponse> actualizar(
            @PathVariable @Positive Integer id,
            @Valid @RequestBody MatriculaRequest datos) {
        return ResponseEntity.ok(servicio.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @Positive Integer id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
