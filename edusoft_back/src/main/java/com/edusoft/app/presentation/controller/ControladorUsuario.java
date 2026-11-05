package com.edusoft.app.presentation.controller;

import com.edusoft.app.application.dto.usuario.UsuarioRequest;
import com.edusoft.app.application.dto.usuario.UsuarioResponse;
import com.edusoft.app.application.service.ServicioUsuario;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Endpoints REST de usuarios (<code>/apiedusoft/v1/usuarios</code>): crear, listar, buscar por ID, actualizar y eliminar. */
@RestController
@RequestMapping("/apiedusoft/v1/usuarios")
@Validated
public class ControladorUsuario {

    private final ServicioUsuario servicio;

    public ControladorUsuario(ServicioUsuario servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> guardar(@Valid @RequestBody UsuarioRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(datos));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> buscar() {
        return ResponseEntity.ok(servicio.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(servicio.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> actualizar(
            @PathVariable @Positive Integer id,
            @Valid @RequestBody UsuarioRequest datos) {
        return ResponseEntity.ok(servicio.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @Positive Integer id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
