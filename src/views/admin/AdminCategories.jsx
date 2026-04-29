// src/views/admin/AdminCategories.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
  FiLoader, FiTag, FiPackage
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// ── Componente de modal reutilizable ─────────────────────────────────────────

const ItemModal = ({ isOpen, onClose, onSave, saving, title, value, onChange, placeholder }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-studio-text-title/40 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] border border-studio-border shadow-2xl p-10"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase italic text-studio-text-title tracking-tighter">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-studio-bg rounded-xl text-studio-secondary hover:text-studio-primary transition-all"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1 opacity-60">
              Nombre
            </label>
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className="w-full bg-studio-bg border border-studio-border rounded-xl p-4 text-sm font-bold text-studio-text-title outline-none focus:border-studio-primary transition-all"
            />
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={saving || !value.trim()}
            className="w-full mt-8 bg-studio-text-title text-white font-black py-5 rounded-[1.5rem] shadow-xl flex items-center justify-center gap-3 hover:bg-studio-primary transition-all disabled:opacity-50 uppercase text-[11px] tracking-[0.3em]"
          >
            {saving ? <FiLoader className="animate-spin" /> : <FiCheck size={18} />}
            Guardar
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ── Componente de confirmación de borrado ─────────────────────────────────────

const DeleteModal = ({ isOpen, onClose, onConfirm, loading, itemName }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => !loading && onClose()}
          className="absolute inset-0 bg-studio-text-title/40 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-[2rem] border border-studio-border shadow-2xl p-8"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-studio-secondary opacity-60">Confirmación</p>
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-studio-text-title mt-1">Eliminar</h3>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-studio-bg rounded-xl text-studio-secondary hover:text-studio-primary transition-all disabled:opacity-40"
            >
              <FiX size={18} />
            </button>
          </div>

          <p className="text-xs font-bold text-studio-secondary mb-8">
            ¿Seguro que deseas eliminar <span className="text-studio-text-title">"{itemName}"</span>? Esta acción no se puede deshacer.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-studio-border bg-white text-[10px] font-black uppercase tracking-widest text-studio-text-title hover:bg-studio-bg transition-all disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className="px-4 py-3 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <FiLoader className="animate-spin" size={14} /> : <FiTrash2 size={14} />}
              Eliminar
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ── Toast ─────────────────────────────────────────────────────────────────────

