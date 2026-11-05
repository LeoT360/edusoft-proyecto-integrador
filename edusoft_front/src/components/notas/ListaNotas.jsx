/**
 * ListaNotas — notas por curso (escala 0.0 a 5.0). El Profesor gestiona todas; el Estudiante
 * consulta las suyas con GET /notas?email=.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { notaService } from '../../services/notaService';
import { cursoService } from '../../services/cursoService';
import { usuarioService } from '../../services/usuarioService';
import { esProfesor, getUsuarioActual } from '../../utils/auth';
import { mostrarAlerta } from '../../utils/swalConfig';
import PageHeader from '../shared/PageHeader';
import SearchBar from '../shared/SearchBar';
import ActionButtons from '../shared/ActionButtons';
import DataTable from '../shared/DataTable';
import DetailModal from '../shared/DetailModal';
import FormModal from '../shared/FormModal';
import StatsCard, { StatsGrid } from '../shared/StatsCard';
import { LoadingState, ErrorState } from '../shared/StateMessage';
import { confirmDelete } from '../shared/confirmDelete';
import '../shared/Shared.css';
import './Notas.css';

const TIPOS_EXAMEN = ['Parcial', 'Final', 'Quiz', 'Taller', 'Otro'];
const EMPTY = { idUsuario: '', idCurso: '', tipoExamen: 'Parcial', nota: '', fechaExamen: '', observaciones: '' };

function ListaNotas() {
  const puedeGestionar = esProfesor();
  const usuario = getUsuarioActual();
  // Valores primitivos: así `cargar` no se recrea en cada render.
  const usuarioCorreo = usuario?.correo;
  const [notas, setNotas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [detalle, setDetalle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      let data;
      if (!puedeGestionar && usuarioCorreo) {
        data = await notaService.buscarPorEmail(usuarioCorreo);
      } else {
        data = await notaService.listarTodas();
      }
      setNotas(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las notas');
    } finally {
      setCargando(false);
    }
  }, [puedeGestionar, usuarioCorreo]);

  useEffect(() => {
    cargar();
    if (puedeGestionar) {
      cursoService.listarTodos().then((d) => setCursos(Array.isArray(d) ? d : [])).catch(() => {});
      usuarioService.listarTodos()
        .then((d) => setEstudiantes((d || []).filter((u) => u.rol === 'Estudiante')))
        .catch(() => {});
    }
  }, [cargar, puedeGestionar]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return notas;
    return notas.filter((n) =>
      (n.nombreEstudiante || '').toLowerCase().includes(q) ||
      (n.tituloCurso || '').toLowerCase().includes(q) ||
      (n.tipoExamen || '').toLowerCase().includes(q)
    );
  }, [notas, busqueda]);

  const promedio = notas.length
    ? (notas.reduce((a, n) => a + (Number(n.nota) || 0), 0) / notas.length).toFixed(2)
    : '—';

  const abrirCrear = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const abrirEditar = (n) => {
    setEditId(n.id);
    setForm({
      idUsuario: n.idUsuario != null ? String(n.idUsuario) : '',
      idCurso: n.idCurso != null ? String(n.idCurso) : '',
      tipoExamen: n.tipoExamen || 'Parcial',
      nota: n.nota != null ? String(n.nota) : '',
      fechaExamen: n.fechaExamen || '',
      observaciones: n.observaciones || '',
    });
    setModalOpen(true);
  };
  const cerrarModal = () => { setModalOpen(false); setEditId(null); setForm(EMPTY); };

  const guardar = async (e) => {
    e.preventDefault();
    const valor = parseFloat(form.nota);
    if (!form.idUsuario || !form.idCurso || form.nota === '' || Number.isNaN(valor) || valor < 0 || valor > 5) {
      await mostrarAlerta({ icon: 'warning', title: 'Datos inválidos', text: 'Estudiante, curso y nota (0 a 5) son obligatorios' });
      return;
    }
    setGuardando(true);
    try {
      const payload = {
        idUsuario: parseInt(form.idUsuario, 10),
        idCurso: parseInt(form.idCurso, 10),
        tipoExamen: form.tipoExamen,
        nota: valor,
        fechaExamen: form.fechaExamen || null,
        observaciones: form.observaciones || null,
      };
      if (editId) {
        await notaService.actualizar(editId, payload);
        await mostrarAlerta({ icon: 'success', title: 'Actualizada', text: 'Nota guardada' });
      } else {
        await notaService.crear(payload);
        await mostrarAlerta({ icon: 'success', title: 'Creada', text: 'Nota registrada' });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (row) => {
    const ok = await confirmDelete(`la nota de "${row.nombreEstudiante}"`);
    if (!ok) return;
    try {
      await notaService.eliminar(row.id);
      await mostrarAlerta({ icon: 'success', title: 'Eliminada', text: 'Nota eliminada' });
      cargar();
    } catch (e) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: e.message });
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombreEstudiante', label: 'Estudiante' },
    { key: 'tituloCurso', label: 'Curso' },
    { key: 'tipoExamen', label: 'Tipo' },
    { key: 'nota', label: 'Nota' },
    {
      key: 'acciones', label: 'Acciones',
      render: (r) => (
        <ActionButtons onView={() => setDetalle(r)}
          onEdit={puedeGestionar ? () => abrirEditar(r) : undefined}
          onDelete={puedeGestionar ? () => handleEliminar(r) : undefined}
          canEdit={puedeGestionar} canDelete={puedeGestionar} />
      ),
    },
  ];

  if (cargando) return <div className="es-page"><LoadingState /></div>;

  return (
    <div className="es-page">
      <PageHeader title="Notas" subtitle={puedeGestionar ? 'Calificaciones (escala 0–5)' : 'Tus calificaciones'}
        actions={puedeGestionar && (
          <button type="button" className="es-btn es-btn-primary" onClick={abrirCrear}><Plus size={18} /> Nueva nota</button>
        )}
      />
      <StatsGrid>
        <StatsCard label="Registros" value={notas.length} icon={<FileText size={16} />} />
        <StatsCard label="Promedio" value={promedio} />
      </StatsGrid>
      <ErrorState message={error} />
      <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar estudiante, curso o tipo..." />
      <DataTable columns={columns} rows={filtrados} emptyMessage="No hay notas." />
      {detalle && (
        <DetailModal title="Detalle de nota" onClose={() => setDetalle(null)} fields={[
          { label: 'Estudiante', value: detalle.nombreEstudiante },
          { label: 'Curso', value: detalle.tituloCurso },
          { label: 'Tipo', value: detalle.tipoExamen },
          { label: 'Nota', value: detalle.nota },
          { label: 'Fecha', value: detalle.fechaExamen },
          { label: 'Observaciones', value: detalle.observaciones },
        ]} />
      )}
      <FormModal title={editId ? `Editar nota #${editId}` : 'Nueva nota'} open={modalOpen} onClose={cerrarModal} width={520}>
        <form onSubmit={guardar}>
          <div className="es-field"><label>Estudiante *</label>
            <select value={form.idUsuario} onChange={(e) => setForm({ ...form, idUsuario: e.target.value })} required>
              <option value="">— Seleccionar —</option>
              {estudiantes.map((u) => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select></div>
          <div className="es-field"><label>Curso *</label>
            <select value={form.idCurso} onChange={(e) => setForm({ ...form, idCurso: e.target.value })} required>
              <option value="">— Seleccionar —</option>
              {cursos.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
            </select></div>
          <div className="es-field"><label>Tipo de examen *</label>
            <select value={form.tipoExamen} onChange={(e) => setForm({ ...form, tipoExamen: e.target.value })}>
              {TIPOS_EXAMEN.map((t) => <option key={t} value={t}>{t}</option>)}
            </select></div>
          <div className="es-field"><label>Nota (0 – 5) *</label>
            <input type="number" step="0.1" min="0" max="5" value={form.nota} onChange={(e) => setForm({ ...form, nota: e.target.value })} required /></div>
          <div className="es-field"><label>Fecha examen</label>
            <input type="date" value={form.fechaExamen} onChange={(e) => setForm({ ...form, fechaExamen: e.target.value })} /></div>
          <div className="es-field"><label>Observaciones</label>
            <input value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} /></div>
          <div className="es-form-actions">
            <button type="button" className="es-btn es-btn-secondary" onClick={cerrarModal}>Cancelar</button>
            <button type="submit" className="es-btn es-btn-primary" disabled={guardando}>{guardando ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

export default ListaNotas;
