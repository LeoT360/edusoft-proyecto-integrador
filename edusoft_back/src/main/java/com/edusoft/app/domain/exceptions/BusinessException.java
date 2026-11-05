package com.edusoft.app.domain.exceptions;

/** Regla de negocio incumplida. La API responde 400 (Bad Request). */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