const Toast = ({ show, onClose, title, subtitle }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
        className="fixed top-24 right-6 z-[200] w-full max-w-[320px] bg-white rounded-xl shadow-2xl border border-gray-100 flex items-center overflow-hidden"
      >
        <div className="w-1.5 h-16 bg-studio-primary shrink-0" />
        <div className="flex items-center gap-3 p-4 flex-1">
          <div className="bg-studio-primary/10 p-2 rounded-full shrink-0 text-studio-primary">
            <FiCheck size={18} />
          </div>
          <div className="flex-1 pr-6">
            <p className="font-bold text-studio-text-title text-sm leading-tight">{title}</p>
            <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-wider mt-0.5">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-studio-bg rounded-md transition-colors text-studio-secondary/40 hover:text-studio-secondary"
        >
          <FiX size={14} />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Tabla genérica ────────────────────────────────────────────────────────────

const ItemTable = ({ items, loading, onEdit, onDelete }) => (
  <div className="bg-white rounded-[2.5rem] border border-studio-border shadow-sm overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-gray-50/50 border-b border-studio-border">
        <tr className="text-[9px] uppercase tracking-[0.3em] text-studio-secondary font-black opacity-50">
          <th className="p-6">ID</th>
          <th className="p-6 pl-8">Nombre</th>
          <th className="p-6 text-right pr-8">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-studio-border">
        {loading ? (
          [1, 2, 3].map(i => (
            <tr key={i} className="animate-pulse">
              <td colSpan="3" className="p-6 h-16 bg-gray-50/30" />
            </tr>
          ))
        ) : items.length === 0 ? (
          <tr>
            <td colSpan="3" className="p-12 text-center">
              <p className="text-[10px] font-black text-studio-secondary uppercase tracking-[0.3em] opacity-30">
                No hay registros todavía
              </p>
            </td>
          </tr>
        ) : (
          items.map(item => (
            <motion.tr layout key={item.id} className="hover:bg-studio-bg transition-colors group">
              <td className="p-6">
                <span className="text-[9px] font-mono text-studio-secondary opacity-40">
                  #{item.id}
                </span>
              </td>
              <td className="p-6 pl-8">
                <span className="font-black text-sm text-studio-text-title uppercase tracking-tight">
                  {item.name}
                </span>
              </td>
              
              <td className="p-6 pr-8 text-right">
                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-3 bg-studio-bg rounded-xl text-studio-secondary hover:text-studio-primary hover:bg-studio-primary/10 transition-all shadow-sm"
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-3 bg-red-50 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-100 transition-all shadow-sm"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// ── Vista principal ───────────────────────────────────────────────────────────

export default function AdminCategories() {
  // ── Estado Categorías
  const [categories, setCategories]   = useState([]);
  const [catLoading, setCatLoading]   = useState(true);
  const [catModal, setCatModal]       = useState(false);
  const [catSaving, setCatSaving]     = useState(false);
  const [catForm, setCatForm]         = useState({ id: null, name: '' });
  const [catDelete, setCatDelete]     = useState(null);
  const [catDelLoading, setCatDelLoading] = useState(false);

  // ── Estado Tipos
  const [types, setTypes]             = useState([]);
  const [typLoading, setTypLoading]   = useState(true);
  const [typModal, setTypModal]       = useState(false);
  const [typSaving, setTypSaving]     = useState(false);
  const [typForm, setTypForm]         = useState({ id: null, name: '' });
  const [typDelete, setTypDelete]     = useState(null);
  const [typDelLoading, setTypDelLoading] = useState(false);

  // ── Toast compartido
  const [toast, setToast] = useState({ show: false, title: '', subtitle: '' });

  const showToast = (title, subtitle) => {
    setToast({ show: true, title, subtitle });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4500);
  };

  // ── Fetch
  const fetchCategories = async () => {
    setCatLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
    setCatLoading(false);
  };

  const fetchTypes = async () => {
    setTypLoading(true);
    const { data } = await supabase.from('product_types').select('*').order('name');
    if (data) setTypes(data);
    setTypLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, []);

  // ── CRUD Categorías
  const openCatModal = (item = null) => {
    setCatForm(item ? { id: item.id, name: item.name } : { id: null, name: '' });
    setCatModal(true);
  };

  const saveCat = async () => {
    if (!catForm.name.trim()) return;
    setCatSaving(true);
    const isEdit = Boolean(catForm.id);
    const { error } = isEdit
      ? await supabase.from('categories').update({ name: catForm.name.trim() }).eq('id', catForm.id)
      : await supabase.from('categories').insert({ name: catForm.name.trim() });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setCatModal(false);
      fetchCategories();
      showToast(
        isEdit ? 'Categoría actualizada' : 'Categoría creada',
        isEdit ? 'El nombre fue modificado' : 'Nueva categoría registrada'
      );
    }
    setCatSaving(false);
  };

  const deleteCat = async () => {
    if (!catDelete) return;
    setCatDelLoading(true);
    const { error } = await supabase.from('categories').delete().eq('id', catDelete.id);
    if (error) {
      alert('No se puede eliminar. Puede tener productos asociados.');
    } else {
      fetchCategories();
      showToast('Categoría eliminada', 'Se eliminó correctamente');
    }
    setCatDelLoading(false);
    setCatDelete(null);
  };

  // ── CRUD Tipos
  const openTypModal = (item = null) => {
    setTypForm(item ? { id: item.id, name: item.name } : { id: null, name: '' });
    setTypModal(true);
  };

  const saveTyp = async () => {
    if (!typForm.name.trim()) return;
    setTypSaving(true);
    const isEdit = Boolean(typForm.id);
    const { error } = isEdit
      ? await supabase.from('product_types').update({ name: typForm.name.trim() }).eq('id', typForm.id)
      : await supabase.from('product_types').insert({ name: typForm.name.trim() });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setTypModal(false);
      fetchTypes();
      showToast(
        isEdit ? 'Tipo actualizado' : 'Tipo creado',
        isEdit ? 'El nombre fue modificado' : 'Nuevo tipo de producto registrado'
      );
    }
    setTypSaving(false);
  };

  const deleteTyp = async () => {
    if (!typDelete) return;
    setTypDelLoading(true);
    const { error } = await supabase.from('product_types').delete().eq('id', typDelete.id);
    if (error) {
      alert('No se puede eliminar. Puede tener productos asociados.');
    } else {
      fetchTypes();
      showToast('Tipo eliminado', 'Se eliminó correctamente');
    }
    setTypDelLoading(false);
    setTypDelete(null);
  };

  return (
    <div className="p-8 space-y-12 bg-studio-bg min-h-screen text-studio-text-title font-sans">

      {/* HEADER */}
      <div className="border-b border-studio-border pb-8">
        <p className="text-[10px] font-black text-studio-primary uppercase tracking-[0.4em] mb-1">
          Taxonomía de Productos
        </p>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
          Categorías <span className="text-studio-primary">&</span> Tipos
        </h1>
      </div>

      {/* ── SECCIÓN CATEGORÍAS ── */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-studio-primary/10 rounded-xl flex items-center justify-center text-studio-primary">
                <FiTag size={15} />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-studio-text-title">
                Categorías
              </h2>
            </div>
            <p className="text-[10px] font-bold text-studio-secondary opacity-40 uppercase tracking-widest ml-10">
              {categories.length} registro{categories.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => openCatModal()}
            className="bg-studio-text-title text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-studio-primary transition-all shadow-lg active:scale-95"
          >
            <FiPlus size={16} /> Nueva Categoría
          </button>
        </div>

        <ItemTable
          items={categories}
          loading={catLoading}
          onEdit={openCatModal}
          onDelete={setCatDelete}
        />
      </section>

      {/* ── SECCIÓN TIPOS DE PRODUCTO ── */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-studio-primary/10 rounded-xl flex items-center justify-center text-studio-primary">
                <FiPackage size={15} />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-studio-text-title">
                Tipos de Producto
              </h2>
            </div>
            <p className="text-[10px] font-bold text-studio-secondary opacity-40 uppercase tracking-widest ml-10">
              {types.length} registro{types.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => openTypModal()}
            className="bg-studio-text-title text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-studio-primary transition-all shadow-lg active:scale-95"
          >
            <FiPlus size={16} /> Nuevo Tipo
          </button>
        </div>

        <ItemTable
          items={types}
          loading={typLoading}
          onEdit={openTypModal}
          onDelete={setTypDelete}
        />
      </section>

      {/* ── MODALES CATEGORÍAS ── */}
      <ItemModal
        isOpen={catModal}
        onClose={() => setCatModal(false)}
        onSave={saveCat}
        saving={catSaving}
        title={catForm.id ? 'Editar Categoría' : 'Nueva Categoría'}
        value={catForm.name}
        onChange={v => setCatForm(f => ({ ...f, name: v }))}
        placeholder="Ej: Mac, Windows, Assets..."
      />

      <DeleteModal
        isOpen={Boolean(catDelete)}
        onClose={() => setCatDelete(null)}
        onConfirm={deleteCat}
        loading={catDelLoading}
        itemName={catDelete?.name}
      />

      {/* ── MODALES TIPOS ── */}
      <ItemModal
        isOpen={typModal}
        onClose={() => setTypModal(false)}
        onSave={saveTyp}
        saving={typSaving}
        title={typForm.id ? 'Editar Tipo' : 'Nuevo Tipo'}
        value={typForm.name}
        onChange={v => setTypForm(f => ({ ...f, name: v }))}
        placeholder="Ej: Descargable, Consumible..."
      />

      <DeleteModal
        isOpen={Boolean(typDelete)}
        onClose={() => setTypDelete(null)}
        onConfirm={deleteTyp}
        loading={typDelLoading}
        itemName={typDelete?.name}
      />

      {/* ── TOAST ── */}
      <Toast
        show={toast.show}
        onClose={() => setToast(t => ({ ...t, show: false }))}
        title={toast.title}
        subtitle={toast.subtitle}
      />
    </div>
  );
}