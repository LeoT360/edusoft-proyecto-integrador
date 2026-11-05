/**
 * ListaMatricula — matrículas de estudiantes en cursos. El Profesor las gestiona; el Estudiante
 * ve solo las suyas (filtrado en el cliente).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { matriculaService } from '../../services/matriculaService';
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

const EMPTY = { idUsuario: '', idCurso: '', fechaMatricula: '', valorMatricula: '', estado: 'ACTIVA' };

const formatCOP = (v) =>
  v == null ? '—' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(v));

function ListaMatricula() {
  const puedeGestionar = esProfesor();
  const usuario = getUsuarioActual();
  // Valores primitivos: así `cargar` no se recrea en cada render.
  const usuarioId = usuario?.id;
  const [matriculas, setMatriculas] = useState([]);
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
      let data = await matriculaService.listarTodas();
      data = Array.isArray(data) ? data : [];
      if (!puedeGestionar && usuarioId) {
        data = data.filter((m) => m.idUsuario === usuarioId);
      }
      setMatriculas(data);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las matrículas');
    } finally {
      setCargando(false);
    }
  }, [puedeGestionar, usuarioId]);

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
    if (!q) return matriculas;
    return matriculas.filter((m) =>
      (m.nombreEstudiante || '').toLowerCase().includes(q) ||
      (m.tituloCurso || '').toLowerCase().includes(q) ||
      (m.documentoEstudiante || '').toLowerCase().includes(q)
    );
  }, [matriculas, busqueda]);

  const totalValor = matriculas.reduce((a, m) => a + (Number(m.valorMatricula) || 0), 0);
  const fmtFecha = (f) => Array.isArray(f) ? f.join('-') : (f || '—');

  const abrirCrear = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const abrirEditar = (m) => {
    setEditId(m.id);
    setForm({
      idUsuario: m.idUsuario != null ? String(m.idUsuario) : '',
      idCurso: m.idCurso != null ? String(m.idCurso) : '',
      fechaMatricula: fmtFecha(m.fechaMatricula) === '—' ? '' : fmtFecha(m.fechaMatricula),
      valorMatricula: m.valorMatricula != null ? String(m.valorMatricula) : '',
      estado: m.estado || 'ACTIVA',
    });
    setModalOpen(true);
  };
  const cerrarModal = () => { setModalOpen(false); setEditId(null); setForm(EMPTY); };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.idUsuario || !form.idCurso || !form.fechaMatricula || form.valorMatricula === '') {
      await mostrarAlerta({ icon: 'warning', title: 'Campos incompletos', text: 'Estudiante, curso, fecha y valor son obligatorios' });
      return;
    }
    setGuardando(true);
    try {
      const payload = {
        idUsuario: parseInt(form.idUsuario, 10),
        idCurso: parseInt(form.idCurso, 10),
        fechaMatricula: form.fechaMatricula,
        valorMatricula: parseFloat(form.valorMatricula),
        estado: form.estado || 'ACTIVA',
      };
      if (editId) {
        await matriculaService.actualizar(editId, payload);
        await mostrarAlerta({ icon: 'success', title: 'Actualizada', text: 'Matrícula guardada' });
      } else {
        await matriculaService.crear(payload);
        await mostrarAlerta({ icon: 'success', title: 'Creada', text: 'Matrícula registrada' });
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
    const ok = await confirmDelete(`la matrícula de "${row.nombreEstudiante}"`);
    if (!ok) return;
    try {
      await matriculaService.eliminar(row.id);
      await mostrarAlerta({ icon: 'success', title: 'Eliminada', text: 'Matrícula eliminada' });
      cargar();
    } catch (e) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: e.message });
    }
  };

  const estudianteSel = estudiantes.find((u) => String(u.id) === form.idUsuario);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombreEstudiante', label: 'Estudiante' },
    { key: 'tituloCurso', label: 'Curso' },
    { key: 'fechaMatricula', label: 'Fecha', render: (r) => fmtFecha(r.fechaMatricula) },
    { key: 'valorMatricula', label: 'Valor', render: (r) => formatCOP(r.valorMatricula) },
    { key: 'estado', label: 'Estado' },
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
      <PageHeader title="Matrículas" subtitle={puedeGestionar ? 'Registro y gestión' : 'Tus matrículas'}
        actions={puedeGestionar && (
          <button type="button" className="es-btn es-btn-primary" onClick={abrirCrear}><Plus size={18} /> Nueva matrícula</button>
        )}
      />
      <StatsGrid>
        <StatsCard label="Registros" value={matriculas.length} icon={<ClipboardList size={16} />} />
        <StatsCard label="Valor total" value={formatCOP(totalValor)} />
      </StatsGrid>
      <ErrorState message={error} />
      <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar estudiante o curso..." />
      <DataTable columns={columns} rows={filtrados} emptyMessage="No hay matrículas." />
      {detalle && (
        <DetailModal title="Detalle de matrícula" onClose={() => setDetalle(null)} fields={[
          { label: 'Estudiante', value: detalle.nombreEstudiante },
          { label: 'Documento', value: detalle.documentoEstudiante },
          { label: 'Correo', value: detalle.correoEstudiante },
          { label: 'Curso', value: detalle.tituloCurso },
          { label: 'Fecha', value: fmtFecha(detalle.fechaMatricula) },
          { label: 'Valor', value: formatCOP(detalle.valorMatricula) },
          { label: 'Estado', value: detalle.estado },
        ]} />
      )}
      <FormModal title={editId ? `Editar matrícula #${editId}` : 'Nueva matrícula'} open={modalOpen} onClose={cerrarModal} width={520}>
        <form onSubmit={guardar}>
          <div className="es-field"><label>Estudiante *</label>
            <select value={form.idUsuario} onChange={(e) => setForm({ ...form, idUsuario: e.target.value })} required>
              <option value="">— Seleccionar —</option>
              {estudiantes.map((u) => (
                <option key={u.id} value={u.id}>{u.nombre}{u.documento ? ` · ${u.documento}` : ''}</option>
              ))}
            </select>
          </div>
          {estudianteSel && (
            <p style={{ fontSize: '0.85rem', color: 'var(--es-muted)', marginTop: -4 }}>
              Correo: {estudianteSel.correo || '—'} · Doc: {estudianteSel.documento || '—'}
            </p>
          )}
          <div className="es-field"><label>Curso *</label>
            <select value={form.idCurso} onChange={(e) => setForm({ ...form, idCurso: e.target.value })} required>
              <option value="">— Seleccionar —</option>
              {cursos.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
            </select>
          </div>
          <div className="es-field"><label>Fecha *</label>
            <input type="date" value={form.fechaMatricula} onChange={(e) => setForm({ ...form, fechaMatricula: e.target.value })} required /></div>
          <div className="es-field"><label>Valor (COP) *</label>
            <input type="number" step="1" min="0" value={form.valorMatricula} onChange={(e) => setForm({ ...form, valorMatricula: e.target.value })} required /></div>
          <div className="es-field"><label>Estado</label>
            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
              <option value="ACTIVA">ACTIVA</option>
              <option value="INACTIVA">INACTIVA</option>
            </select>
          </div>
          <div className="es-form-actions">
            <button type="button" className="es-btn es-btn-secondary" onClick={cerrarModal}>Cancelar</button>
            <button type="submit" className="es-btn es-btn-primary" disabled={guardando}>{guardando ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

export default ListaMatricula;
