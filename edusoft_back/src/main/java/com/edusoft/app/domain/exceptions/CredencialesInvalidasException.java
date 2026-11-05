package com.edusoft.app.domain.exceptions;

/** Se lanza cuando el correo o la contraseña de un inicio de sesión no son válidos. */
public class CredencialesInvalidasException extends RuntimeException {

    public CredencialesInvalidasException(String message) {
        super(message);
    }
}
