import React from 'react';
import './Shared.css';

/**
 * DataTable — tabla genérica.
 * `columns`: [{ key, label, render?: (row) => ReactNode }]; `rowKey`: campo único de cada fila.
 */
export default function DataTable({ columns, rows, rowKey = 'id', emptyMessage = 'No hay registros.' }) {
  if (!rows?.length) {
    return <div className="es-state">{emptyMessage}</div>;
  }

  return (
    <div className="es-table-wrap">
      <table className="es-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row[rowKey] ?? idx}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
