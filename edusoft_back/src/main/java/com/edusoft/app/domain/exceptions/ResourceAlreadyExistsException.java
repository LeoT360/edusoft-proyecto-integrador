package com.edusoft.app.domain.exceptions;

/** El recurso que se intenta crear ya existe (por ejemplo, un correo repetido). La API responde 409 (Conflict). */
public class ResourceAlreadyExistsException extends RuntimeException {

    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}
