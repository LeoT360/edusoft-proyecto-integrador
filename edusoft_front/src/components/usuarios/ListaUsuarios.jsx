/**
 * ListaUsuarios — gestión de usuarios (solo Profesor): listar, buscar, crear, editar y eliminar
 * mediante modales. Al editar, dejar la contraseña vacía conserva la actual.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { usuarioService } from '../../services/usuarioService';
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

const EMPTY = { nombre: '', correo: '', contrasena: '', rol: 'Estudiante', telefono: '', documento: '' };

function ListaUsuarios() {
  const puedeGestionar = esProfesor();
  const [usuarios, setUsuarios] = useState([]);
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
      const data = await usuarioService.listarTodos();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los usuarios');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter((u) =>
      (u.nombre || '').toLowerCase().includes(q) ||
      (u.correo || '').toLowerCase().includes(q) ||
      (u.rol || '').toLowerCase().includes(q)
    );
  }, [usuarios, busqueda]);

  const abrirCrear = () => {
    setEditId(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const abrirEditar = (u) => {
    setEditId(u.id);
    setForm({
      nombre: u.nombre || '',
      correo: u.correo || '',
      contrasena: '',
      rol: u.rol || 'Estudiante',
      telefono: u.telefono || '',
      documento: u.documento || '',
    });
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditId(null);
    setForm(EMPTY);
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.correo.trim() || !form.rol) {
      await mostrarAlerta({ icon: 'warning', title: 'Campos incompletos', text: 'Nombre, correo y rol son obligatorios' });
      return;
    }
    if (!editId && !form.contrasena) {
      await mostrarAlerta({ icon: 'warning', title: 'Contraseña requerida', text: 'Al crear un usuario la contraseña es obligatoria' });
      return;
    }
    setGuardando(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        rol: form.rol,
        telefono: form.telefono || null,
        documento: form.documento || null,
      };
      if (form.contrasena) payload.contrasena = form.contrasena;
      if (editId) {
        await usuarioService.actualizar(editId, payload);
        await mostrarAlerta({ icon: 'success', title: 'Actualizado', text: 'Usuario guardado' });
      } else {
        await usuarioService.crear(payload);
        await mostrarAlerta({ icon: 'success', title: 'Creado', text: 'Usuario registrado' });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (usuario) => {
    const ok = await confirmDelete(`al usuario "${usuario.nombre}"`);
    if (!ok) return;
    try {
      await usuarioService.eliminar(usuario.id);
      await mostrarAlerta({ icon: 'success', title: 'Eliminado', text: 'Usuario eliminado' });
      cargar();
    } catch (e) {
      await mostrarAlerta({ icon: 'error', title: 'Error', text: e.message });
    }
  };

  if (cargando) return <div className="es-page"><LoadingState /></div>;

  return (
    <div className="es-page">
      <PageHeader
        title="Usuarios"
        subtitle="Gestión de cuentas del sistema"
        actions={puedeGestionar && (
          <button type="button" className="es-btn es-btn-primary" onClick={abrirCrear}>
            <Plus size={18} /> Nuevo usuario
          </button>
        )}
      />
      <StatsGrid>
        <StatsCard label="Total" value={usuarios.length} icon={<Users size={16} />} />
        <StatsCard label="Profesores" value={usuarios.filter((u) => u.rol === 'Profesor').length} />
        <StatsCard label="Estudiantes" value={usuarios.filter((u) => u.rol === 'Estudiante').length} />
      </StatsGrid>
      <ErrorState message={error} />
      <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre, correo o rol..." />
      {!error && filtrados.length === 0 && <div className="es-state">No hay usuarios.</div>}
      <CardGrid>
        {filtrados.map((usuario) => (
          <EntityCard
            key={usuario.id}
            id={usuario.id}
            title={usuario.nombre}
            footer={
              <ActionButtons
                onView={() => setDetalle(usuario)}
                onEdit={puedeGestionar ? () => abrirEditar(usuario) : undefined}
                onDelete={puedeGestionar ? () => handleEliminar(usuario) : undefined}
                canEdit={puedeGestionar}
                canDelete={puedeGestionar}
              />
            }
          >
            <p><strong>Rol:</strong> {usuario.rol || '—'}</p>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            {usuario.documento && <p><strong>Doc:</strong> {usuario.documento}</p>}
            {usuario.telefono && <p><strong>Teléfono:</strong> {usuario.telefono}</p>}
          </EntityCard>
        ))}
      </CardGrid>

      {detalle && (
        <DetailModal
          title="Detalle del usuario"
          onClose={() => setDetalle(null)}
          fields={[
            { label: 'ID', value: detalle.id },
            { label: 'Nombre', value: detalle.nombre },
            { label: 'Correo', value: detalle.correo },
            { label: 'Rol', value: detalle.rol },
            { label: 'Documento', value: detalle.documento },
            { label: 'Teléfono', value: detalle.telefono },
          ]}
        />
      )}

      <FormModal title={editId ? `Editar usuario #${editId}` : 'Nuevo usuario'} open={modalOpen} onClose={cerrarModal}>
        <form onSubmit={guardar}>
          <div className="es-field">
            <label>Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="es-field">
            <label>Correo</label>
            <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
          </div>
          <div className="es-field">
            <label>{editId ? 'Contraseña (opcional)' : 'Contraseña'}</label>
            <input type="password" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} />
          </div>
          <div className="es-field">
            <label>Rol</label>
            <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
              <option value="Profesor">Profesor</option>
              <option value="Estudiante">Estudiante</option>
            </select>
          </div>
          <div className="es-field">
            <label>Documento</label>
            <input value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} />
          </div>
          <div className="es-field">
            <label>Teléfono</label>
            <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          </div>
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

export default ListaUsuarios;
