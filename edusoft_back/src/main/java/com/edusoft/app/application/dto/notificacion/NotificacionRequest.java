package com.edusoft.app.application.dto.notificacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Datos de entrada para crear o actualizar notificaciones. Se validan con Bean Validation. */
@Getter
@Setter
@NoArgsConstructor
public class NotificacionRequest {
    @NotNull private Integer idRemitente;
    @NotNull private Integer idDestinatario;
    @NotBlank private String asunto;
    private String cuerpo;
    private String tipo;
    private String prioridad;
    private Integer idCurso;
}
