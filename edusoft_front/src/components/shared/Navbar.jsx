/**
 * Navbar — barra lateral de navegación. Oculta las secciones solo-Profesor a los estudiantes,
 * alterna el modo oscuro (se guarda en localStorage) y cierra la sesión.
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Bell, BookOpen, ChartLine, ClipboardList, FileText, GraduationCap,
  House, LogOut, Menu, Moon, School, Sun, Users, X,
} from 'lucide-react';
import logoEdusoft from '../../assets/title-edusoft.svg';
import logoWhiteEdusoft from '../../assets/title-white-edusoft.svg';
import { getUsuarioActual } from '../../utils/auth';
import './Navbar.css';

const SECCIONES = [
  { id: 'home', icono: House, label: 'Inicio', ruta: '/home' },
  { id: 'usuarios', icono: Users, label: 'Usuarios', ruta: '/usuarios', soloProfesor: true },
  { id: 'notificaciones', icono: Bell, label: 'Notificaciones', ruta: '/notificaciones' },
  { id: 'profesores', icono: GraduationCap, label: 'Profesores', ruta: '/profesores' },
  { id: 'cursos', icono: BookOpen, label: 'Cursos', ruta: '/cursos' },
  { id: 'matricula', icono: School, label: 'Matrícula', ruta: '/matricula' },
  { id: 'notas', icono: FileText, label: 'Notas', ruta: '/notas' },
  { id: 'asistencias', icono: ClipboardList, label: 'Asistencias', ruta: '/asistencias' },
  { id: 'reportes', icono: ChartLine, label: 'Reportes', ruta: '/reportes', soloProfesor: true },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('edusoft-dark') === 'true');
  const usuario = getUsuarioActual();
  const esProfesor = usuario?.rol === 'Profesor';

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('edusoft-dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    setMenuAbierto(false);
  }, [location.pathname]);

  const salir = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const activo = (ruta) =>
    location.pathname === ruta || location.pathname.startsWith(`${ruta}/`);

  const items = SECCIONES.filter((s) => !s.soloProfesor || esProfesor);

  const navList = (
    <nav className="nav-list" aria-label="Principal">
      {items.map((sec) => {
        const Icon = sec.icono;
        return (
          <button
            key={sec.id}
            type="button"
            className={`nav-item${activo(sec.ruta) ? ' is-active' : ''}`}
            onClick={() => navigate(sec.ruta)}
          >
            <Icon size={18} strokeWidth={1.75} />
            <span>{sec.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="sidebar">
        <button type="button" className="sidebar-brand" onClick={() => navigate('/home')}>
          <img src={darkMode ? logoWhiteEdusoft : logoEdusoft} alt="EduSoft" />
        </button>

        <div className="sidebar-user">
          <strong>{usuario?.nombre || 'Usuario'}</strong>
          <span>{usuario?.rol || '—'}</span>
        </div>

        {navList}

        <div className="sidebar-footer">
          <button type="button" className="nav-item" onClick={() => setDarkMode((v) => !v)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
          <button type="button" className="nav-item is-danger" onClick={salir}>
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <header className="topbar">
        <img
          src={darkMode ? logoWhiteEdusoft : logoEdusoft}
          alt="EduSoft"
          className="topbar-logo"
          onClick={() => navigate('/home')}
        />
        <div className="topbar-actions">
          <button type="button" className="topbar-btn" onClick={() => setDarkMode((v) => !v)} aria-label="Tema">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="topbar-btn"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuAbierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {menuAbierto && (
        <div className="drawer-overlay" onClick={() => setMenuAbierto(false)} role="presentation">
          <div className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="drawer-header">
              <div>
                <strong>{usuario?.nombre || 'Usuario'}</strong>
                <span>{usuario?.rol || '—'}</span>
              </div>
              <button type="button" className="topbar-btn" onClick={() => setMenuAbierto(false)} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>
            {navList}
            <div className="drawer-footer">
              <button type="button" className="nav-item is-danger" onClick={salir}>
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
