/**
 * UsuarioFormulario — registro público de cuentas. Siempre crea usuarios con rol Estudiante.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mostrarAlerta } from '../../utils/swalConfig';
import { usuarioService } from '../../services/usuarioService';
import logoEdusoft from '../../assets/logo-edusoft.svg';
import '../shared/Auth.css';

function UsuarioFormulario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    documento: '',
    telefono: '',
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const capturarDatos = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const envioDatos = async (e) => {
    e.preventDefault();
    if (!usuario.nombre || !usuario.correo || !usuario.contrasena || !usuario.documento) {
      setError('Nombre, correo, documento y contraseña son obligatorios');
      return;
    }
    if (usuario.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setError('');
    setCargando(true);
    try {
      await usuarioService.crear({
        nombre: usuario.nombre.trim(),
        correo: usuario.correo.trim(),
        contrasena: usuario.contrasena,
        documento: usuario.documento.trim(),
        telefono: usuario.telefono || null,
        rol: 'Estudiante',
      });
      await mostrarAlerta({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta de estudiante fue creada. Ya puedes iniciar sesión.',
      });
      navigate('/login');
    } catch (err) {
      mostrarAlerta({ icon: 'error', title: 'Error', text: err.message || 'No se pudo registrar' });
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
        <h1>Crear cuenta</h1>
        <form className="auth-form" onSubmit={envioDatos}>
          <div className="auth-field">
            <label htmlFor="nombre">Nombre completo</label>
            <input id="nombre" name="nombre" value={usuario.nombre} onChange={capturarDatos} />
          </div>
          <div className="auth-field">
            <label htmlFor="documento">Documento</label>
            <input id="documento" name="documento" value={usuario.documento} onChange={capturarDatos} />
          </div>
          <div className="auth-field">
            <label htmlFor="correo">Correo</label>
            <input id="correo" name="correo" type="email" value={usuario.correo} onChange={capturarDatos} />
          </div>
          <div className="auth-field">
            <label htmlFor="contrasena">Contraseña</label>
            <input id="contrasena" name="contrasena" type="password" value={usuario.contrasena} onChange={capturarDatos} />
          </div>
          <div className="auth-field">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input id="telefono" name="telefono" value={usuario.telefono} onChange={capturarDatos} />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
      <aside className="auth-visual" aria-hidden="true">
        <img
          className="auth-bg"
          src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt=""
        />
        <div className="auth-visual-content">
          <img className="auth-logo" src={logoEdusoft} alt="EduSoft" />
          <p>Únete a la plataforma y gestiona tu vida académica en un solo lugar.</p>
        </div>
      </aside>
    </div>
  );
}

export default UsuarioFormulario;
