package com.edusoft.app.presentation.advice;

import com.edusoft.app.domain.exceptions.BusinessException;
import com.edusoft.app.domain.exceptions.CredencialesInvalidasException;
import com.edusoft.app.domain.exceptions.ResourceAlreadyExistsException;
import com.edusoft.app.domain.exceptions.ResourceConflictException;
import com.edusoft.app.domain.exceptions.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.stream.Collectors;

/**
 * Traduce las excepciones de la aplicación a respuestas HTTP con un mensaje de texto plano.
 * <ul>
 *   <li>400: datos o reglas de negocio inválidos</li>
 *   <li>401: credenciales incorrectas</li>
 *   <li>404: recurso inexistente</li>
 *   <li>409: recurso duplicado o con registros relacionados</li>
 *   <li>500: error inesperado (se registra en el log)</li>
 * </ul>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(getMessage(exception, "Recurso no encontrado"));
    }

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<String> handleInvalidCredentials(CredencialesInvalidasException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(getMessage(exception, "Credenciales inválidas"));
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<String> handleAlreadyExists(ResourceAlreadyExistsException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(getMessage(exception, "El recurso ya existe"));
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<String> handleConflict(ResourceConflictException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(getMessage(exception, "Conflicto con el estado actual del recurso"));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<String> handleBusiness(BusinessException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(getMessage(exception, "Error de negocio"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(this::formatFieldError)
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(getMessage(message, "La solicitud contiene datos inválidos"));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleInvalidBody(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body("El cuerpo de la solicitud no es válido");
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleInvalidParameterType(MethodArgumentTypeMismatchException exception) {
        return ResponseEntity.badRequest()
                .body("El parámetro '" + exception.getName() + "' tiene un formato inválido");
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<String> handleMissingParameter(MissingServletRequestParameterException exception) {
        return ResponseEntity.badRequest()
                .body("Falta el parámetro requerido '" + exception.getParameterName() + "'");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataConflict(DataIntegrityViolationException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("No se pudo guardar o eliminar el registro porque existe un dato duplicado o está relacionado con otros registros");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleUnexpectedException(Exception exception) {
        if (exception instanceof ErrorResponse errorResponse) {
            String message = errorResponse.getBody().getDetail();
            return ResponseEntity.status(errorResponse.getStatusCode())
                    .body(getMessage(message, errorResponse.getStatusCode().toString()));
        }

        logger.error("Error inesperado al procesar la solicitud", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Ocurrió un error interno al procesar la solicitud");
    }

    private String formatFieldError(FieldError error) {
        return error.getField() + ": " + error.getDefaultMessage();
    }

    private String getMessage(Exception exception, String fallback) {
        return getMessage(exception.getMessage(), fallback);
    }

    private String getMessage(String message, String fallback) {
        return message == null || message.isBlank() ? fallback : message;
    }
}
