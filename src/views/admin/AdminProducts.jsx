// src/views/admin/AdminProducts.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FiPlus, FiEdit2, FiTrash2, FiImage, FiX, 
  FiCheck, FiLoader, FiDollarSign, FiLink, FiKey, FiHash, FiChevronDown 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    price: 0,
    category_id: '',
    type_id: '',
    image_url: '',
    dodo_product_id: '', // Nuevo campo
    download_url: '',    // Nuevo campo
    secret_key: '',      // Nuevo campo
    state: true
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    const [prods, cats, typs] = await Promise.all([
      supabase.from('products').select('*, categories(name), product_types(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*'),
      supabase.from('product_types').select('*')
    ]);

    if (prods.data) setProducts(prods.data);
    if (cats.data) setCategories(cats.data);
    if (typs.data) setTypes(typs.data);
    setLoading(false);
  }

  const openModal = (product = null) => {
    if (product) {
      setFormData({ ...product });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category_id: categories[0]?.id || '',
        type_id: types[0]?.id || '',
        image_url: '',
        dodo_product_id: '',
        download_url: '',
        secret_key: '',
        state: true
      });
    }
    setIsModalOpen(true);
  };

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

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
      fetchInitialData();
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (window.confirm('¿Eliminar este producto permanentemente?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) fetchInitialData();
    }
  }

  if (loading) return (
    <div className="p-40 text-center bg-studio-bg min-h-screen flex flex-col items-center justify-center gap-4">
      <FiLoader className="animate-spin text-studio-primary" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-studio-secondary animate-pulse">Sincronizando Inventario...</p>
    </div>
  );

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
                      <button onClick={() => handleDelete(p.id)} className="p-3 bg-red-50 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-100 transition-all shadow-sm"><FiTrash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                      onChange={(e) => setFormData({...formData, type_id: e.target.value})}
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

                {/* URL Imagen (Full width) */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">URL de Portada</label>
                  <div className="relative">
                    <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary opacity-40" />
                    <input 
                      type="text" required 
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 pl-10 text-[11px] text-studio-text-title outline-none focus:border-studio-primary transition-all"
                    />
                  </div>
                </div>

                {/* URL Descarga */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">URL de Descarga Directa</label>
                  <div className="relative">
                    <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary opacity-40" />
                    <input 
                      type="text" 
                      value={formData.download_url}
                      onChange={(e) => setFormData({...formData, download_url: e.target.value})}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-studio-bg border border-studio-border rounded-xl p-3.5 pl-10 text-[11px] text-studio-text-title outline-none focus:border-studio-primary transition-all"
                    />
                  </div>
                </div>

                {/* Secret Key */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1">Secret Key / License</label>
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
                disabled={saving}
                className="w-full mt-8 bg-studio-primary text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-studio-primary/20 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 uppercase text-[11px] tracking-[0.3em]"
              >
                {saving ? <FiLoader className="animate-spin" /> : <FiCheck size={18} />}
                {formData.id ? 'Actualizar Producto' : 'Lanzar al Mercado'}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}