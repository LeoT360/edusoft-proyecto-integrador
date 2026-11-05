package com.edusoft.app.application.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Datos de entrada para crear o actualizar usuarios. Se validan con Bean Validation. */
@Getter
@Setter
@NoArgsConstructor
public class UsuarioRequest {
    @NotBlank private String nombre;
    @NotBlank @Email private String correo;
    private String contrasena;
    private String rol;
    private String telefono;
    private String documento;
    private Boolean activo;
}
