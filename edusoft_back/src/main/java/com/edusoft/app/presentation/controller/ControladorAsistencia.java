package com.edusoft.app.presentation.controller;

import com.edusoft.app.application.dto.asistencia.AsistenciaRequest;
import com.edusoft.app.application.dto.asistencia.AsistenciaResponse;
import com.edusoft.app.application.service.ServicioAsistencia;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Endpoints REST de asistencias (<code>/apiedusoft/v1/asistencias</code>): crear, listar, buscar por ID, actualizar y eliminar. */
@RestController
@RequestMapping("/apiedusoft/v1/asistencias")
@Validated
public class ControladorAsistencia {

    private final ServicioAsistencia servicio;

    public ControladorAsistencia(ServicioAsistencia servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    public ResponseEntity<AsistenciaResponse> guardar(@Valid @RequestBody AsistenciaRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(datos));
    }

    @GetMapping
    public ResponseEntity<List<AsistenciaResponse>> buscar() {
        return ResponseEntity.ok(servicio.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsistenciaResponse> buscarPorId(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(servicio.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsistenciaResponse> actualizar(
            @PathVariable @Positive Integer id,
            @Valid @RequestBody AsistenciaRequest datos) {
        return ResponseEntity.ok(servicio.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @Positive Integer id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
