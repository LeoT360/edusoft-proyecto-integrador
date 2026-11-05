import React from 'react';
import { ChartLine } from 'lucide-react';
import PageHeader from '../shared/PageHeader';
import '../shared/Shared.css';
import './Reportes.css';

function ReportesEstadisticos() {
  return (
    <div className="es-page">
      <PageHeader
        title="Reportes"
        subtitle="Estadísticas y exportación de datos del sistema"
      />
      <div className="es-state" style={{ padding: '3rem 1.5rem' }}>
        <ChartLine size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
        <p style={{ fontSize: '1.05rem', margin: '0 0 0.5rem' }}>
          Este módulo se implementará próximamente.
        </p>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          Las estadísticas y la exportación de datos se integrarán con Python.
        </p>
      </div>
    </div>
  );
}

export default ReportesEstadisticos;
