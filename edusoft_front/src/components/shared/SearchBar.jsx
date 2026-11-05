/**
 * SearchBar — campo de búsqueda controlado; llama a onChange con el texto escrito.
 */
import React from 'react';
import { X } from 'lucide-react';
import './Shared.css';

export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="es-toolbar">
      <input
        className="es-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button type="button" className="es-btn es-btn-ghost es-btn-sm" onClick={() => onChange('')} title="Limpiar">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
