package com.edusoft.app.presentation.controller;

import com.edusoft.app.application.dto.auth.LoginRequest;
import com.edusoft.app.application.dto.usuario.UsuarioResponse;
import com.edusoft.app.application.service.ServicioUsuario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Inicio de sesión: valida credenciales en el servidor y devuelve el usuario sin contraseña. */
@RestController
@RequestMapping("/apiedusoft/v1/auth")
public class ControladorAuth {

    private final ServicioUsuario servicio;

    public ControladorAuth(ServicioUsuario servicio) {
        this.servicio = servicio;
    }

    /** {@code POST /auth/login}: 200 con el usuario, o 401 si las credenciales no son válidas. */
    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@Valid @RequestBody LoginRequest datos) {
        return ResponseEntity.ok(servicio.autenticar(datos.getCorreo(), datos.getContrasena()));
    }
}
