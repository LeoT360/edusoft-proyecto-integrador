/**
 * LoginUsuarios — formulario de inicio de sesión. Las credenciales las valida el servidor
 * (POST /auth/login); aquí solo se guarda en localStorage el usuario que devuelve.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mostrarAlerta } from '../../utils/swalConfig';
import { setUsuarioActual } from '../../utils/auth';
import { usuarioService } from '../../services/usuarioService';
import logoEdusoft from '../../assets/logo-edusoft.svg';
import '../shared/Auth.css';

function LoginUsuarios() {
  const [login, setLogin] = useState({ correo: '', contrasena: '' });
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const capturarDatos = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const envioDatos = async (e) => {
    e.preventDefault();
    if (!login.correo || !login.contrasena) {
      mostrarAlerta({ icon: 'error', title: 'Campos requeridos', text: 'Correo y contraseña son obligatorios' });
      return;
    }
    setCargando(true);
    try {
      const usuario = await usuarioService.login(login.correo, login.contrasena);
      setUsuarioActual(usuario);
      mostrarAlerta({
        icon: 'success',
        title: 'Bienvenido',
        text: `Hola, ${usuario.nombre}`,
        timer: 1400,
        showConfirmButton: false,
      });
      navigate('/home');
    } catch (err) {
      // 401: credenciales inválidas (mensaje del servidor). Sin status: el servidor no respondió.
      const sinConexion = err.status === undefined;
      mostrarAlerta({
        icon: 'error',
        title: 'Error',
        text: sinConexion ? 'No se pudo conectar con el servidor' : err.message,
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <button type="button" className="auth-back" onClick={() => navigate('/')}>
          <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Volver al inicio
        </button>
        <h1>Iniciar sesión</h1>
        <p className="auth-sub">Accede a la plataforma de gestión académica EduSoft.</p>
        <form className="auth-form" onSubmit={envioDatos}>
          <div className="auth-field">
            <label htmlFor="correo">Correo</label>
            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="username"
              value={login.correo}
              onChange={capturarDatos}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              value={login.contrasena}
              onChange={capturarDatos}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="auth-submit" disabled={cargando}>
            {cargando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
      <aside className="auth-visual" aria-hidden="true">
        <img
          className="auth-bg"
          src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt=""
        />
        <div className="auth-visual-content">
          <img className="auth-logo" src={logoEdusoft} alt="EduSoft" />
          <p>Gestión estudiantil clara, ordenada y centrada en tu institución.</p>
        </div>
      </aside>
    </div>
  );
}

export default LoginUsuarios;
