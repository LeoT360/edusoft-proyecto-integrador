/**
 * ListaProfesores — lista todos los usuarios con rol Profesor junto con su perfil profesional
 * (si existe). El Profesor puede crear o editar el perfil desde un modal.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { GraduationCap, Plus } from 'lucide-react';
import { usuarioService } from '../../services/usuarioService';
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
import './Profesores.css';

const EMPTY = {
  idUsuario: '', areasAsignadas: '', nivelAcademico: '', anosExperiencia: '',
  tipoContrato: '', fechaIngreso: '', vigencia: true, perfilProfesional: '',
};

function ListaProfesores() {
  const puedeGestionar = esProfesor();
  const [perfiles, setPerfiles] = useState([]);
  const [usuariosProf, setUsuariosProf] = useState([]);
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
      const [usuarios, lista] = await Promise.all([
        usuarioService.listarTodos(),
        profesorService.listarTodos().catch(() => []),
      ]);
      setUsuariosProf((usuarios || []).filter((u) => u.rol === 'Profesor'));
      setPerfiles(Array.isArray(lista) ? lista : []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los profesores');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  /** Merge: every Profesor-role user + profile if exists */
  const items = useMemo(() => {
    return usuariosProf.map((u) => {
      const perfil = perfiles.find((p) => p.idUsuario === u.id);
      return {
        usuarioId: u.id,
        profesorId: perfil?.id ?? null,
        nombre: perfil?.nombre || u.nombre,
        correo: perfil?.correo || u.correo,
        documento: perfil?.documento || u.documento,
        telefono: perfil?.telefono || u.telefono,
        areasAsignadas: perfil?.areasAsignadas || '',
        nivelAcademico: perfil?.nivelAcademico || '',
        perfilCompleto: Boolean(perfil),
        rawPerfil: perfil,
      };
    });
  }, [usuariosProf, perfiles]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      (p.nombre || '').toLowerCase().includes(q) ||
      (p.correo || '').toLowerCase().includes(q) ||
      (p.areasAsignadas || '').toLowerCase().includes(q)
    );
  }, [items, busqueda]);

  const sinPerfil = usuariosProf.filter((u) => !perfiles.some((p) => p.idUsuario === u.id));

  const abrirCrear = (usuarioId = '') => {
    setEditId(null);
    setForm({ ...EMPTY, idUsuario: usuarioId ? String(usuarioId) : '' });
    setModalOpen(true);
  };

  const abrirEditar = (item) => {
    if (item.profesorId && item.rawPerfil) {
      const p = item.rawPerfil;
      setEditId(item.profesorId);
      setForm({
        idUsuario: String(p.idUsuario),
        areasAsignadas: p.areasAsignadas || '',
        nivelAcademico: p.nivelAcademico || '',
        anosExperiencia: p.anosExperiencia != null ? String(p.anosExperiencia) : '',
        tipoContrato: p.tipoContrato || '',
        fechaIngreso: p.fechaIngreso || '',
        vigencia: p.vigencia !== false,
        perfilProfesional: p.perfilProfesional || '',
      });
      setModalOpen(true);
    } else {
      abrirCrear(item.usuarioId);
    }
  };

  const cerrarModal = () => { setModalOpen(false); setEditId(null); setForm(EMPTY); };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.idUsuario) {
      await mostrarAlerta({ icon: 'warning', title: 'Usuario requerido', text: 'Selecciona un usuario con rol Profesor' });
      return;
    }
    setGuardando(true);
    try {
      const payload = {
        idUsuario: parseInt(form.idUsuario, 10),
        areasAsignadas: form.areasAsignadas || null,
        nivelAcademico: form.nivelAcademico || null,
        anosExperiencia: form.anosExperiencia !== '' ? parseInt(form.anosExperiencia, 10) : null,
        tipoContrato: form.tipoContrato || null,
        fechaIngreso: form.fechaIngreso || null,
        vigencia: Boolean(form.vigencia),
        perfilProfesional: form.perfilProfesional || null,
      };
      if (editId) {
        await profesorService.actualizar(editId, payload);
        await mostrarAlerta({ icon: 'success', title: 'Actualizado', text: 'Perfil guardado' });
      } else {
        await profesorService.crear(payload);
        await mostrarAlerta({ icon: 'success', title: 'Creado', text: 'Perfil de profesor creado' });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (item) => {
    if (!item.profesorId) {
      await mostrarAlerta({ icon: 'info', title: 'Sin perfil', text: 'Solo existe como usuario. Gestiona el rol desde Usuarios.' });
      return;
    }
    const ok = await confirmDelete(`el perfil de "${item.nombre}"`);
    if (!ok) return;
    try {
      await profesorService.eliminar(item.profesorId);
      await mostrarAlerta({ icon: 'success', title: 'Eliminado', text: 'Perfil eliminado' });
      cargar();
    } catch (e) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: e.message });
    }
  };

  if (cargando) return <div className="es-page"><LoadingState /></div>;

  return (
    <div className="es-page">
      <PageHeader title="Profesores" subtitle="Usuarios con rol Profesor y su perfil extendido"
        actions={puedeGestionar && (
          <button type="button" className="es-btn es-btn-primary" onClick={() => abrirCrear()}>
            <Plus size={18} /> Nuevo perfil
          </button>
        )}
      />
      <StatsGrid>
        <StatsCard label="Usuarios profesor" value={items.length} icon={<GraduationCap size={16} />} />
        <StatsCard label="Con perfil" value={items.filter((i) => i.perfilCompleto).length} />
        <StatsCard label="Pendientes" value={items.filter((i) => !i.perfilCompleto).length} />
      </StatsGrid>
      <ErrorState message={error} />
      <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar nombre, correo o área..." />
      {!error && filtrados.length === 0 && <div className="es-state">No hay usuarios con rol Profesor. Crea uno en Usuarios.</div>}
      <CardGrid>
        {filtrados.map((p) => (
          <EntityCard key={p.usuarioId} id={p.usuarioId} title={p.nombre}
            footer={<ActionButtons onView={() => setDetalle(p)}
              onEdit={puedeGestionar ? () => abrirEditar(p) : undefined}
              onDelete={puedeGestionar ? () => handleEliminar(p) : undefined}
              canEdit={puedeGestionar} canDelete={puedeGestionar && Boolean(p.profesorId)} />}>
            <p><strong>Correo:</strong> {p.correo}</p>
            {p.documento && <p><strong>Doc:</strong> {p.documento}</p>}
            {p.areasAsignadas && <p><strong>Áreas:</strong> {p.areasAsignadas}</p>}
            <p><strong>Perfil:</strong> {p.perfilCompleto ? 'Completo' : 'Incompleto'}</p>
          </EntityCard>
        ))}
      </CardGrid>
      {detalle && (
        <DetailModal title="Detalle" onClose={() => setDetalle(null)} fields={[
          { label: 'Usuario ID', value: detalle.usuarioId },
          { label: 'Perfil ID', value: detalle.profesorId },
          { label: 'Nombre', value: detalle.nombre },
          { label: 'Correo', value: detalle.correo },
          { label: 'Documento', value: detalle.documento },
          { label: 'Áreas', value: detalle.areasAsignadas },
          { label: 'Nivel', value: detalle.nivelAcademico },
        ]} />
      )}
      <FormModal title={editId ? `Editar perfil #${editId}` : 'Nuevo perfil de profesor'} open={modalOpen} onClose={cerrarModal} width={560}>
        <form onSubmit={guardar}>
          <div className="es-field"><label>Usuario (rol Profesor) *</label>
            <select value={form.idUsuario} onChange={(e) => setForm({ ...form, idUsuario: e.target.value })} required disabled={Boolean(editId)}>
              <option value="">— Seleccionar —</option>
              {(editId ? usuariosProf : sinPerfil).map((u) => (
                <option key={u.id} value={u.id}>{u.nombre} ({u.correo})</option>
              ))}
              {editId && form.idUsuario && !sinPerfil.find((u) => String(u.id) === form.idUsuario) && (
                <option value={form.idUsuario}>Usuario #{form.idUsuario}</option>
              )}
            </select>
          </div>
          <div className="es-field"><label>Áreas asignadas</label>
            <input value={form.areasAsignadas} onChange={(e) => setForm({ ...form, areasAsignadas: e.target.value })} /></div>
          <div className="es-field"><label>Nivel académico</label>
            <select value={form.nivelAcademico} onChange={(e) => setForm({ ...form, nivelAcademico: e.target.value })}>
              <option value="">— Seleccionar —</option>
              <option value="Técnico">Técnico</option>
              <option value="Tecnólogo">Tecnólogo</option>
              <option value="Profesional">Profesional</option>
              <option value="Especialización">Especialización</option>
              <option value="Maestría">Maestría</option>
              <option value="Doctorado">Doctorado</option>
            </select></div>
          <div className="es-field"><label>Años de experiencia</label>
            <input type="number" value={form.anosExperiencia} onChange={(e) => setForm({ ...form, anosExperiencia: e.target.value })} /></div>
          <div className="es-field"><label>Tipo de contrato</label>
            <select value={form.tipoContrato} onChange={(e) => setForm({ ...form, tipoContrato: e.target.value })}>
              <option value="">— Seleccionar —</option>
              <option value="Tiempo completo">Tiempo completo</option>
              <option value="Medio tiempo">Medio tiempo</option>
              <option value="Cátedra">Cátedra</option>
              <option value="Prestación de servicios">Prestación de servicios</option>
              <option value="Temporal">Temporal</option>
            </select></div>
          <div className="es-field"><label>Fecha de ingreso</label>
            <input type="date" value={form.fechaIngreso} onChange={(e) => setForm({ ...form, fechaIngreso: e.target.value })} /></div>
          <div className="es-field"><label>Perfil profesional</label>
            <textarea rows={2} value={form.perfilProfesional} onChange={(e) => setForm({ ...form, perfilProfesional: e.target.value })} /></div>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <input type="checkbox" checked={form.vigencia} onChange={(e) => setForm({ ...form, vigencia: e.target.checked })} />
            Vigente
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

export default ListaProfesores;
