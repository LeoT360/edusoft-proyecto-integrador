/**
 * usuarioService — cliente HTTP del recurso /usuarios y del inicio de sesión (/auth/login).
 */
import { API_BASE_URL } from '../utils/api';
import { handleResponse } from './http';

const API_URL = `${API_BASE_URL}/usuarios`;

export const usuarioService = {
  listarTodos: async () => {
    const response = await fetch(API_URL);
    return handleResponse(response, 'Error al obtener los usuarios');
  },

  buscarPorId: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return handleResponse(response, `No se encontró el usuario con ID ${id}`);
  },

  crear: async (usuario) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    });
    return handleResponse(response, 'Error al crear el usuario');
  },

  actualizar: async (id, usuario) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    });
    return handleResponse(response, 'Error al actualizar el usuario');
  },

  eliminar: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return handleResponse(response, 'Error al eliminar el usuario');
  },

  /**
   * Inicia sesión: el servidor valida las credenciales y devuelve el usuario sin contraseña.
   * Si son incorrectas lanza un Error con `status === 401`.
   */
  login: async (correo, contrasena) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena }),
    });
    return handleResponse(response, 'Correo o contraseña incorrectos');
  },
};
