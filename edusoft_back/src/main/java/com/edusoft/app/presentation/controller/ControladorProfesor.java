package com.edusoft.app.presentation.controller;

import com.edusoft.app.application.dto.profesor.ProfesorRequest;
import com.edusoft.app.application.dto.profesor.ProfesorResponse;
import com.edusoft.app.application.service.ServicioProfesor;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Endpoints REST de perfiles de profesor (<code>/apiedusoft/v1/profesores</code>): crear, listar, buscar por ID, actualizar y eliminar. */
@RestController
@RequestMapping("/apiedusoft/v1/profesores")
@Validated
public class ControladorProfesor {

    private final ServicioProfesor servicio;

    public ControladorProfesor(ServicioProfesor servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    public ResponseEntity<ProfesorResponse> guardar(@Valid @RequestBody ProfesorRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(datos));
    }

    @GetMapping
    public ResponseEntity<List<ProfesorResponse>> buscar() {
        return ResponseEntity.ok(servicio.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfesorResponse> buscarPorId(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(servicio.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfesorResponse> actualizar(
            @PathVariable @Positive Integer id,
            @Valid @RequestBody ProfesorRequest datos) {
        return ResponseEntity.ok(servicio.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @Positive Integer id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
