/**
 * ListaNotificaciones — bandeja de notificaciones. El Profesor ve todas y puede crear, editar y
 * eliminar; el Estudiante solo ve las dirigidas a él.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, Plus } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { usuarioService } from '../../services/usuarioService';
import { cursoService } from '../../services/cursoService';
import { esProfesor, getUsuarioActual } from '../../utils/auth';
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
import './ListaNotificaciones.css';

const EMPTY = {
  idDestinatario: '', asunto: '', cuerpo: '', tipo: 'Informativa', prioridad: 'Media', idCurso: '',
};

function ListaNotificaciones() {
  const puedeGestionar = esProfesor();
  const usuario = getUsuarioActual();
  // Valores primitivos: así `cargar` no se recrea en cada render.
  const usuarioId = usuario?.id;
  const [items, setItems] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
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
      let data = await notificationService.listarTodas();
      data = Array.isArray(data) ? data : [];
      if (!puedeGestionar && usuarioId) {
        data = data.filter((n) => n.idDestinatario === usuarioId);
      }
      setItems(data);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las notificaciones');
    } finally {
      setCargando(false);
    }
  }, [puedeGestionar, usuarioId]);

  useEffect(() => {
    cargar();
    if (puedeGestionar) {
      usuarioService.listarTodos().then((d) => setUsuarios(Array.isArray(d) ? d : [])).catch(() => {});
      cursoService.listarTodos().then((d) => setCursos(Array.isArray(d) ? d : [])).catch(() => {});
    }
  }, [cargar, puedeGestionar]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return items;
    return items.filter((n) =>
      (n.asunto || '').toLowerCase().includes(q) ||
      (n.nombreDestinatario || '').toLowerCase().includes(q) ||
      (n.tipo || '').toLowerCase().includes(q)
    );
  }, [items, busqueda]);

  const abrirCrear = () => { setEditId(null); setForm(EMPTY); setModalOpen(true); };
  const abrirEditar = (n) => {
    setEditId(n.id);
    setForm({
      idDestinatario: n.idDestinatario != null ? String(n.idDestinatario) : '',
      asunto: n.asunto || '',
      cuerpo: n.cuerpo || '',
      tipo: n.tipo || 'Informativa',
      prioridad: n.prioridad || 'Media',
      idCurso: n.idCurso != null ? String(n.idCurso) : '',
    });
    setModalOpen(true);
  };
  const cerrarModal = () => { setModalOpen(false); setEditId(null); setForm(EMPTY); };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.idDestinatario || !form.asunto.trim() || !usuario?.id) {
      await mostrarAlerta({ icon: 'warning', title: 'Campos incompletos', text: 'Destinatario y asunto son obligatorios' });
      return;
    }
    setGuardando(true);
    try {
      const payload = {
        idRemitente: usuario.id,
        idDestinatario: parseInt(form.idDestinatario, 10),
        asunto: form.asunto.trim(),
        cuerpo: form.cuerpo || null,
        tipo: form.tipo,
        prioridad: form.prioridad,
        idCurso: form.idCurso ? parseInt(form.idCurso, 10) : null,
      };
      if (editId) {
        await notificationService.actualizar(editId, payload);
        await mostrarAlerta({ icon: 'success', title: 'Actualizada', text: 'Notificación guardada' });
      } else {
        await notificationService.crear(payload);
        await mostrarAlerta({ icon: 'success', title: 'Creada', text: 'Notificación enviada' });
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
    const ok = await confirmDelete(`la notificación "${row.asunto}"`);
    if (!ok) return;
    try {
      await notificationService.eliminar(row.id);
      await mostrarAlerta({ icon: 'success', title: 'Eliminada', text: 'Notificación eliminada' });
      cargar();
    } catch (e) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: e.message });
    }
  };

  if (cargando) return <div className="es-page"><LoadingState /></div>;

  return (
    <div className="es-page">
      <PageHeader
        title="Notificaciones"
        subtitle={puedeGestionar ? 'Centro de notificaciones' : 'Tus notificaciones'}
        actions={puedeGestionar && (
          <button type="button" className="es-btn es-btn-primary" onClick={abrirCrear}>
            <Plus size={18} /> Nueva
          </button>
        )}
      />
      <StatsGrid>
        <StatsCard label="Total" value={items.length} icon={<Bell size={16} />} />
      </StatsGrid>
      <ErrorState message={error} />
      <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar asunto, destinatario o tipo..." />
      {!error && filtrados.length === 0 && <div className="es-state">No hay notificaciones.</div>}
      <CardGrid>
        {filtrados.map((n) => (
          <EntityCard
            key={n.id}
            id={n.id}
            title={n.asunto || 'Sin asunto'}
            footer={
              <ActionButtons
                onView={() => setDetalle(n)}
                onEdit={puedeGestionar ? () => abrirEditar(n) : undefined}
                onDelete={puedeGestionar ? () => handleEliminar(n) : undefined}
                canEdit={puedeGestionar}
                canDelete={puedeGestionar}
              />
            }
          >
            <p><strong>Para:</strong> {n.nombreDestinatario || '—'}</p>
            <p><strong>Tipo:</strong> {n.tipo || '—'} · <strong>Prioridad:</strong> {n.prioridad || '—'}</p>
            {n.tituloCurso && <p><strong>Curso:</strong> {n.tituloCurso}</p>}
          </EntityCard>
        ))}
      </CardGrid>

      {detalle && (
        <DetailModal title="Detalle" onClose={() => setDetalle(null)} fields={[
          { label: 'Asunto', value: detalle.asunto },
          { label: 'Cuerpo', value: detalle.cuerpo },
          { label: 'Remitente', value: detalle.nombreRemitente },
          { label: 'Destinatario', value: detalle.nombreDestinatario },
          { label: 'Tipo', value: detalle.tipo },
          { label: 'Prioridad', value: detalle.prioridad },
          { label: 'Curso', value: detalle.tituloCurso },
        ]} />
      )}

      <FormModal title={editId ? `Editar #${editId}` : 'Nueva notificación'} open={modalOpen} onClose={cerrarModal} width={560}>
        <form onSubmit={guardar}>
          <div className="es-field"><label>Destinatario *</label>
            <select value={form.idDestinatario} onChange={(e) => setForm({ ...form, idDestinatario: e.target.value })} required>
              <option value="">— Seleccionar —</option>
              {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>)}
            </select></div>
          <div className="es-field"><label>Asunto *</label>
            <input value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} required /></div>
          <div className="es-field"><label>Mensaje</label>
            <textarea rows={3} value={form.cuerpo} onChange={(e) => setForm({ ...form, cuerpo: e.target.value })} /></div>
          <div className="es-field"><label>Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option value="Informativa">Informativa</option>
              <option value="Urgente">Urgente</option>
              <option value="Academica">Académica</option>
              <option value="Administrativa">Administrativa</option>
            </select></div>
          <div className="es-field"><label>Prioridad</label>
            <select value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value })}>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select></div>
          <div className="es-field"><label>Curso (opcional)</label>
            <select value={form.idCurso} onChange={(e) => setForm({ ...form, idCurso: e.target.value })}>
              <option value="">— Ninguno —</option>
              {cursos.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
            </select></div>
          <div className="es-form-actions">
            <button type="button" className="es-btn es-btn-secondary" onClick={cerrarModal}>Cancelar</button>
            <button type="submit" className="es-btn es-btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

export default ListaNotificaciones;
