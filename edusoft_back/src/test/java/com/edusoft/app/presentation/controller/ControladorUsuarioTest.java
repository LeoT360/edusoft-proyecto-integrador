package com.edusoft.app.presentation.controller;

import com.edusoft.app.application.dto.usuario.UsuarioRequest;
import com.edusoft.app.application.dto.usuario.UsuarioResponse;
import com.edusoft.app.application.service.ServicioUsuario;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ControladorUsuarioTest {

    @Test
    void guardarDelegatesToServiceAndReturnsCreated() {
        ServicioUsuario servicio = mock(ServicioUsuario.class);
        UsuarioResponse response = new UsuarioResponse();
        response.setId(1);
        response.setNombre("Julius");
        response.setCorreo("julius@correo.com");
        when(servicio.guardar(any(UsuarioRequest.class))).thenReturn(response);

        ControladorUsuario controlador = new ControladorUsuario(servicio);
        UsuarioRequest request = new UsuarioRequest();
        request.setNombre("Julius");
        request.setCorreo("julius@correo.com");
        request.setContrasena("2008");

        ResponseEntity<UsuarioResponse> result = controlador.guardar(request);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().getId());
        assertEquals("Julius", result.getBody().getNombre());
    }
}
