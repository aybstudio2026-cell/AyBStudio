// src/views/admin/AdminNews.jsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, 
  FiLoader, FiImage, FiZap, FiEye, FiEyeOff, FiArrowUpRight 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    slogan: '',
    description: '',
    image_url: '',
    color_gradient: 'from-studio-primary to-blue-500',
    state: true
  });

  useEffect(() => { fetchNews(); }, []);

  async function fetchNews() {
    setLoading(true);
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setNews(data);
    setLoading(false);
  }

  const openModal = (item = null) => {
    if (item) {
      setFormData({ ...item });
      setImagePreview(item.image_url);
    } else {
      setFormData({
        title: '',
        slogan: '',
        description: '',
        image_url: '',
        color_gradient: 'from-studio-primary to-blue-500',
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
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `news-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('news')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('news')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      alert('Error al subir imagen: ' + error.message);
      setImagePreview(null);
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
    const { error } = await supabase.from('news').upsert(formData);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      setIsModalOpen(false);
      fetchNews();
    }
    setSaving(false);
  }

  async function handleDelete(id, imageUrl) {
    if (!window.confirm('¿Eliminar esta noticia?')) return;
    if (imageUrl?.includes('supabase')) {
      const fileName = imageUrl.split('/').pop();
      await supabase.storage.from('news').remove([fileName]);
    }
    await supabase.from('news').delete().eq('id', id);
    fetchNews();
  }

  if (loading) return (
    <div className="p-40 text-center bg-studio-bg min-h-screen flex flex-col items-center justify-center gap-4">
      <FiLoader className="animate-spin text-studio-primary" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-studio-secondary animate-pulse italic">Sincronizando Noticias...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-studio-bg min-h-screen text-studio-text-title font-sans">
      
      {/* HEADER EDITORIAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-studio-border pb-8">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-studio-primary uppercase tracking-[0.4em]">Content Management</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            News <span className="text-studio-primary">& Promos</span>
          </h1>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-studio-text-title text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-studio-primary transition-all shadow-xl shadow-studio-text-title/10 active:scale-95"
        >
          <FiPlus size={18} /> Crear Noticia
        </button>
      </div>

      {/* TABLA GÉLIDA */}
      <div className="bg-white rounded-[2.5rem] border border-studio-border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-studio-border">
            <tr className="text-[9px] uppercase tracking-[0.3em] text-studio-secondary font-black opacity-50">
              <th className="p-8">Banner Preview</th>
              <th className="p-8">Identidad Noticia</th>
              <th className="p-8">Visibilidad</th>
              <th className="p-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-studio-border">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-studio-bg transition-colors group">
                <td className="p-8">
                  <div className={`w-28 h-14 rounded-xl bg-gradient-to-r ${item.color_gradient} p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-500`}>
                    <img
                      src={item.image_url}
                      className="w-full h-full object-cover rounded-[10px] opacity-90"
                      alt=""
                    />
                  </div>
                </td>
                <td className="p-8">
                  <p className="font-black text-sm text-studio-text-title uppercase tracking-tight italic">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <FiZap size={10} className="text-studio-primary" />
                    <p className="text-[9px] text-studio-secondary font-black uppercase tracking-[0.2em] opacity-40">
                      {item.slogan}
                    </p>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-2">
                    {item.state ? <FiEye className="text-studio-primary" size={14} /> : <FiEyeOff className="text-studio-secondary/30" size={14} />}
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      item.state ? 'text-studio-primary' : 'text-studio-secondary/30'
                    }`}>
                      {item.state ? 'Online' : 'Archive'}
                    </span>
                  </div>
                </td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(item)}
                      className="p-3 bg-studio-bg rounded-xl text-studio-secondary hover:text-studio-primary hover:bg-studio-primary/10 transition-all shadow-sm"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.image_url)}
                      className="p-3 bg-red-50 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-100 transition-all shadow-sm"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDITORIAL */}
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
              className="relative w-full max-w-2xl bg-white rounded-[3rem] border border-studio-border shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-studio-primary uppercase tracking-[0.4em]">Content Entry</p>
                  <h2 className="text-3xl font-black uppercase italic text-studio-text-title tracking-tighter">
                    {formData.id ? 'Editar Noticia' : 'Nueva Noticia'}
                  </h2>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-studio-bg rounded-2xl text-studio-secondary/40 hover:text-studio-primary transition-all">
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* UPLOAD AREA */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1 opacity-60">
                    Graphic Resource (Banner)
                  </label>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <div
                    onClick={() => !uploading && fileInputRef.current.click()}
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

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1 opacity-60">Headline</label>
                    <input
                      type="text" required value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-studio-bg border border-studio-border rounded-2xl p-4 text-xs font-bold text-studio-text-title outline-none focus:border-studio-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1 opacity-60">Sub-Headline (Slogan)</label>
                    <input
                      type="text" required value={formData.slogan}
                      onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                      className="w-full bg-studio-bg border border-studio-border rounded-2xl p-4 text-xs font-bold text-studio-text-title outline-none focus:border-studio-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-studio-secondary tracking-widest ml-1 opacity-60">Visual Accent (Tailwind Gradient)</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text" value={formData.color_gradient}
                      onChange={(e) => setFormData({ ...formData, color_gradient: e.target.value })}
                      className="flex-1 bg-studio-bg border border-studio-border rounded-2xl p-4 text-[10px] font-mono text-studio-text-title outline-none focus:border-studio-primary transition-all"
                    />
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${formData.color_gradient} shadow-sm shrink-0 border-2 border-white shadow-inner`} />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-studio-bg p-5 rounded-2xl border border-studio-border">
                  <div className="flex items-center gap-3">
                    <FiEye className="text-studio-primary" size={18} />
                    <p className="text-[10px] font-black uppercase text-studio-text-title tracking-widest">Active Status</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, state: !formData.state })}
                    className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                      formData.state ? 'bg-studio-primary shadow-lg shadow-studio-primary/20' : 'bg-studio-secondary/10'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                      formData.state ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full mt-10 bg-studio-text-title text-white font-black py-6 rounded-[1.5rem] shadow-xl shadow-studio-text-title/10 flex items-center justify-center gap-3 hover:bg-studio-primary transition-all disabled:opacity-50 uppercase text-[11px] tracking-[0.3em]"
              >
                {saving ? <FiLoader className="animate-spin" /> : <FiCheck size={18} />}
                {formData.id ? 'Save Changes' : 'Broadcast News'}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}