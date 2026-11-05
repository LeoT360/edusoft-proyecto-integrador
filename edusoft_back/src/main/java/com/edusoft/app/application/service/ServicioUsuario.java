package com.edusoft.app.application.service;

import com.edusoft.app.application.dto.usuario.UsuarioRequest;
import com.edusoft.app.application.dto.usuario.UsuarioResponse;
import com.edusoft.app.domain.exceptions.BusinessException;
import com.edusoft.app.domain.exceptions.CredencialesInvalidasException;
import com.edusoft.app.domain.exceptions.ResourceAlreadyExistsException;
import com.edusoft.app.domain.exceptions.ResourceNotFoundException;
import com.edusoft.app.domain.models.Usuario;
import com.edusoft.app.infrastructure.repository.IRepositorioUsuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Casos de uso de usuarios: CRUD y autenticación. Las contraseñas se guardan con BCrypt. */
@Service
@Transactional
public class ServicioUsuario {

    static final int LONGITUD_MINIMA_CONTRASENA = 6;
    private static final String MENSAJE_CREDENCIALES = "Correo o contraseña incorrectos";

    private final IRepositorioUsuario repositorio;
    private final PasswordEncoder passwordEncoder;
    private final VerificadorDependencias verificador;

    public ServicioUsuario(IRepositorioUsuario repositorio,
                           PasswordEncoder passwordEncoder,
                           VerificadorDependencias verificador) {
        this.repositorio = repositorio;
        this.passwordEncoder = passwordEncoder;
        this.verificador = verificador;
    }

    /** Crea un usuario. La contraseña es obligatoria y el correo no puede estar repetido. */
    public UsuarioResponse guardar(UsuarioRequest request) {
        Usuario entity = new Usuario();
        apply(request, entity, true);
        if (entity.getRol() == null || entity.getRol().isBlank()) {
            entity.setRol("Estudiante");
        }
        if (entity.getActivo() == null) {
            entity.setActivo(true);
        }
        return toResponse(repositorio.save(entity));
    }

    /** Actualiza un usuario. Si no se envía contraseña, se conserva la actual. */
    public UsuarioResponse actualizar(Integer id, UsuarioRequest request) {
        Usuario entity = repositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el usuario con ID " + id));
        apply(request, entity, false);
        return toResponse(repositorio.save(entity));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> buscarTodos() {
        return repositorio.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Integer id) {
        return repositorio.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el usuario con ID " + id));
    }

    /** Elimina un usuario solo si no tiene registros asociados (ver {@link VerificadorDependencias}). */
    public void eliminar(Integer id) {
        Usuario usuario = repositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el usuario con ID " + id));
        verificador.verificarUsuario(id, usuario.getNombre());
        repositorio.delete(usuario);
    }

    /**
     * Valida correo y contraseña. Usa el mismo mensaje para "correo inexistente",
     * "contraseña errónea" y "usuario inactivo" para no revelar qué cuentas existen.
     *
     * <p>Transición: si la contraseña guardada aún está en texto plano (usuarios creados
     * antes de introducir BCrypt), se acepta una sola vez y se re-guarda cifrada.
     */
    public UsuarioResponse autenticar(String correo, String contrasena) {
        Usuario usuario = repositorio.findByCorreoIgnoreCase(correo.trim())
                .orElseThrow(() -> new CredencialesInvalidasException(MENSAJE_CREDENCIALES));

        String guardada = usuario.getContrasena();
        boolean coincide;
        if (esHashBcrypt(guardada)) {
            coincide = passwordEncoder.matches(contrasena, guardada);
        } else {
            coincide = guardada != null && guardada.equals(contrasena);
            if (coincide) {
                usuario.setContrasena(passwordEncoder.encode(contrasena));
                repositorio.save(usuario);
            }
        }

        if (!coincide || !Boolean.TRUE.equals(usuario.getActivo())) {
            throw new CredencialesInvalidasException(MENSAJE_CREDENCIALES);
        }
        return toResponse(usuario);
    }

    private static boolean esHashBcrypt(String valor) {
        return valor != null && valor.startsWith("$2");
    }

    /** Copia los datos del request a la entidad, resolviendo las entidades relacionadas. */
    private void apply(UsuarioRequest request, Usuario entity, boolean creating) {
        String correo = request.getCorreo().trim();
        repositorio.findByCorreoIgnoreCase(correo)
                .filter(existente -> !existente.getId().equals(entity.getId()))
                .ifPresent(existente -> {
                    throw new ResourceAlreadyExistsException("Ya existe un usuario con el correo " + correo);
                });

        entity.setNombre(request.getNombre());
        entity.setCorreo(correo);

        String contrasena = request.getContrasena();
        if (contrasena != null && !contrasena.isBlank()) {
            if (contrasena.length() < LONGITUD_MINIMA_CONTRASENA) {
                throw new BusinessException(
                        "La contraseña debe tener al menos " + LONGITUD_MINIMA_CONTRASENA + " caracteres");
            }
            entity.setContrasena(passwordEncoder.encode(contrasena));
        } else if (creating) {
            throw new BusinessException("La contraseña es obligatoria al crear el usuario");
        }

        if (request.getRol() != null && !request.getRol().isBlank()) {
            entity.setRol(request.getRol());
        }
        entity.setTelefono(request.getTelefono());
        entity.setDocumento(request.getDocumento());
        if (request.getActivo() != null) {
            entity.setActivo(request.getActivo());
        }
    }

    /** Convierte la entidad en el DTO de respuesta. */
    private UsuarioResponse toResponse(Usuario entity) {
        UsuarioResponse r = new UsuarioResponse();
        r.setId(entity.getId());
        r.setNombre(entity.getNombre());
        r.setCorreo(entity.getCorreo());
        r.setRol(entity.getRol());
        r.setTelefono(entity.getTelefono());
        r.setDocumento(entity.getDocumento());
        r.setActivo(entity.getActivo());
        return r;
    }
}
