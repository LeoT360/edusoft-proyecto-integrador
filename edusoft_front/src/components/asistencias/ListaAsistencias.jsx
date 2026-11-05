/**
 * ListaAsistencias — registro y consulta de asistencias. El Profesor gestiona todos los registros;
 * el Estudiante ve solo los suyos (filtrado en el cliente).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardCheck, Plus } from 'lucide-react';
import { asistenciaService } from '../../services/asistenciaService';
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

const EMPTY = { idUsuario: '', idCurso: '', fecha: '', horaEntrada: '', asistio: true };

function ListaAsistencias() {
  const puedeGestionar = esProfesor();
  const usuario = getUsuarioActual();
  // Valores primitivos: así `cargar` no se recrea en cada render.
  const usuarioId = usuario?.id;
  const [rows, setRows] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [detalle, setDetalle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [guardando, setGuardando] = useState(false);

  const fmtFecha = (f) => Array.isArray(f) ? f.join('-') : (f || '');
  const fmtHora = (h) => {
    if (Array.isArray(h)) return `${String(h[0]).padStart(2, '0')}:${String(h[1]).padStart(2, '0')}`;
    if (typeof h === 'string' && h.length >= 5) return h.slice(0, 5);
    return h || '';
  };

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      let data = await asistenciaService.listarTodas();
      data = Array.isArray(data) ? data : [];
      if (!puedeGestionar && usuarioId) {
        data = data.filter((a) => a.idUsuario === usuarioId);
      }
      setRows(data);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las asistencias');
    } finally {
      setCargando(false);
    }
  }, [puedeGestionar, usuarioId]);

  useEffect(() => {
    cargar();
    if (puedeGestionar) {
      cursoService.listarTodos().then((d) => setCursos(Array.isArray(d) ? d : [])).catch(() => {});
      usuarioService.listarTodos()
        .then((d) => setUsuarios((d || []).filter((x) => x.rol === 'Estudiante')))
        .catch(() => {});
    }
  }, [cargar, puedeGestionar]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((a) =>
      (a.nombreEstudiante || '').toLowerCase().includes(q) ||
      (a.tituloCurso || '').toLowerCase().includes(q) ||
      String(a.fecha || '').includes(q)
    );
  }, [rows, busqueda]);

  const presentes = rows.filter((a) => a.asistio).length;

  const abrirCrear = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const abrirEditar = (a) => {
    setEditId(a.id);
    setForm({
      idUsuario: a.idUsuario != null ? String(a.idUsuario) : '',
      idCurso: a.idCurso != null ? String(a.idCurso) : '',
      fecha: fmtFecha(a.fecha),
      horaEntrada: fmtHora(a.horaEntrada),
      asistio: a.asistio !== false,
    });
    setModalOpen(true);
  };
  const cerrarModal = () => { setModalOpen(false); setEditId(null); setForm(EMPTY); };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.idUsuario || !form.idCurso || !form.fecha) {
      await mostrarAlerta({ icon: 'warning', title: 'Campos incompletos', text: 'Estudiante, curso y fecha son obligatorios' });
      return;
    }
    setGuardando(true);
    try {
      const hora = form.horaEntrada
        ? (form.horaEntrada.length === 5 ? form.horaEntrada + ':00' : form.horaEntrada)
        : null;
      const payload = {
        idUsuario: parseInt(form.idUsuario, 10),
        idCurso: parseInt(form.idCurso, 10),
        fecha: form.fecha,
        horaEntrada: hora,
        asistio: Boolean(form.asistio),
      };
      if (editId) {
        await asistenciaService.actualizar(editId, payload);
        await mostrarAlerta({ icon: 'success', title: 'Actualizada', text: 'Asistencia guardada' });
      } else {
        await asistenciaService.crear(payload);
        await mostrarAlerta({ icon: 'success', title: 'Registrada', text: 'Asistencia creada' });
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
    const ok = await confirmDelete(`la asistencia de "${row.nombreEstudiante}"`);
    if (!ok) return;
    try {
      await asistenciaService.eliminar(row.id);
      await mostrarAlerta({ icon: 'success', title: 'Eliminada', text: 'Asistencia eliminada' });
      cargar();
    } catch (e) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: e.message });
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombreEstudiante', label: 'Estudiante' },
    { key: 'tituloCurso', label: 'Curso' },
    { key: 'fecha', label: 'Fecha', render: (r) => fmtFecha(r.fecha) || '—' },
    { key: 'horaEntrada', label: 'Hora', render: (r) => fmtHora(r.horaEntrada) || '—' },
    { key: 'asistio', label: 'Asistió', render: (r) => (r.asistio ? 'Sí' : 'No') },
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
      <PageHeader title="Asistencias" subtitle={puedeGestionar ? 'Control de asistencia' : 'Tus registros'}
        actions={puedeGestionar && (
          <button type="button" className="es-btn es-btn-primary" onClick={abrirCrear}><Plus size={18} /> Registrar</button>
        )}
      />
      <StatsGrid>
        <StatsCard label="Registros" value={rows.length} icon={<ClipboardCheck size={16} />} />
        <StatsCard label="Presentes" value={presentes} />
        <StatsCard label="Ausentes" value={rows.length - presentes} />
      </StatsGrid>
      <ErrorState message={error} />
      <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar estudiante, curso o fecha..." />
      <DataTable columns={columns} rows={filtrados} emptyMessage="No hay asistencias." />
      {detalle && (
        <DetailModal title="Detalle" onClose={() => setDetalle(null)} fields={[
          { label: 'Estudiante', value: detalle.nombreEstudiante },
          { label: 'Curso', value: detalle.tituloCurso },
          { label: 'Fecha', value: fmtFecha(detalle.fecha) },
          { label: 'Hora', value: fmtHora(detalle.horaEntrada) },
          { label: 'Asistió', value: detalle.asistio ? 'Sí' : 'No' },
        ]} />
      )}
      <FormModal title={editId ? `Editar asistencia #${editId}` : 'Nueva asistencia'} open={modalOpen} onClose={cerrarModal} width={520}>
        <form onSubmit={guardar}>
          <div className="es-field"><label>Estudiante *</label>
            <select value={form.idUsuario} onChange={(e) => setForm({ ...form, idUsuario: e.target.value })} required>
              <option value="">— Seleccionar —</option>
              {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select></div>
          <div className="es-field"><label>Curso *</label>
            <select value={form.idCurso} onChange={(e) => setForm({ ...form, idCurso: e.target.value })} required>
              <option value="">— Seleccionar —</option>
              {cursos.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
            </select></div>
          <div className="es-field"><label>Fecha *</label>
            <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required /></div>
          <div className="es-field"><label>Hora entrada</label>
            <input type="time" value={form.horaEntrada} onChange={(e) => setForm({ ...form, horaEntrada: e.target.value })} /></div>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <input type="checkbox" checked={form.asistio} onChange={(e) => setForm({ ...form, asistio: e.target.checked })} />
            Asistió
          </label>
          <div className="es-form-actions">
            <button type="button" className="es-btn es-btn-secondary" onClick={cerrarModal}>Cancelar</button>
            <button type="submit" className="es-btn es-btn-primary" disabled={guardando}>{guardando ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

export default ListaAsistencias;
