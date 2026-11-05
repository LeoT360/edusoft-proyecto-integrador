/**
 * ListaCursos — catálogo de cursos. Todos los roles lo consultan; solo el Profesor crea,
 * edita o elimina.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { cursoService } from '../../services/cursoService';
import { profesorService } from '../../services/profesorService';
import { esProfesor } from '../../utils/auth';
import { mostrarAlerta } from '../../utils/swalConfig';
import PageHeader from '../shared/PageHeader';
import SearchBar from '../shared/SearchBar';
import ActionButtons from '../shared/ActionButtons';
import CardGrid, { EntityCard } from '../shared/CardGrid';
import DetailModal from '../shared/DetailModal';
import FormModal from '../shared/FormModal';
import StatsCard, { StatsGrid } from '../shared/StatsCard';
import { LoadingState, ErrorState } from '../shared/StateMessage';
import { confirmDelete } from '../shared/confirmDelete';
import '../shared/Shared.css';
import './Cursos.css';

const TIPOS = ['Teórico', 'Práctico', 'Teórico-Práctico', 'Electiva'];
const MODALIDADES = ['Presencial', 'Virtual', 'Híbrida'];

const EMPTY = {
  titulo: '', descripcion: '', tipoCurso: 'Teórico', modalidad: 'Presencial',
  duracionHoras: '', fechaInicio: '', fechaFin: '', idProfesor: '',
};

function ListaCursos() {
  const puedeGestionar = esProfesor();
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [detalle, setDetalle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await cursoService.listarTodos();
      setCursos(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los cursos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    profesorService.listarTodos().then((d) => setProfesores(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return cursos;
    return cursos.filter((c) =>
      (c.titulo || '').toLowerCase().includes(q) ||
      (c.nombreProfesor || '').toLowerCase().includes(q) ||
      (c.tipoCurso || '').toLowerCase().includes(q) ||
      (c.modalidad || '').toLowerCase().includes(q)
    );
  }, [cursos, busqueda]);

  const abrirCrear = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const abrirEditar = (c) => {
    setEditId(c.id);
    setForm({
      titulo: c.titulo || '',
      descripcion: c.descripcion || '',
      tipoCurso: c.tipoCurso || 'Teórico',
      modalidad: c.modalidad || 'Presencial',
      duracionHoras: c.duracionHoras != null ? String(c.duracionHoras) : '',
      fechaInicio: c.fechaInicio || '',
      fechaFin: c.fechaFin || '',
      idProfesor: c.idProfesor != null ? String(c.idProfesor) : '',
    });
    setModalOpen(true);
  };
  const cerrarModal = () => { setModalOpen(false); setEditId(null); setForm(EMPTY); };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.idProfesor) {
      await mostrarAlerta({ icon: 'warning', title: 'Campos incompletos', text: 'Título y profesor son obligatorios' });
      return;
    }
    setGuardando(true);
    try {
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion || null,
        tipoCurso: form.tipoCurso,
        modalidad: form.modalidad,
        duracionHoras: form.duracionHoras ? parseFloat(form.duracionHoras) : null,
        fechaInicio: form.fechaInicio || null,
        fechaFin: form.fechaFin || null,
        idProfesor: parseInt(form.idProfesor, 10),
        activo: true,
      };
      if (editId) {
        await cursoService.actualizar(editId, payload);
        await mostrarAlerta({ icon: 'success', title: 'Actualizado', text: 'Curso guardado' });
      } else {
        await cursoService.crear(payload);
        await mostrarAlerta({ icon: 'success', title: 'Creado', text: 'Curso registrado' });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (curso) => {
    const ok = await confirmDelete(`el curso "${curso.titulo}"`);
    if (!ok) return;
    try {
      await cursoService.eliminar(curso.id);
      await mostrarAlerta({ icon: 'success', title: 'Eliminado', text: 'Curso eliminado' });
      cargar();
    } catch (e) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: e.message });
    }
  };

  if (cargando) return <div className="es-page"><LoadingState /></div>;

  return (
    <div className="es-page">
      <PageHeader title="Cursos" subtitle={puedeGestionar ? 'Gestión del catálogo' : 'Catálogo de cursos'}
        actions={puedeGestionar && (
          <button type="button" className="es-btn es-btn-primary" onClick={abrirCrear}><Plus size={18} /> Nuevo curso</button>
        )}
      />
      <StatsGrid>
        <StatsCard label="Total" value={cursos.length} icon={<BookOpen size={16} />} />
        <StatsCard label="Presenciales" value={cursos.filter((c) => c.modalidad === 'Presencial').length} />
        <StatsCard label="Virtuales" value={cursos.filter((c) => c.modalidad === 'Virtual').length} />
      </StatsGrid>
      <ErrorState message={error} />
      <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar título, profesor, tipo..." />
      {!error && filtrados.length === 0 && <div className="es-state">No hay cursos.</div>}
      <CardGrid>
        {filtrados.map((c) => (
          <EntityCard key={c.id} id={c.id} title={c.titulo}
            footer={<ActionButtons onView={() => setDetalle(c)}
              onEdit={puedeGestionar ? () => abrirEditar(c) : undefined}
              onDelete={puedeGestionar ? () => handleEliminar(c) : undefined}
              canEdit={puedeGestionar} canDelete={puedeGestionar} />}>
            <p><strong>Profesor:</strong> {c.nombreProfesor || '—'}</p>
            <p><strong>Tipo:</strong> {c.tipoCurso || '—'} · <strong>Modalidad:</strong> {c.modalidad || '—'}</p>
            {c.cantidadMatriculados != null && <p><strong>Matriculados:</strong> {c.cantidadMatriculados}</p>}
          </EntityCard>
        ))}
      </CardGrid>
      {detalle && (
        <DetailModal title="Detalle del curso" onClose={() => setDetalle(null)} fields={[
          { label: 'Título', value: detalle.titulo },
          { label: 'Descripción', value: detalle.descripcion },
          { label: 'Profesor', value: detalle.nombreProfesor },
          { label: 'Tipo', value: detalle.tipoCurso },
          { label: 'Modalidad', value: detalle.modalidad },
          { label: 'Duración (h)', value: detalle.duracionHoras },
          { label: 'Inicio', value: detalle.fechaInicio },
          { label: 'Fin', value: detalle.fechaFin },
          { label: 'Matriculados', value: detalle.cantidadMatriculados },
        ]} />
      )}
      <FormModal title={editId ? `Editar curso #${editId}` : 'Nuevo curso'} open={modalOpen} onClose={cerrarModal} width={560}>
        <form onSubmit={guardar}>
          <div className="es-field"><label>Título *</label>
            <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required /></div>
          <div className="es-field"><label>Descripción</label>
            <textarea rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></div>
          <div className="es-field"><label>Profesor *</label>
            <select value={form.idProfesor} onChange={(e) => setForm({ ...form, idProfesor: e.target.value })} required>
              <option value="">— Seleccionar —</option>
              {profesores.map((p) => <option key={p.id} value={p.id}>{p.nombre || p.id}</option>)}
            </select></div>
          <div className="es-field"><label>Tipo de curso</label>
            <select value={form.tipoCurso} onChange={(e) => setForm({ ...form, tipoCurso: e.target.value })}>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select></div>
          <div className="es-field"><label>Modalidad</label>
            <select value={form.modalidad} onChange={(e) => setForm({ ...form, modalidad: e.target.value })}>
              {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select></div>
          <div className="es-field"><label>Duración (horas)</label>
            <input type="number" step="0.1" value={form.duracionHoras} onChange={(e) => setForm({ ...form, duracionHoras: e.target.value })} /></div>
          <div className="es-field"><label>Fecha inicio</label>
            <input type="date" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} /></div>
          <div className="es-field"><label>Fecha fin (opcional)</label>
            <input type="date" value={form.fechaFin} onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} /></div>
          <div className="es-form-actions">
            <button type="button" className="es-btn es-btn-secondary" onClick={cerrarModal}>Cancelar</button>
            <button type="submit" className="es-btn es-btn-primary" disabled={guardando}>{guardando ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

export default ListaCursos;
