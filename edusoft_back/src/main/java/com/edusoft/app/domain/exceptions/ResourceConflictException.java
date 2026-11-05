package com.edusoft.app.domain.exceptions;

/** La operación choca con el estado actual del recurso. La API responde 409 (Conflict). */
public class ResourceConflictException extends RuntimeException {

    public ResourceConflictException(String message) {
        super(message);
    }
}
