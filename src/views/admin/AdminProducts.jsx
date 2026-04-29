// src/views/admin/AdminProducts.jsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FiPlus, FiEdit2, FiTrash2, FiImage, FiX, 
  FiCheck, FiLoader, FiDollarSign, FiLink, FiKey, FiHash, FiChevronDown, FiZap 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMeta, setToastMeta] = useState({ title: '', subtitle: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    price: 0,
    price_coins: 0,
    coin_value: 0,
    category_id: '',
    type_id: '',
    image_url: '',
    dodo_product_id: '', 
    download_url: '',    
    secret_key: '',      
    state: true
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProductsPage(page);
  }, [page]);

  async function fetchInitialData() {
    setLoading(true);
    const [prodsCount, cats, typs] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('*'),
      supabase.from('product_types').select('*')
    ]);

    setTotalCount(prodsCount.count || 0);
    if (cats.data) setCategories(cats.data);
    if (typs.data) setTypes(typs.data);
    setLoading(false);
  }

  async function fetchProductsPage(nextPage) {
    setLoading(true);
    const from = (nextPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const [prods, prodsCount] = await Promise.all([
      supabase
        .from('products')
        .select('*, categories(name), product_types(name)')
        .order('created_at', { ascending: false })
        .range(from, to),
      supabase.from('products').select('id', { count: 'exact', head: true })
    ]);

    if (prods.data) setProducts(prods.data);
    setTotalCount(prodsCount.count || 0);
    setLoading(false);
  }

  const openModal = (product = null) => {
    if (product) {
      setFormData({ ...product });
      setImagePreview(product.image_url || null);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        price_coins: 0,
        coin_value: 0,
        category_id: categories[0]?.id || '',
        type_id: types[0]?.id || '',
        image_url: '',
        dodo_product_id: '',
        download_url: '',
        secret_key: '',
        state: true
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `product-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      alert('Error al subir imagen: ' + error.message);
      setImagePreview(null);
      setFormData(prev => ({ ...prev, image_url: '' }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!formData.image_url) {
      alert('Debes subir una imagen');
      return;
    }
    setSaving(true);

    const isEditing = Boolean(formData.id);

    const productToSave = { ...formData };
    delete productToSave.categories;
    delete productToSave.product_types;

    const { error } = await supabase
      .from('products')
      .upsert(productToSave);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setIsModalOpen(false);
      fetchProductsPage(page);
      setToastMeta({
        title: isEditing ? 'Producto actualizado' : 'Producto creado',
        subtitle: isEditing ? 'Cambios guardados correctamente' : 'Nuevo activo publicado'
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4500);
    }
    setSaving(false);
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteLoading) return;
    setDeleteLoading(true);

    const { error } = await supabase.from('products').delete().eq('id', deleteTarget.id);
    if (!error) {
      const nextTotal = Math.max(0, totalCount - 1);
      const lastPage = Math.max(1, Math.ceil(nextTotal / pageSize));
      const nextPage = Math.min(page, lastPage);
      setPage(nextPage);
      fetchProductsPage(nextPage);
      setToastMeta({ title: 'Producto eliminado', subtitle: 'Se eliminó del inventario' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4500);
    } else {
      alert('Error al eliminar: ' + error.message);
    }

    setDeleteLoading(false);
    setDeleteTarget(null);
  }

  if (loading) return (
    <div className="p-40 text-center bg-studio-bg min-h-screen flex flex-col items-center justify-center gap-4">
      <FiLoader className="animate-spin text-studio-primary" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-studio-secondary animate-pulse">Sincronizando Inventario...</p>
    </div>
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const selectedTypeName = (() => {
    const nameFromTypes = types.find((t) => t.id === formData.type_id)?.name;
    const nameFromProduct = formData?.product_types?.name;
    return (nameFromTypes || nameFromProduct || '').toLowerCase();
  })();

  const isCoinType = selectedTypeName === 'coin';
  const isDownloadableType = selectedTypeName === 'descargable';
  const isConsumibleType = selectedTypeName === 'consumible';

  return (
    <div className="p-8 space-y-8 bg-studio-bg min-h-screen text-studio-text-title">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-studio-border pb-8">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-studio-primary uppercase tracking-[0.4em]">Asset Management</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            Digital <span className="text-studio-primary">Inventory</span>
          </h1>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-studio-text-title text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-studio-primary transition-all shadow-xl shadow-studio-text-title/10 active:scale-95"
        >
          <FiPlus size={18} /> Añadir Activo
        </button>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-white rounded-[2.5rem] border border-studio-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-studio-border">
              <tr className="text-[9px] uppercase tracking-[0.3em] text-studio-secondary font-black opacity-50">
                <th className="p-8">Asset</th>
                <th className="p-8">Categoría</th>
                <th className="p-8">Dodo ID</th>
                <th className="p-8">Valuación</th>
                <th className="p-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-studio-bg transition-colors group">
                  <td className="p-8 flex items-center gap-5">
                    <img src={p.image_url} className="w-14 h-14 rounded-2xl object-cover border border-studio-border group-hover:scale-105 transition-transform duration-500" />
                    <div>
                      <p className="font-black text-sm text-studio-text-title uppercase tracking-tight">{p.name}</p>
                      <p className="text-[9px] font-bold text-studio-secondary opacity-40 uppercase tracking-widest mt-1">ID: #{p.id.slice(0,8)}</p>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="text-[10px] font-black uppercase text-studio-primary bg-studio-primary/5 px-2 py-0.5 rounded-md border border-studio-primary/10">
                      {p.categories?.name}
                    </span>
                  </td>
                  <td className="p-8 text-[10px] font-mono font-bold text-studio-secondary opacity-60">
                    {p.dodo_product_id || '—'}
                  </td>
                  <td className="p-8 font-black text-lg text-studio-text-title italic tracking-tighter">${p.price}</td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(p)} className="p-3 bg-studio-bg rounded-xl text-studio-secondary hover:text-studio-primary hover:bg-studio-primary/10 transition-all shadow-sm"><FiEdit2 size={16}/></button>
                      <button onClick={() => setDeleteTarget(p)} className="p-3 bg-red-50 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-100 transition-all shadow-sm"><FiTrash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white border border-studio-border rounded-2xl px-6 py-4 shadow-sm">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-studio-secondary opacity-50">
          Página {page} de {totalPages}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl border border-studio-border bg-white text-[9px] font-black uppercase tracking-widest text-studio-text-title disabled:opacity-30 hover:bg-studio-bg transition-all"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-xl border border-studio-border bg-white text-[9px] font-black uppercase tracking-widest text-studio-text-title disabled:opacity-30 hover:bg-studio-bg transition-all"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* MODAL COMPACTO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-studio-text-title/40 backdrop-blur-md"
            />
            <motion.form 
              onSubmit={handleSave}
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] border border-studio-border shadow-2xl p-10 overflow-y-auto max-h-[90vh] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase italic text-studio-text-title tracking-tighter">
                  {formData.id ? 'Configurar Producto' : 'Nuevo Registro'}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-studio-bg rounded-xl text-studio-secondary hover:text-studio-primary transition-all"><FiX size={20}/></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Nombre (2/3) */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Nombre Comercial</label>
                  <input 
                    type="text" required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 text-[13px] font-bold text-studio-text-title outline-none focus:border-studio-primary transition-all"
                  />
                </div>

                {/* Precio (1/3) */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Precio ($)</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary" />
                    <input 
                      type="number" step="0.01" required 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 pl-10 text-[13px] font-bold text-studio-text-title outline-none focus:border-studio-primary transition-all"
                    />
                  </div>
                </div>

                {/* Categoría */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Clasificación</label>
                  <div className="relative">
                    <select 
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 text-[13px] font-bold text-studio-text-title outline-none focus:border-studio-primary appearance-none"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-studio-primary pointer-events-none" />
                  </div>
                </div>

                {/* Tipo */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Tipo Recurso</label>
                  <div className="relative">
                    <select 
                      value={formData.type_id}
                      onChange={(e) => {
                        const nextTypeId = e.target.value;
                        const nextTypeName = (types.find((t) => t.id === nextTypeId)?.name || '').toLowerCase();

                        setFormData((prev) => {
                          const next = { ...prev, type_id: nextTypeId };
                          if (nextTypeName === 'coin') {
                            next.download_url = '';
                            next.secret_key = '';
                          } else if (nextTypeName === 'descargable') {
                            next.price_coins = 0;
                            next.coin_value = 0;
                            next.secret_key = '';
                          } else if (nextTypeName === 'consumible') {
                            next.price_coins = 0;
                            next.coin_value = 0;
                            next.download_url = '';
                          }
                          return next;
                        });
                      }}
                      className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 text-[13px] font-bold text-studio-text-title outline-none focus:border-studio-primary appearance-none"
                    >
                      {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-studio-primary pointer-events-none" />
                  </div>
                </div>

                {/* Dodo Product ID */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Dodo Product ID</label>
                  <div className="relative">
                    <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary opacity-40" />
                    <input 
                      type="text" 
                      value={formData.dodo_product_id}
                      onChange={(e) => setFormData({...formData, dodo_product_id: e.target.value})}
                      placeholder="prod_..."
                      className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 pl-10 text-[11px] font-mono text-studio-text-title outline-none focus:border-studio-primary transition-all"
                    />
                  </div>
                </div>

                {isCoinType && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Precio (Coins)</label>
                      <div className="relative">
                        <FiZap className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary" />
                        <input 
                          type="number" 
                          step="1" 
                          min="0" 
                          value={formData.price_coins || 0}
                          onChange={(e) => setFormData({ ...formData, price_coins: e.target.value })}
                          className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 pl-10 text-[13px] font-bold text-studio-text-title outline-none focus:border-studio-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Coin Value (A&BCoins)</label>
                      <div className="relative">
                        <FiZap className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary opacity-40" />
                        <input 
                          type="number" 
                          step="1" 
                          min="0" 
                          value={formData.coin_value || 0}
                          onChange={(e) => setFormData({ ...formData, coin_value: e.target.value })}
                          className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 pl-10 text-[13px] font-bold text-studio-text-title outline-none focus:border-studio-primary transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {isDownloadableType && (
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Download URL</label>
                    <div className="relative">
                      <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary opacity-40" />
                      <input 
                        type="text" 
                        value={formData.download_url}
                        onChange={(e) => setFormData({...formData, download_url: e.target.value})}
                        placeholder="https://..."
                        className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 pl-10 text-[11px] text-studio-text-title outline-none focus:border-studio-primary transition-all"
                      />
                    </div>
                  </div>
                )}

                {isConsumibleType && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Secret Key</label>
                    <div className="relative">
                      <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary opacity-40" />
                      <input 
                        type="text" 
                        value={formData.secret_key}
                        onChange={(e) => setFormData({...formData, secret_key: e.target.value})}
                        placeholder="KEY-..."
                        className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 pl-10 text-[11px] font-mono text-studio-text-title outline-none focus:border-studio-primary transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* URL Imagen (Full width) */}
                <div className="md:col-span-3 space-y-2">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Portada del Producto</label>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`relative w-full h-44 rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex items-center justify-center ${
                      imagePreview ? 'border-studio-primary/20 bg-studio-bg' : 'border-studio-border hover:border-studio-primary/30 bg-studio-bg/50'
                    }`}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-studio-text-title/40 opacity-0 hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                          <p className="text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                            <FiImage /> Update Image
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-studio-secondary/30">
                        <FiImage size={32} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Drop image here</p>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center gap-3 z-10">
                        <FiLoader className="animate-spin text-studio-primary" size={20} />
                        <p className="text-studio-text-title font-black text-[10px] uppercase tracking-widest">Uploading...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Descripción (Full width) */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Descripción del Asset</label>
                  <textarea 
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-studio-bg border border-studio-border rounded-xl p-4 text-[13px] font-medium text-studio-secondary outline-none focus:border-studio-primary transition-all resize-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={saving || uploading}
                className="w-full mt-8 bg-studio-primary text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-studio-primary/20 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 uppercase text-[11px] tracking-[0.3em]"
              >
                {saving ? <FiLoader className="animate-spin" /> : <FiCheck size={18} />}
                {formData.id ? 'Actualizar Producto' : 'Lanzar al Mercado'}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleteLoading && setDeleteTarget(null)}
              className="absolute inset-0 bg-studio-text-title/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] border border-studio-border shadow-2xl p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-studio-secondary opacity-60">Confirmación</p>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-studio-text-title mt-1">Eliminar producto</h3>
                </div>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setDeleteTarget(null)}
                  className="w-10 h-10 flex items-center justify-center bg-studio-bg rounded-xl text-studio-secondary hover:text-studio-primary transition-all disabled:opacity-40"
                >
                  <FiX size={18} />
                </button>
              </div>

              <p className="mt-4 text-[12px] font-bold text-studio-secondary">
                ¿Seguro que deseas eliminar <span className="text-studio-text-title">{deleteTarget.name}</span> permanentemente?
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-3 rounded-xl border border-studio-border bg-white text-[10px] font-black uppercase tracking-widest text-studio-text-title hover:bg-studio-bg transition-all disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={confirmDelete}
                  className="px-4 py-3 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteLoading ? <FiLoader className="animate-spin" /> : <FiTrash2 size={16} />}
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
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
                <p className="font-bold text-studio-text-title text-sm leading-tight">{toastMeta.title}</p>
                <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-wider mt-0.5">{toastMeta.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-2 right-2 p-1 hover:bg-studio-bg rounded-md transition-colors text-studio-secondary/40 hover:text-studio-secondary"
            >
              <FiX size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}