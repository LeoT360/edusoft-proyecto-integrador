/**
 * confirmDelete — pide confirmación antes de eliminar. Devuelve true si la persona confirma.
 */
import { mostrarAlerta } from '../../utils/swalConfig';

export async function confirmDelete(itemLabel = 'este registro') {
  const result = await mostrarAlerta({
    title: '¿Eliminar?',
    text: `Se eliminará ${itemLabel}. Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
  });
  return result.isConfirmed;
}
