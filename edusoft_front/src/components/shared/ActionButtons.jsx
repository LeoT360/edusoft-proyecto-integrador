/**
 * ActionButtons — botones Ver / Editar / Eliminar de una fila o tarjeta. Editar y Eliminar
 * solo se muestran si el handler existe y el permiso (canEdit / canDelete) es verdadero.
 */
import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import './Shared.css';

export default function ActionButtons({ onView, onEdit, onDelete, canEdit = true, canDelete = true }) {
  return (
    <div className="es-actions">
      {onView && (
        <button type="button" className="es-btn es-btn-ghost es-btn-sm" onClick={onView} title="Ver">
          <Eye size={16} />
        </button>
      )}
      {canEdit && onEdit && (
        <button type="button" className="es-btn es-btn-secondary es-btn-sm" onClick={onEdit} title="Editar">
          <Pencil size={16} />
        </button>
      )}
      {canDelete && onDelete && (
        <button type="button" className="es-btn es-btn-danger es-btn-sm" onClick={onDelete} title="Eliminar">
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
