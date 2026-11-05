/**
 * PageHeader — encabezado de página con título, subtítulo y acciones opcionales.
 */
import React from 'react';
import './Shared.css';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="es-page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="es-actions">{actions}</div>}
    </div>
  );
}
