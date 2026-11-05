/**
 * Home — panel principal tras iniciar sesión; muestra los módulos disponibles según el rol.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Bell, BookOpen, ChartLine, ClipboardCheck, ClipboardList,
  FileText, GraduationCap, Users, UserCheck, BookMarked, TrendingUp,
} from 'lucide-react';
import { getUsuarioActual, esProfesor } from '../../utils/auth';
import StatsCard, { StatsGrid } from '../shared/StatsCard';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const usuario = getUsuarioActual();
  const esProf = esProfesor();
  const nombre = usuario?.nombre || 'Usuario';

  const tarjetas = [
    {
      titulo: 'Usuarios',
      descripcion: 'Cuentas y roles del sistema.',
      icono: Users,
      ruta: '/usuarios',
      disponible: esProf,
      soloProfesor: true,
    },
    {
      titulo: 'Notificaciones',
      descripcion: 'Mensajes y avisos académicos.',
      icono: Bell,
      ruta: '/notificaciones',
      disponible: true,
      soloProfesor: false,
    },
    {
      titulo: 'Profesores',
      descripcion: 'Perfiles del cuerpo docente.',
      icono: GraduationCap,
      ruta: '/profesores',
      disponible: true,
      soloProfesor: false,
    },
    {
      titulo: 'Cursos',
      descripcion: 'Catálogo y asignación docente.',
      icono: BookOpen,
      ruta: '/cursos',
      disponible: true,
      soloProfesor: false,
    },
    {
      titulo: 'Matrículas',
      descripcion: 'Inscripciones a cursos.',
      icono: ClipboardList,
      ruta: '/matricula',
      disponible: true,
      soloProfesor: false,
    },
    {
      titulo: 'Notas',
      descripcion: 'Calificaciones (escala 0–5).',
      icono: FileText,
      ruta: '/notas',
      disponible: true,
      soloProfesor: false,
    },
    {
      titulo: 'Asistencias',
      descripcion: 'Registro de presencia en clase.',
      icono: ClipboardCheck,
      ruta: '/asistencias',
      disponible: true,
      soloProfesor: false,
    },
    {
      titulo: 'Reportes',
      descripcion: 'Estadísticas y exportación.',
      icono: ChartLine,
      ruta: '/reportes',
      disponible: esProf,
      soloProfesor: true,
    },
  ];

  const tarjetasVisibles = tarjetas.filter((t) => t.disponible);

  return (
    <div className="home-page">
      <header className="home-hero">
        <div>
          <p className="home-eyebrow">{esProf ? 'Panel docente' : 'Panel estudiante'}</p>
          <h1>Hola, {nombre}</h1>
          <p className="home-lead">
            Accede a los módulos de gestión académica según tu rol.
          </p>
        </div>
      </header>

      <section className="home-grid">
        {tarjetasVisibles.map((t) => {
          const Icon = t.icono;
          return (
            <button
              key={t.ruta}
              type="button"
              className={`home-card${t.proximamente ? ' is-soon' : ''}`}
              onClick={() => !t.proximamente && navigate(t.ruta)}
              disabled={t.proximamente}
            >
              <span className="home-card-icon"><Icon size={26} strokeWidth={1.75} /></span>
              <span className="home-card-body">
                <span className="home-card-title">
                  {t.titulo}
                  {t.soloProfesor && <span className="home-badge">Profesor</span>}
                  {t.proximamente && <span className="home-badge soon">Pronto</span>}
                </span>
                <span className="home-card-desc">{t.descripcion}</span>
              </span>
              {!t.proximamente && (
                <span className="home-card-arrow"><ArrowRight size={18} /></span>
              )}
            </button>
          );
        })}
      </section>

      <section className="home-stats">
        <StatsGrid>
          <StatsCard
            label="Estudiantes activos"
            value="248"
            icon={<UserCheck size={16} />}
          />
          <StatsCard
            label="Cursos vigentes"
            value="32"
            icon={<BookMarked size={16} />}
          />
          <StatsCard
            label="Promedio general"
            value="4.2"
            icon={<TrendingUp size={16} />}
          />
        </StatsGrid>
      </section>
    </div>
  );
}

export default Home;
