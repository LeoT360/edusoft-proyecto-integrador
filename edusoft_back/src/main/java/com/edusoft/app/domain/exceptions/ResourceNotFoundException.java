package com.edusoft.app.domain.exceptions;

/** No existe el recurso solicitado. La API responde 404 (Not Found). */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
