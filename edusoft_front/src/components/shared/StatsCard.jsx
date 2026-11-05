/**
 * StatsCard y StatsGrid — indicadores numéricos resumidos que se muestran sobre los listados.
 */
import React from 'react';
import './Shared.css';

export default function StatsCard({ label, value, icon }) {
  return (
    <div className="es-stat-card">
      <div className="es-stat-label">
        {icon} {label}
      </div>
      <div className="es-stat-value">{value}</div>
    </div>
  );
}

export function StatsGrid({ children }) {
  return <div className="es-kpis">{children}</div>;
}
