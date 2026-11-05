/**
 * CardGrid y EntityCard — cuadrícula de tarjetas y tarjeta de entidad (id, título, contenido y pie).
 */
import React from 'react';
import './Shared.css';

export default function CardGrid({ children }) {
  return <div className="es-grid">{children}</div>;
}

export function EntityCard({ id, title, children, footer }) {
  return (
    <div className="es-card">
      {id != null && <div className="es-card-id">#{id}</div>}
      {title && <h3>{title}</h3>}
      {children}
      {footer && <div className="es-card-footer">{footer}</div>}
    </div>
  );
}
