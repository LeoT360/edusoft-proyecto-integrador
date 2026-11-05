package com.edusoft.app.application.dto.usuario;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Datos públicos de un usuario. Nunca incluye la contraseña. */
@Getter
@Setter
@NoArgsConstructor
public class UsuarioResponse {
    private Integer id;
    private String nombre;
    private String correo;
    private String rol;
    private String telefono;
    private String documento;
    private Boolean activo;
}
