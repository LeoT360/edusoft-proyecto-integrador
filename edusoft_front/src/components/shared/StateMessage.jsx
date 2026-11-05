/**
 * LoadingState, ErrorState y EmptyState — mensajes uniformes de carga, error y lista vacía.
 */
import React from 'react';
import './Shared.css';

export function LoadingState({ message = 'Cargando...' }) {
  return <div className="es-state">{message}</div>;
}

export function ErrorState({ message }) {
  if (!message) return null;
  return <div className="es-state-error">{message}</div>;
}

export function EmptyState({ message = 'No hay datos.' }) {
  return <div className="es-state">{message}</div>;
}
