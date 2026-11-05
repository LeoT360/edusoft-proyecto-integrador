/**
 * DetailModal — ventana de solo lectura. Recibe `fields` ([{ label, value }]) y/o `children`.
 */
import React from 'react';
import { X } from 'lucide-react';
import './Shared.css';

export default function DetailModal({ title = 'Detalle', fields = [], onClose, children }) {
  return (
    <div className="es-modal-overlay" role="presentation">
      <div className="es-modal" role="dialog" aria-modal="true">
        <div className="es-modal-header">
          <h2>{title}</h2>
          <button type="button" className="es-btn es-btn-ghost es-btn-sm" onClick={onClose} title="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="es-modal-body">
          {children || (
            <dl>
              {fields.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value != null && f.value !== '' ? String(f.value) : '—'}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
