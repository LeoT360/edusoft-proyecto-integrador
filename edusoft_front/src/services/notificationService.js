/**
 * notificationService — cliente HTTP del recurso /notificaciones.
 */
import { API_BASE_URL } from '../utils/api';
import { handleResponse } from './http';

const API_URL = `${API_BASE_URL}/notificaciones`;

export const notificationService = {
  listarTodas: async () => {
    const response = await fetch(API_URL);
    return handleResponse(response, 'Error al listar');
  },

  buscarPorId: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return handleResponse(response, `No se encontró el registro con ID ${id}`);
  },

  crear: async (data) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response, 'Error al crear');
  },

  actualizar: async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response, 'Error al actualizar');
  },

  eliminar: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return handleResponse(response, 'Error al eliminar');
  },
};
