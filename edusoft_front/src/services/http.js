/**
 * Utilidades HTTP compartidas por todos los servicios.
 */

/**
 * Procesa una respuesta de fetch: devuelve el JSON (o texto, o null si no hay cuerpo)
 * y, si el servidor respondió con error, lanza un Error con el mensaje del backend.
 * El error incluye `status` (código HTTP) para que la UI pueda distinguir, por ejemplo,
 * un 401 de una caída de red.
 *
 * @param {Response} response Respuesta de fetch.
 * @param {string} fallbackMessage Mensaje a usar si el servidor no envía uno.
 */
export async function handleResponse(response, fallbackMessage) {
  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(errorText || fallbackMessage);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
