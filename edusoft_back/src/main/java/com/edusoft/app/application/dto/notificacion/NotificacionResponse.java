package com.edusoft.app.application.dto.notificacion;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/** Datos de notificaciones devueltos por la API, con los nombres de las entidades relacionadas ya resueltos. */
@Getter
@Setter
@NoArgsConstructor
public class NotificacionResponse {
    private Integer id;
    private Integer idRemitente;
    private String nombreRemitente;
    private Integer idDestinatario;
    private String nombreDestinatario;
    private String asunto;
    private String cuerpo;
    private String tipo;
    private String prioridad;
    private Integer idCurso;
    private String tituloCurso;
    private LocalDateTime creadaEn;
}
