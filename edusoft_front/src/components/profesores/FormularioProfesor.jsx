import { BookOpen, FileIcon, ImageIcon, User } from 'lucide-react';
// ====================================
// FORMULARIO PROFESOR - CORREGIDO
// ✅ celular como String (no Integer)
// ✅ foto solo por URL (no base64 al backend)
// ✅ solo campos que existen en Profesor.java
// ====================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { profesorService } from '../../services/profesorService';
import './Profesores.css';

const FORM_INICIAL = {
  nombreCompleto:    '',
  numeroDocumento:   '',
  correoElectronico: '',
  celular:           '',   //  String siempre
  edad:              '',
  tipoIdentificacion: '',
  estadoCivil:       '',
  genero:            '',
  nivelAcademico:    '',
  areasAsignadas:    '',
  anosExperiencia:   '',
  tipoContrato:      '',
  jornadaLaboral:    '',
  perfilProfesional: '',
  foto:              '',   //  solo URL, NO base64
  hojaDeVida:        '',
  vigencia:          true,
};

function FormularioProfesor() {
  const navigate    = useNavigate();
  const location   = useLocation();
  const fromUsuario = location.state?.fromUsuario;
  const { id }      = useParams();
  const modoEdicion = Boolean(id);

  const [formData,     setFormData]     = useState(FORM_INICIAL);
  const [mensaje,      setMensaje]      = useState('');
  const [tipoMsg,      setTipoMsg]      = useState('');
  const [cargando,     setCargando]     = useState(false);
  const [cargandoProf, setCargandoProf] = useState(modoEdicion);

  // ── En modo edición carga los datos del profesor ──
  
  useEffect(() => {
    if (id || !fromUsuario) return;
    setFormData((prev) => ({
      ...prev,
      nombreCompleto: fromUsuario.nombre || prev.nombreCompleto || '',
      correoElectronico: fromUsuario.correo || prev.correoElectronico || '',
      celular: fromUsuario.telefono || prev.celular || '',
    }));
  }, [id, fromUsuario]);

  useEffect(() => {
    if (!modoEdicion) return;
    const cargar = async () => {
      try {
        const prof = await profesorService.buscarPorId(id);
        setFormData({
          nombreCompleto:    prof.nombreCompleto    || '',
          numeroDocumento:   prof.numeroDocumento   || '',
          correoElectronico: prof.correoElectronico || '',
          celular:           prof.celular != null   ? String(prof.celular) : '',
          edad:              prof.edad              || '',
          tipoIdentificacion: prof.tipoIdentificacion || '',
          estadoCivil:       prof.estadoCivil       || '',
          genero:            prof.genero            || '',
          nivelAcademico:    prof.nivelAcademico    || '',
          areasAsignadas:    prof.areasAsignadas    || '',
          anosExperiencia:   prof.anosExperiencia   || '',
          tipoContrato:      prof.tipoContrato      || '',
          jornadaLaboral:    prof.jornadaLaboral    || '',
          perfilProfesional: prof.perfilProfesional || '',
          foto:              prof.foto              || '',
          hojaDeVida:        prof.hojaDeVida        || '',
          vigencia:          prof.vigencia !== false,
          id:                prof.id,
        });
      } catch {
        setMensaje('No se pudo cargar el profesor. Verifica el backend.');
        setTipoMsg('error');
      } finally {
        setCargandoProf(false);
      }
    };
    cargar();
  }, [id, modoEdicion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validar = () => {
    if (!formData.nombreCompleto.trim())    return 'El nombre completo es obligatorio.';
    if (!formData.numeroDocumento.trim())   return 'El número de documento es obligatorio.';
    if (!formData.correoElectronico.trim()) return 'El correo electrónico es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico))
      return 'El correo electrónico no tiene un formato válido.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorVal = validar();
    if (errorVal) { setMensaje(errorVal); setTipoMsg('error'); return; }

    setCargando(true);
    setMensaje('');

    // ✅ Solo campos que existen en Profesor.java
    // celular va como String, anosExperiencia como Integer
    const datos = {
      ...(modoEdicion && formData.id ? { id: formData.id } : {}),
      nombreCompleto:    formData.nombreCompleto,
      numeroDocumento:   formData.numeroDocumento,
      correoElectronico: formData.correoElectronico,
      celular:           formData.celular || null,          // String o null
      edad:              formData.edad ? parseInt(formData.edad) : null,
      tipoIdentificacion: formData.tipoIdentificacion || null,
      estadoCivil:       formData.estadoCivil    || null,
      genero:            formData.genero         || null,
      nivelAcademico:    formData.nivelAcademico || null,
      areasAsignadas:    formData.areasAsignadas || null,
      anosExperiencia:   formData.anosExperiencia ? parseInt(formData.anosExperiencia) : null,
      tipoContrato:      formData.tipoContrato   || null,
      jornadaLaboral:    formData.jornadaLaboral || null,
      perfilProfesional: formData.perfilProfesional || null,
      foto:              formData.foto           || null,   // URL, no base64
      hojaDeVida:        formData.hojaDeVida     || null,
      vigencia:          formData.vigencia,
    };

    try {
      if (modoEdicion) {
        await profesorService.actualizar(id, datos);
        setMensaje('¡Profesor actualizado exitosamente!');
      } else {
        await profesorService.crear(datos);
        setMensaje('¡Profesor creado exitosamente!');
      }
      setTipoMsg('exito');
      setTimeout(() => navigate('/profesores'), 1800);
    } catch (err) {
      setMensaje(err.message || 'Error al conectar con el backend. Verifica que esté corriendo en el puerto 8080.');
      setTipoMsg('error');
    } finally {
      setCargando(false);
    }
  };

  if (cargandoProf) return (
    <div className="profesores-container">
      <div className="cargando-container">
        <div className="spinner-global" />
        <p>Cargando datos del profesor...</p>
      </div>
    </div>
  );

  return (
    <div className="profesores-container">
      <div className="profesor-form-wrapper">

        {/* ENCABEZADO */}
        <div className="form-info">
          <h3>{modoEdicion ? ' Editar Profesor' : ' Nuevo Profesor'}</h3>
          <p>{modoEdicion ? 'Modifica los datos del docente.' : 'Completa la información del nuevo docente.'}</p>
        </div>

        {/* MENSAJE DE ESTADO */}
        {mensaje && (
          <div className={`message-alert ${tipoMsg === 'exito' ? 'message-success' : 'message-error'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profesor-form">

          {/* ═══ DATOS PERSONALES ═══ */}
          <fieldset>
            <legend><User size={18} /> Datos Personales</legend>

            <div className="form-group">
              <label htmlFor="nombreCompleto">Nombre Completo *</label>
              <input id="nombreCompleto" name="nombreCompleto"
                value={formData.nombreCompleto} onChange={handleChange}
                placeholder="Ej: Juan Pérez García" />
            </div>

            <div className="form-group">
              <label htmlFor="tipoIdentificacion">Tipo de Identificación</label>
              <select id="tipoIdentificacion" name="tipoIdentificacion"
                value={formData.tipoIdentificacion} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PP">Pasaporte</option>
                <option value="TI">Tarjeta de Identidad</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="numeroDocumento">N° Documento *</label>
              <input id="numeroDocumento" name="numeroDocumento"
                value={formData.numeroDocumento} onChange={handleChange}
                placeholder="Ej: 1234567890" />
            </div>

            <div className="form-group">
              <label htmlFor="correoElectronico">Correo Electrónico *</label>
              <input id="correoElectronico" name="correoElectronico" type="email"
                value={formData.correoElectronico} onChange={handleChange}
                placeholder="docente@ejemplo.com" />
            </div>

            {/* ✅ celular como texto para soportar cualquier formato */}
            <div className="form-group">
              <label htmlFor="celular">Celular</label>
              <input id="celular" name="celular" type="tel"
                value={formData.celular} onChange={handleChange}
                placeholder="Ej: 3001234567" />
            </div>

            <div className="form-group">
              <label htmlFor="edad">Edad</label>
              <input id="edad" name="edad" type="number"
                min="18" max="99"
                value={formData.edad} onChange={handleChange}
                placeholder="Ej: 35" />
            </div>

            <div className="form-group">
              <label htmlFor="estadoCivil">Estado Civil</label>
              <select id="estadoCivil" name="estadoCivil"
                value={formData.estadoCivil} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Soltero/a">Soltero/a</option>
                <option value="Casado/a">Casado/a</option>
                <option value="Unión libre">Unión libre</option>
                <option value="Divorciado/a">Divorciado/a</option>
                <option value="Viudo/a">Viudo/a</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="genero">Género</label>
              <select id="genero" name="genero"
                value={formData.genero} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No binario">No binario</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            </div>
          </fieldset>

          {/* ═══ DATOS ACADÉMICOS ═══ */}
          <fieldset>
            <legend><BookOpen size={18} /> Datos Académicos</legend>

            <div className="form-group">
              <label htmlFor="nivelAcademico">Nivel Académico</label>
              <select id="nivelAcademico" name="nivelAcademico"
                value={formData.nivelAcademico} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Técnico">Técnico</option>
                <option value="Tecnólogo">Tecnólogo</option>
                <option value="Pregrado">Pregrado</option>
                <option value="Especialización">Especialización</option>
                <option value="Maestría">Maestría</option>
                <option value="Doctorado">Doctorado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="areasAsignadas">Áreas Asignadas</label>
              <input id="areasAsignadas" name="areasAsignadas"
                value={formData.areasAsignadas} onChange={handleChange}
                placeholder="Ej: Matemáticas, Física" />
            </div>

            <div className="form-group">
              <label htmlFor="anosExperiencia">Años de Experiencia</label>
              <input id="anosExperiencia" name="anosExperiencia" type="number"
                min="0" max="60"
                value={formData.anosExperiencia} onChange={handleChange}
                placeholder="Ej: 5" />
            </div>

            <div className="form-group">
              <label htmlFor="perfilProfesional">Perfil Profesional</label>
              <textarea id="perfilProfesional" name="perfilProfesional"
                value={formData.perfilProfesional} onChange={handleChange}
                placeholder="Describe experiencia, metodología y especialidades..."
                rows="4" maxLength="1000" />
              <small className="char-count">{formData.perfilProfesional.length}/1000 caracteres</small>
            </div>
          </fieldset>

          {/* ═══ DATOS LABORALES ═══ */}
          <fieldset>
            <legend><FileIcon size={18} /> Datos Laborales</legend>

            <div className="form-group">
              <label htmlFor="tipoContrato">Tipo de Contrato</label>
              <select id="tipoContrato" name="tipoContrato"
                value={formData.tipoContrato} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Tiempo Completo">Tiempo Completo</option>
                <option value="Medio Tiempo">Medio Tiempo</option>
                <option value="Cátedra">Cátedra</option>
                <option value="Contrato">Contrato</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="jornadaLaboral">Jornada Laboral</label>
              <select id="jornadaLaboral" name="jornadaLaboral"
                value={formData.jornadaLaboral} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
                <option value="Completa">Completa</option>
              </select>
            </div>

            {modoEdicion && (
              <div className="form-group-checkbox">
                <input id="vigencia" name="vigencia" type="checkbox"
                  checked={formData.vigencia} onChange={handleChange} />
                <label htmlFor="vigencia">Profesor activo (vigencia)</label>
              </div>
            )}
          </fieldset>

          {/* ═══ FOTO Y DOCUMENTOS ═══ */}
          <fieldset>
            <legend><ImageIcon size={18} /> Foto y Documentos</legend>

            {/* ✅ Solo URL - NO se sube base64 al backend */}
            <div className="form-group">
              <label htmlFor="foto">URL de Foto del Profesor</label>
              <input id="foto" name="foto" type="url"
                value={formData.foto} onChange={handleChange}
                placeholder="https://ejemplo.com/foto.jpg" />
              <small className="help-text">
                 Ingresa una URL pública de la foto (Imgur, Google Drive, etc.)
              </small>
              {formData.foto && (
                <div className="foto-preview">
                  <img
                    src={formData.foto}
                    alt="Vista previa"
                    className="preview-image"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="hojaDeVida">URL de Hoja de Vida (CV)</label>
              <input id="hojaDeVida" name="hojaDeVida" type="url"
                value={formData.hojaDeVida} onChange={handleChange}
                placeholder="https://ejemplo.com/cv.pdf" />
              <small className="help-text">
                 URL de Google Drive, Dropbox u otro servicio de almacenamiento
              </small>
            </div>
          </fieldset>

          {/* BOTONES */}
          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={cargando}>
              {cargando
                ? ' Guardando...'
                : modoEdicion ? ' Actualizar Profesor' : ' Crear Profesor'}
            </button>
            <button type="button" className="btn-cancel"
              onClick={() => navigate('/profesores')} disabled={cargando}>
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default FormularioProfesor;
