// src/views/admin/AdminNews.jsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiLoader, FiUpload, FiImage } from 'react-icons/fi';
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
    color_gradient: 'from-purple-600 to-blue-600',
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
        color_gradient: 'from-purple-500 to-indigo-600',
        state: true
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Preview inmediato
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

    // Eliminar imagen del bucket si existe
    if (imageUrl?.includes('supabase')) {
      const fileName = imageUrl.split('/').pop();
      await supabase.storage.from('news').remove([fileName]);
    }

    await supabase.from('news').delete().eq('id', id);
    fetchNews();
  }

  if (loading) return (
    <div className="p-40 text-center animate-pulse text-digital-lavender font-black uppercase italic">
      Sincronizando Noticias...
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white italic">News & Promos</h1>
          <p className="text-white/30 text-sm font-medium">Contenido dinámico del carrusel</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-digital-lavender text-panda-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
        >
          <FiPlus size={18} /> Crear Noticia
        </button>
      </div>

      <div className="bg-[#161b27] rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40 font-black">
            <tr>
              <th className="p-6">Banner</th>
              <th className="p-6">Título / Slogan</th>
              <th className="p-6">Estado</th>
              <th className="p-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6">
                  <div className={`w-20 h-10 rounded-lg bg-gradient-to-r ${item.color_gradient} p-0.5`}>
                    <img
                      src={item.image_url}
                      className="w-full h-full object-cover rounded-md opacity-80"
                      alt=""
                    />
                  </div>
                </td>
                <td className="p-6 font-bold text-white uppercase italic">
                  {item.title}
                  <p className="text-[9px] text-digital-lavender font-black tracking-widest not-italic">
                    {item.slogan}
                  </p>
                </td>
                <td className="p-6">
                  <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${
                    item.state ? 'bg-mint-green/10 text-mint-green' : 'bg-white/5 text-white/20'
                  }`}>
                    {item.state ? 'Visible' : 'Oculto'}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openModal(item)}
                      className="p-2.5 bg-white/5 rounded-lg text-white/60 hover:text-white"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.image_url)}
                      className="p-2.5 bg-red-500/5 rounded-lg text-red-400/50 hover:text-red-400"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.form
              onSubmit={handleSave}
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-xl bg-[#161b27] rounded-[3rem] border border-white/10 shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase italic text-white">
                  {formData.id ? 'Editar Noticia' : 'Nueva Noticia'}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white">
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-5">

                {/* ZONA DE UPLOAD DE IMAGEN */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/30 ml-2">
                    Imagen del Banner
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => !uploading && fileInputRef.current.click()}
                    className={`relative w-full h-40 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                      imagePreview
                        ? 'border-digital-lavender/50'
                        : 'border-white/10 hover:border-digital-lavender/30'
                    }`}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-all flex items-center justify-center">
                          <p className="text-white font-black text-xs uppercase tracking-widest">
                            Cambiar imagen
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/20">
                        <FiImage size={32} />
                        <p className="text-xs font-black uppercase tracking-widest">
                          Click para subir imagen
                        </p>
                        <p className="text-[10px]">PNG, JPG o WebP</p>
                      </div>
                    )}

                    {/* Overlay de carga */}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3">
                        <FiLoader className="animate-spin text-digital-lavender" size={24} />
                        <p className="text-white font-black text-xs uppercase">Subiendo...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-white/30 ml-2">Título Principal</label>
                    <input
                      type="text" required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-white/30 ml-2">Slogan</label>
                    <input
                      type="text" required
                      value={formData.slogan}
                      onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/30 ml-2">Descripción</label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/30 ml-2">
                    Gradiente (clases Tailwind)
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={formData.color_gradient}
                      onChange={(e) => setFormData({ ...formData, color_gradient: e.target.value })}
                      placeholder="from-purple-600 to-blue-600"
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender"
                    />
                    {/* Preview del gradiente */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${formData.color_gradient} shrink-0`} />
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <label className="text-[10px] font-black uppercase text-white/40 grow tracking-widest">
                    ¿Mostrar en el carrusel?
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, state: !formData.state })}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      formData.state ? 'bg-mint-green' : 'bg-white/10'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      formData.state ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full mt-8 bg-digital-lavender text-panda-black font-black py-5 rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-tighter"
              >
                {saving ? <FiLoader className="animate-spin" /> : <FiCheck />}
                {formData.id ? 'Guardar Cambios' : 'Publicar Noticia'}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}