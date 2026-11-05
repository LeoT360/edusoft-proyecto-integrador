/**
 * notaService — cliente HTTP del recurso /notas de la API (incluye búsqueda por correo).
 */
import { API_BASE_URL } from '../utils/api';
import { handleResponse } from './http';

const API_URL = `${API_BASE_URL}/notas`;

export const notaService = {
  listarTodas: async () => {
    const response = await fetch(API_URL);
    return handleResponse(response, 'Error al obtener las notas');
  },

  buscarPorEmail: async (email) => {
    const response = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
    return handleResponse(response, 'Error al filtrar notas por email');
  },

  buscarPorId: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return handleResponse(response, `No se encontró la nota con ID ${id}`);
  },

  crear: async (nota) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nota),
    });
    return handleResponse(response, 'Error al crear la nota');
  },

  actualizar: async (id, nota) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nota),
    });
    return handleResponse(response, 'Error al actualizar la nota');
  },

  eliminar: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return handleResponse(response, 'Error al eliminar la nota');
  },
};
