package com.edusoft.app.presentation.controller;

import com.edusoft.app.application.dto.nota.NotaRequest;
import com.edusoft.app.application.dto.nota.NotaResponse;
import com.edusoft.app.application.service.ServicioNota;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Endpoints REST de notas (<code>/apiedusoft/v1/notas</code>): crear, listar, buscar por ID, actualizar y eliminar. */
@RestController
@RequestMapping("/apiedusoft/v1/notas")
@Validated
public class ControladorNota {

    private final ServicioNota servicio;

    public ControladorNota(ServicioNota servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    public ResponseEntity<NotaResponse> guardar(@Valid @RequestBody NotaRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(datos));
    }

    @GetMapping
    public ResponseEntity<List<NotaResponse>> buscar(@RequestParam(required = false) String email) {
        if (email != null && !email.isBlank()) {
            return ResponseEntity.ok(servicio.buscarPorEmail(email));
        }
        return ResponseEntity.ok(servicio.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotaResponse> buscarPorId(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(servicio.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotaResponse> actualizar(
            @PathVariable @Positive Integer id,
            @Valid @RequestBody NotaRequest datos) {
        return ResponseEntity.ok(servicio.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @Positive Integer id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
