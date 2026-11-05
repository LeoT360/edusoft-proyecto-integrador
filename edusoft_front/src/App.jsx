import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUsuarioActual } from './utils/auth';

// Páginas públicas y de usuarios
import Inicio from './components/pages/Inicio';
import Home from './components/pages/Home';
import LoginUsuarios from './components/usuarios/LoginUsuarios';
import UsuarioFormulario from './components/usuarios/UsuarioFormulario';
import ListaUsuarios from './components/usuarios/ListaUsuarios';

// Módulos (cada listado gestiona crear/editar mediante modales)
import ListaNotificaciones from './components/notificaciones/ListaNotificaciones';
import ListaProfesores from './components/profesores/ListaProfesores';
import ListaCursos from './components/cursos/ListaCursos';
import ListaAsistencias from './components/asistencias/ListaAsistencias';
import ListaNotas from './components/notas/ListaNotas';
import ListaMatricula from './components/matricula/ListaMatricula';
import ReportesEstadisticos from './components/reportes/ReportesEstadisticos';

import Navbar from './components/shared/Navbar';

import './App.css';
import './components/shared/Shared.css';
import './components/shared/Colores.css';

// Aplica el modo oscuro antes del primer render para evitar el "flash" de tema claro al recargar.
(function initDarkMode() {
  if (localStorage.getItem('edusoft-dark') === 'true') {
    document.body.classList.add('dark');
  }
})();

/**
 * Guard de rutas privadas: exige sesión iniciada y, si `soloProfesor` es true,
 * rol Profesor. Envuelve el contenido con la barra de navegación.
 *
 * Importante: este control es solo de interfaz. La API no valida roles todavía
 * (ver "Limitaciones conocidas" en el README general).
 */
function RutaPrivada({ children, soloProfesor = false }) {
  const usuario = getUsuarioActual();

  if (!usuario) return <Navigate to="/login" replace />;
  if (soloProfesor && usuario.rol !== 'Profesor') return <Navigate to="/home" replace />;

  return (
    <>
      <Navbar />
      <main className="protected-content">{children}</main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<LoginUsuarios />} />
        <Route path="/registro" element={<UsuarioFormulario />} />

        {/* Ambos roles (el estudiante ve solo sus propios registros donde aplica) */}
        <Route path="/home" element={<RutaPrivada><Home /></RutaPrivada>} />
        <Route path="/notificaciones" element={<RutaPrivada><ListaNotificaciones /></RutaPrivada>} />
        <Route path="/profesores" element={<RutaPrivada><ListaProfesores /></RutaPrivada>} />
        <Route path="/cursos" element={<RutaPrivada><ListaCursos /></RutaPrivada>} />
        <Route path="/asistencias" element={<RutaPrivada><ListaAsistencias /></RutaPrivada>} />
        <Route path="/notas" element={<RutaPrivada><ListaNotas /></RutaPrivada>} />
        <Route path="/matricula" element={<RutaPrivada><ListaMatricula /></RutaPrivada>} />

        {/* Solo Profesor */}
        <Route path="/usuarios" element={<RutaPrivada soloProfesor><ListaUsuarios /></RutaPrivada>} />
        <Route path="/reportes" element={<RutaPrivada soloProfesor><ReportesEstadisticos /></RutaPrivada>} />

        {/* Cualquier otra ruta vuelve al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
