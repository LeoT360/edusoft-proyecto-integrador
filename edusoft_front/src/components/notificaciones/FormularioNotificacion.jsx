import { BookOpen, Calendar, Mail, Settings, Tag, User } from 'lucide-react';
// ====================================
// COMPONENTE FORMULARIO NOTIFICACIÓN
// ====================================
// Este componente permite crear una nueva notificación y enviarla al backend

// Importamos React y el hook useState para manejar el estado del componente
import React, { useState } from 'react';

// Importamos nuestro servicio para conectarnos con el backend
import { notificationService } from '../../services/notificationService';

// Importamos los estilos CSS (lo crearemos después)
import './FormularioNotificacion.css';


// Definimos nuestro componente como una función
function FormularioNotificacion() {
  
  // ========== ESTADO DEL FORMULARIO ==========
  // useState() crea una variable de estado que React "observa"
  // Cuando cambia, React re-renderiza el componente automáticamente
  
  // Estado para almacenar todos los datos del formulario
  const [formData, setFormData] = useState({
    // Campos de identificación
    idRemitente: '',
    idDestinatario: '',
    emailRemitente: '',
    emailDestinatario: '',
    
    // Contenido del mensaje
    asunto: '',
    cuerpoMensaje: '',
    
    // Clasificación
    tipoNotificacion: 'Informativa',  // Valor por defecto
    prioridad: 'Media',               // Valor por defecto
    
    // Información del curso
    cursoRelacionado: '',
    categoriaCurso: '',
    
    // Fechas y horas
    fechaEntrega: '',
    fechaCreacion: new Date().toISOString().split('T')[0],  // Fecha actual automática
    fechaEnvio: '',
    horaEnvio: '',
    
    // Estados booleanos (true/false)
    mensajeEnviado: false,
    mensajeLeido: false,
    mensajeEliminado: false,
    estado: true,  // true = activo
    
    // Otros campos
    cantidadArchivosAdjuntos: 0,
    notificacionEmergente: false
  });
  
  // Estado para mensajes de éxito o error
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'exito' o 'error'
  
  // Estado para saber si estamos enviando datos (loading)
  const [enviando, setEnviando] = useState(false);

  // ========== FUNCIONES DEL COMPONENTE ==========
  
  // Función que se ejecuta cada vez que el usuario escribe en un input
  const handleChange = (e) => {
    // e.target es el elemento HTML que disparó el evento (input, select, etc.)
    const { name, value, type, checked } = e.target;
    
    // Actualizamos el estado del formulario
    setFormData(prevState => ({
      ...prevState,  // Copiamos todos los valores anteriores
      // Actualizamos solo el campo que cambió
      // Si es checkbox usamos 'checked', si no usamos 'value'
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    // Prevenir que el formulario recargue la página (comportamiento por defecto)
    e.preventDefault();
    
    // Validación básica: verificar que los campos obligatorios estén llenos
    if (!formData.emailRemitente || !formData.emailDestinatario || !formData.asunto) {
      setMensaje('Por favor completa los campos obligatorios (*)');
      setTipoMensaje('error');
      return;  // Salimos de la función si hay error
    }
    
    // Indicamos que estamos enviando (para mostrar "Cargando...")
    setEnviando(true);
    setMensaje('');  // Limpiamos mensajes anteriores
    
    try {
      // Preparamos los datos para enviar
      // Convertimos los strings a números donde sea necesario
      const datosAEnviar = {
        ...formData,
        idRemitente: formData.idRemitente ? parseInt(formData.idRemitente) : null,
        idDestinatario: formData.idDestinatario ? parseInt(formData.idDestinatario) : null,
        cantidadArchivosAdjuntos: parseInt(formData.cantidadArchivosAdjuntos)
      };
      
      // Llamamos al servicio para crear la notificación
      // Esto hace la petición POST al backend
      const respuesta = await notificationService.crear(datosAEnviar);
      
      // Si llegamos aquí, la notificación se creó exitosamente
      console.log('Notificación creada:', respuesta);
      
      // Mostramos mensaje de éxito
      setMensaje('¡Notificación enviada exitosamente!');
      setTipoMensaje('exito');
      
      // Limpiamos el formulario después de 2 segundos
      setTimeout(() => {
        limpiarFormulario();
      }, 2000);
      
    } catch (error) {
      // Si algo salió mal, mostramos el error
      console.error('Error al enviar:', error);
      setMensaje('Error al enviar la notificación. Verifica que el backend esté corriendo.');
      setTipoMensaje('error');
    } finally {
      // Siempre se ejecuta, haya error o no
      setEnviando(false);  // Quitamos el estado de "Cargando..."
    }
  };

  // Función para limpiar el formulario y volver a los valores iniciales
  const limpiarFormulario = () => {
    setFormData({
      idRemitente: '',
      idDestinatario: '',
      emailRemitente: '',
      emailDestinatario: '',
      asunto: '',
      cuerpoMensaje: '',
      tipoNotificacion: 'Informativa',
      prioridad: 'Media',
      cursoRelacionado: '',
      categoriaCurso: '',
      fechaEntrega: '',
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaEnvio: '',
      horaEnvio: '',
      mensajeEnviado: false,
      mensajeLeido: false,
      mensajeEliminado: false,
      estado: true,
      cantidadArchivosAdjuntos: 0,
      notificacionEmergente: false
    });
    setMensaje('');
    setTipoMensaje('');
  };

  // ========== RENDER DEL COMPONENTE ==========
  // Todo lo que está dentro del return() es lo que se mostrará en pantalla
  return (
    <div className="formulario-container">
      <h2>  Notificación </h2>
      
      {/* Mostramos mensajes de éxito o error si existen */}
      {mensaje && (
        <div className={`mensaje ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}
      
      {/* Formulario principal */}
      <form onSubmit={handleSubmit} className="formulario">
        
        {/* ===== SECCIÓN 1: DATOS DE REMITENTE Y DESTINATARIO ===== */}
        <fieldset>
          <legend><User size={18} /> Información de Usuarios</legend>
          
          <div className="form-group">
            <label htmlFor="idRemitente">ID Remitente:</label>
            <input
              type="number"
              id="idRemitente"
              name="idRemitente"
              value={formData.idRemitente}
              onChange={handleChange}
              placeholder="Ej: 1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="emailRemitente">Email Remitente: *</label>
            <input
              type="email"
              id="emailRemitente"
              name="emailRemitente"
              value={formData.emailRemitente}
              onChange={handleChange}
              placeholder="remitente@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="idDestinatario">ID Destinatario:</label>
            <input
              type="number"
              id="idDestinatario"
              name="idDestinatario"
              value={formData.idDestinatario}
              onChange={handleChange}
              placeholder="Ej: 2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="emailDestinatario">Email Destinatario: *</label>
            <input
              type="email"
              id="emailDestinatario"
              name="emailDestinatario"
              value={formData.emailDestinatario}
              onChange={handleChange}
              placeholder="destinatario@ejemplo.com"
              required
            />
          </div>
        </fieldset>

        {/* ===== SECCIÓN 2: CONTENIDO DEL MENSAJE ===== */}
        <fieldset>
          <legend><Mail size={18} /> Contenido del Mensaje</legend>
          
          <div className="form-group">
            <label htmlFor="asunto">Asunto: *</label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              placeholder="Asunto de la notificación"
              required
              maxLength="200"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cuerpoMensaje">Mensaje:</label>
            <textarea
              id="cuerpoMensaje"
              name="cuerpoMensaje"
              value={formData.cuerpoMensaje}
              onChange={handleChange}
              placeholder="Escribe aquí el contenido de tu mensaje..."
              rows="5"
            />
          </div>
        </fieldset>

        {/* ===== SECCIÓN 3: CLASIFICACIÓN ===== */}
        <fieldset>
          <legend><Tag size={18} /> Clasificación</legend>
          
          <div className="form-group">
            <label htmlFor="tipoNotificacion">Tipo de Notificación:</label>
            <select
              id="tipoNotificacion"
              name="tipoNotificacion"
              value={formData.tipoNotificacion}
              onChange={handleChange}
            >
              <option value="Informativa">Informativa</option>
              <option value="Urgente">Urgente</option>
              <option value="Recordatorio">Recordatorio</option>
              <option value="Tarea">Tarea</option>
              <option value="Anuncio">Anuncio</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="prioridad">Prioridad:</label>
            <select
              id="prioridad"
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>
        </fieldset>

        {/* ===== SECCIÓN 4: INFORMACIÓN DEL CURSO ===== */}
        <fieldset>
          <legend><BookOpen size={18} /> Curso Relacionado</legend>
          
          <div className="form-group">
            <label htmlFor="cursoRelacionado">Curso:</label>
            <input
              type="text"
              id="cursoRelacionado"
              name="cursoRelacionado"
              value={formData.cursoRelacionado}
              onChange={handleChange}
              placeholder="Ej: Programación Java"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoriaCurso">Categoría:</label>
            <input
              type="text"
              id="categoriaCurso"
              name="categoriaCurso"
              value={formData.categoriaCurso}
              onChange={handleChange}
              placeholder="Ej: Desarrollo Backend"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaEntrega">Fecha de Entrega:</label>
            <input
              type="date"
              id="fechaEntrega"
              name="fechaEntrega"
              value={formData.fechaEntrega}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        {/* ===== SECCIÓN 5: FECHAS Y HORA ===== */}
        <fieldset>
          <legend><Calendar size={18} /> Fechas y Hora</legend>
          
          <div className="form-group">
            <label htmlFor="fechaCreacion">Fecha Creación:</label>
            <input
              type="date"
              id="fechaCreacion"
              name="fechaCreacion"
              value={formData.fechaCreacion}
              onChange={handleChange}
              readOnly
            />
            <small>Se establece automáticamente</small>
          </div>

          <div className="form-group">
            <label htmlFor="fechaEnvio">Fecha Envío:</label>
            <input
              type="date"
              id="fechaEnvio"
              name="fechaEnvio"
              value={formData.fechaEnvio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="horaEnvio">Hora Envío:</label>
            <input
              type="time"
              id="horaEnvio"
              name="horaEnvio"
              value={formData.horaEnvio}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        {/* ===== SECCIÓN 6: OPCIONES ADICIONALES ===== */}
        <fieldset>
          <legend><Settings size={18} /> Opciones Adicionales</legend>
          
          <div className="form-group">
            <label htmlFor="cantidadArchivosAdjuntos">Archivos Adjuntos:</label>
            <input
              type="number"
              id="cantidadArchivosAdjuntos"
              name="cantidadArchivosAdjuntos"
              value={formData.cantidadArchivosAdjuntos}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group-checkbox">
            <input
              type="checkbox"
              id="notificacionEmergente"
              name="notificacionEmergente"
              checked={formData.notificacionEmergente}
              onChange={handleChange}
            />
            <label htmlFor="notificacionEmergente">
              Mostrar como notificación emergente
            </label>
          </div>

          <div className="form-group-checkbox">
            <input
              type="checkbox"
              id="estado"
              name="estado"
              checked={formData.estado}
              onChange={handleChange}
            />
            <label htmlFor="estado">
              Notificación activa
            </label>
          </div>
        </fieldset>

        {/* ===== BOTONES DE ACCIÓN ===== */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-enviar"
            disabled={enviando}
          >
            {enviando ? ' Enviando...' : ' Enviar Notificación'}
          </button>
          
          <button 
            type="button" 
            className="btn-limpiar"
            onClick={limpiarFormulario}
            disabled={enviando}
          >
             Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
}

// Exportamos el componente para poder usarlo en otros archivos
export default FormularioNotificacion;