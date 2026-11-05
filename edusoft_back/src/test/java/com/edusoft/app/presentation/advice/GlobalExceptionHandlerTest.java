package com.edusoft.app.presentation.advice;

import com.edusoft.app.domain.exceptions.BusinessException;
import com.edusoft.app.domain.exceptions.CredencialesInvalidasException;
import com.edusoft.app.domain.exceptions.ResourceAlreadyExistsException;
import com.edusoft.app.domain.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleNotFoundReturns404() {
        ResponseEntity<String> response = handler.handleNotFound(
                new ResourceNotFoundException("No se encontró el usuario con ID 99"));

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("No se encontró el usuario con ID 99", response.getBody());
    }

    @Test
    void handleInvalidCredentialsReturns401() {
        ResponseEntity<String> response = handler.handleInvalidCredentials(
                new CredencialesInvalidasException("Correo o contraseña incorrectos"));

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Correo o contraseña incorrectos", response.getBody());
    }

    @Test
    void handleAlreadyExistsReturns409() {
        ResponseEntity<String> response = handler.handleAlreadyExists(
                new ResourceAlreadyExistsException("Ya existe un usuario con el correo a@b.com"));

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void handleBusinessReturns400() {
        ResponseEntity<String> response = handler.handleBusiness(
                new BusinessException("La contraseña es obligatoria al crear el usuario"));

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
