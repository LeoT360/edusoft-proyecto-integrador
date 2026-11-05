package com.edusoft.app.application.service;

import com.edusoft.app.application.dto.usuario.UsuarioRequest;
import com.edusoft.app.application.dto.usuario.UsuarioResponse;
import com.edusoft.app.domain.exceptions.BusinessException;
import com.edusoft.app.domain.exceptions.CredencialesInvalidasException;
import com.edusoft.app.domain.exceptions.ResourceConflictException;
import com.edusoft.app.domain.exceptions.ResourceAlreadyExistsException;
import com.edusoft.app.domain.models.Usuario;
import com.edusoft.app.infrastructure.repository.IRepositorioUsuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ServicioUsuarioTest {

    private IRepositorioUsuario repositorio;
    private PasswordEncoder encoder;
    private VerificadorDependencias verificador;
    private ServicioUsuario servicio;

    @BeforeEach
    void preparar() {
        repositorio = mock(IRepositorioUsuario.class);
        encoder = new BCryptPasswordEncoder();
        verificador = mock(VerificadorDependencias.class);
        servicio = new ServicioUsuario(repositorio, encoder, verificador);
        when(repositorio.findByCorreoIgnoreCase(any())).thenReturn(Optional.empty());
        when(repositorio.save(any(Usuario.class))).thenAnswer(invocacion -> invocacion.getArgument(0));
    }

    private UsuarioRequest solicitud(String contrasena) {
        UsuarioRequest request = new UsuarioRequest();
        request.setNombre("Ana");
        request.setCorreo("ana@correo.com");
        request.setContrasena(contrasena);
        return request;
    }

    private Usuario usuarioGuardado(String contrasena, boolean activo) {
        Usuario usuario = new Usuario();
        usuario.setId(7);
        usuario.setNombre("Ana");
        usuario.setCorreo("ana@correo.com");
        usuario.setContrasena(contrasena);
        usuario.setActivo(activo);
        return usuario;
    }

    @Test
    void guardarCifraLaContrasenaConBcrypt() {
        UsuarioResponse respuesta = servicio.guardar(solicitud("secreto1"));

        ArgumentCaptor<Usuario> capturado = ArgumentCaptor.forClass(Usuario.class);
        verify(repositorio).save(capturado.capture());
        String guardada = capturado.getValue().getContrasena();

        assertNotEquals("secreto1", guardada);
        assertTrue(encoder.matches("secreto1", guardada));
        assertEquals("ana@correo.com", respuesta.getCorreo());
        assertEquals("Estudiante", respuesta.getRol());
    }

    @Test
    void guardarExigeContrasena() {
        assertThrows(BusinessException.class, () -> servicio.guardar(solicitud(null)));
        verify(repositorio, never()).save(any(Usuario.class));
    }

    @Test
    void guardarRechazaContrasenaCorta() {
        assertThrows(BusinessException.class, () -> servicio.guardar(solicitud("123")));
    }

    @Test
    void guardarRechazaCorreoDuplicado() {
        when(repositorio.findByCorreoIgnoreCase("ana@correo.com"))
                .thenReturn(Optional.of(usuarioGuardado("x", true)));

        assertThrows(ResourceAlreadyExistsException.class, () -> servicio.guardar(solicitud("secreto1")));
        verify(repositorio, never()).save(any(Usuario.class));
    }

    @Test
    void autenticarAceptaContrasenaCorrecta() {
        Usuario usuario = usuarioGuardado(encoder.encode("secreto1"), true);
        when(repositorio.findByCorreoIgnoreCase("ana@correo.com")).thenReturn(Optional.of(usuario));

        UsuarioResponse respuesta = servicio.autenticar("ana@correo.com", "secreto1");

        assertEquals(7, respuesta.getId());
    }

    @Test
    void autenticarRechazaContrasenaIncorrecta() {
        Usuario usuario = usuarioGuardado(encoder.encode("secreto1"), true);
        when(repositorio.findByCorreoIgnoreCase("ana@correo.com")).thenReturn(Optional.of(usuario));

        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.autenticar("ana@correo.com", "otra-clave"));
    }

    @Test
    void autenticarRechazaCorreoInexistente() {
        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.autenticar("nadie@correo.com", "secreto1"));
    }

    @Test
    void autenticarRechazaUsuarioInactivo() {
        Usuario usuario = usuarioGuardado(encoder.encode("secreto1"), false);
        when(repositorio.findByCorreoIgnoreCase("ana@correo.com")).thenReturn(Optional.of(usuario));

        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.autenticar("ana@correo.com", "secreto1"));
    }

    @Test
    void autenticarMigraContrasenaEnTextoPlano() {
        Usuario usuario = usuarioGuardado("secreto1", true);
        when(repositorio.findByCorreoIgnoreCase("ana@correo.com")).thenReturn(Optional.of(usuario));

        servicio.autenticar("ana@correo.com", "secreto1");

        ArgumentCaptor<Usuario> capturado = ArgumentCaptor.forClass(Usuario.class);
        verify(repositorio).save(capturado.capture());
        assertTrue(capturado.getValue().getContrasena().startsWith("$2"));
        assertTrue(encoder.matches("secreto1", capturado.getValue().getContrasena()));
    }

    @Test
    void eliminarBorraElUsuarioCuandoNoTieneRegistrosAsociados() {
        Usuario usuario = usuarioGuardado("x", true);
        when(repositorio.findById(7)).thenReturn(Optional.of(usuario));

        servicio.eliminar(7);

        verify(verificador).verificarUsuario(7, "Ana");
        verify(repositorio).delete(usuario);
    }

    @Test
    void eliminarNoBorraSiHayRegistrosAsociados() {
        Usuario usuario = usuarioGuardado("x", true);
        when(repositorio.findById(7)).thenReturn(Optional.of(usuario));
        doThrow(new ResourceConflictException("bloqueado")).when(verificador).verificarUsuario(7, "Ana");

        assertThrows(ResourceConflictException.class, () -> servicio.eliminar(7));
        verify(repositorio, never()).delete(any(Usuario.class));
    }
}
