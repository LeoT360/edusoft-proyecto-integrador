package com.edusoft.app.application.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Credenciales enviadas al iniciar sesión. */
@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {
    @NotBlank private String correo;
    @NotBlank private String contrasena;
}
