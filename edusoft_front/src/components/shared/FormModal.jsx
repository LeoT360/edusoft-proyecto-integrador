/**
 * FormModal — contenedor modal para formularios de crear/editar. No renderiza nada si `open` es falso.
 */
import React from 'react';
import { X } from 'lucide-react';
import './Shared.css';

export default function FormModal({
  title,
  open,
  onClose,
  children,
  width = 520,
}) {
  if (!open) return null;

  return (
    <div className="es-modal-overlay" role="presentation">
      <div
        className="es-modal es-form-modal"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
      >
        <div className="es-modal-header">
          <h2>{title}</h2>
          <button type="button" className="es-btn es-btn-ghost es-btn-sm" onClick={onClose} title="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="es-modal-body es-form-modal-body">{children}</div>
      </div>
    </div>
  );
}
