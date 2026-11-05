package com.edusoft.app.presentation.controller;

import com.edusoft.app.application.dto.notificacion.NotificacionRequest;
import com.edusoft.app.application.dto.notificacion.NotificacionResponse;
import com.edusoft.app.application.service.ServicioNotificacion;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Endpoints REST de notificaciones (<code>/apiedusoft/v1/notificaciones</code>): crear, listar, buscar por ID, actualizar y eliminar. */
@RestController
@RequestMapping("/apiedusoft/v1/notificaciones")
@Validated
public class ControladorNotificacion {

    private final ServicioNotificacion servicio;

    public ControladorNotificacion(ServicioNotificacion servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    public ResponseEntity<NotificacionResponse> guardar(@Valid @RequestBody NotificacionRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(datos));
    }

    @GetMapping
    public ResponseEntity<List<NotificacionResponse>> buscar() {
        return ResponseEntity.ok(servicio.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificacionResponse> buscarPorId(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(servicio.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificacionResponse> actualizar(
            @PathVariable @Positive Integer id,
            @Valid @RequestBody NotificacionRequest datos) {
        return ResponseEntity.ok(servicio.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @Positive Integer id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
