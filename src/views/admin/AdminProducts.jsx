import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiX, FiCheck, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado para el formulario (Nuevo o Editar)
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    price: 0,
    category_id: '',
    type_id: '',
    image_url: '',
    state: true
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    // Traemos productos, categorías y tipos en paralelo
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

  // Abrir modal para crear o editar
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
        state: true
      });
    }
    setIsModalOpen(true);
  };

  // Guardar Producto (Insert o Update)
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const productToSave = { ...formData };
    // Eliminamos las relaciones virtuales antes de guardar para evitar errores de Postgres
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

  if (loading) return <div className="p-40 text-center animate-pulse text-digital-lavender font-black">Sincronizando Inventario...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white italic">Productos</h1>
          <p className="text-white/30 text-sm font-medium">Catálogo digital de A&B Studio</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-digital-lavender text-panda-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
        >
          <FiPlus size={18} /> Añadir Producto
        </button>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-[#161b27] rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40 font-black">
            <tr>
              <th className="p-6">Preview</th>
              <th className="p-6">Nombre</th>
              <th className="p-6">Categoría</th>
              <th className="p-6">Precio</th>
              <th className="p-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <img src={p.image_url} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                </td>
                <td className="p-6 font-bold text-white">{p.name}</td>
                <td className="p-6 text-white/40">{p.categories?.name}</td>
                <td className="p-6 font-mono text-digital-lavender font-black">${p.price}</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(p)} className="p-2.5 bg-white/5 rounded-lg text-white/60 hover:text-white"><FiEdit2 size={14}/></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-red-500/5 rounded-lg text-red-400/50 hover:text-red-400"><FiTrash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE PRODUCTO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.form 
              onSubmit={handleSave}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#161b27] rounded-[2.5rem] border border-white/10 shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase italic text-white">
                  {formData.id ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white"><FiX size={24}/></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-2">Nombre</label>
                  <input 
                    type="text" required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender transition-all"
                  />
                </div>

                {/* Precio */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-2">Precio ($)</label>
                  <input 
                    type="number" step="0.01" required 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender transition-all"
                  />
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-2">Categoría</label>
                  <select 
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender appearance-none"
                  >
                    {categories.map(c => <option key={c.id} value={c.id} className="bg-[#161b27]">{c.name}</option>)}
                  </select>
                </div>

                {/* Tipo de Producto */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-2">Tipo de Recurso</label>
                  <select 
                    value={formData.type_id}
                    onChange={(e) => setFormData({...formData, type_id: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender appearance-none"
                  >
                    {types.map(t => <option key={t.id} value={t.id} className="bg-[#161b27]">{t.name}</option>)}
                  </select>
                </div>

                {/* URL de Imagen */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-2">URL de la Imagen (PNG/JPG)</label>
                  <input 
                    type="text" required 
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.png"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender transition-all"
                  />
                </div>
                {/* Descripción */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-2">Descripción</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender transition-all resize-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={saving}
                className="w-full mt-10 bg-digital-lavender text-panda-black font-black py-5 rounded-3xl shadow-xl shadow-digital-lavender/10 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? <FiLoader className="animate-spin" /> : <FiCheck />}
                {formData.id ? 'Actualizar Producto' : 'Publicar Producto'}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}