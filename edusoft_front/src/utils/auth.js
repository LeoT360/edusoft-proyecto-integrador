/**
 * Sesión del usuario en localStorage (clave "usuario"). Solo guarda los datos públicos que
 * devuelve la API; la contraseña nunca llega al navegador.
 */

/** Devuelve el usuario con sesión iniciada, o null si no hay sesión o el valor está corrupto. */
export function getUsuarioActual() {
  try {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Indica si el usuario actual tiene rol Profesor. */
export function esProfesor() {
  const u = getUsuarioActual();
  return u?.rol === 'Profesor';
}

/** Guarda al usuario tras un inicio de sesión exitoso. */
export function setUsuarioActual(usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

/** Cierra la sesión. */
export function clearUsuarioActual() {
  localStorage.removeItem('usuario');
}
