import { useState, useEffect, useRef} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiUser, FiMail, FiCalendar, FiCheck, FiEdit3, 
  FiCamera, FiShoppingBag, FiHeart, FiDownload, FiLock, FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import UserSidebar from '../components/layout/UserSidebar';

export default function EditProfileView() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    birthday: '',
    avatar_url: ''
  });

  // Configuración de los links del Sidebar
  const sidebarLinks = [
    { to: "/cuenta", label: "Mi Cuenta", icon: FiUser },
    { to: "/pedidos", label: "Mis Pedidos", icon: FiShoppingBag },
    { to: "/favoritos", label: "Favoritos", icon: FiHeart },
    { to: "/descargas", label: "Descargas", icon: FiDownload },
    { to: "/seguridad", label: "Seguridad", icon: FiLock },
  ];

  // Lógica de Autenticación y Carga de Datos
  useEffect(() => {
    async function getInitialData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/'); 
        return;
      }
      setUser(session.user);
      
      const { data } = await supabase
        .from('profiles')
        .select('username, full_name, birthday, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    }
    getInitialData();
  }, [navigate]);

  // Función para subir la imagen de perfil
  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}.${fileExt}`;
      const { data: oldFiles } = await supabase.storage
        .from('avatars')
        .list('', { search: user.id });

      if (oldFiles && oldFiles.length > 0) {
        const filesToRemove = oldFiles.map((f) => f.name);
        await supabase.storage.from('avatars').remove(filesToRemove);
      }

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const finalUrl = `${publicUrl}?t=${new Date().getTime()}`;

      setProfile({ ...profile, avatar_url: finalUrl });
            
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  // Función para guardar cambios
  async function handleUpdate(e) {
    e.preventDefault();
    setUpdating(true);
    
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
      updated_at: new Date(),
    });

    if (error) {
      alert("Error al actualizar");
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
    setUpdating(false);
  }


  return (
    <div className="pt-32 pb-20 min-h-screen bg-studio-bg flex justify-center items-start">
      <div className="w-full max-w-7xl px-6 md:px-10 flex flex-col md:flex-row gap-10 items-start">
        
        {/* --- SIDEBAR--- */}
        <UserSidebar />

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main className="flex-1 bg-studio-surface rounded-xl p-8 md:p-10 border border-studio-border shadow-flat">
          
          <div className="mb-10 border-b border-studio-border pb-8">
            <h1 className="text-2xl font-bold text-studio-text-title uppercase tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-studio-primary/10 rounded-lg text-studio-primary">
                <FiEdit3 size={20} />
              </div>
              Configuración de Perfil
            </h1>
            <p className="text-[11px] font-bold text-studio-text-body uppercase tracking-widest mt-3 ml-12">
              Gestiona tus datos personales y avatar
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-10">

            {/* Sección Avatar */}
            <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-studio-border">
              <div className="relative group">
                <div className="w-32 h-32 rounded-xl bg-studio-bg border-2 border-studio-border flex items-center justify-center text-studio-primary text-4xl font-black overflow-hidden transition-all group-hover:border-studio-primary/50">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <div className="uppercase">{profile.full_name?.[0] || '?'}</div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-studio-text-title/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={uploadAvatar} accept="image/*" className="hidden" />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-2 -right-2 bg-studio-primary p-2.5 rounded-lg shadow-sm text-white hover:opacity-90 transition-all"
                >
                  <FiCamera size={16} />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-sm font-bold text-studio-text-title">Foto de Perfil</h4>
                <p className="text-xs text-studio-text-body mt-1">Recomendado: Cuadrado, PNG o JPG (Máx 2MB).</p>
              </div>
            </div>
            
            {/* Grid de Formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-studio-text-body uppercase tracking-[0.15em] ml-1">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-secondary" />
                  <input 
                    type="text" required
                    value={profile.username || ''}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-studio-bg border border-transparent rounded-lg outline-none focus:border-studio-primary focus:bg-studio-surface transition-all font-bold text-sm text-studio-text-title"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-studio-text-body uppercase tracking-[0.15em] ml-1">Nombre Completo</label>
                <input 
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  className="w-full px-4 py-3 bg-studio-bg border border-transparent rounded-lg outline-none focus:border-studio-primary focus:bg-studio-surface transition-all font-bold text-sm text-studio-text-title"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-studio-text-body uppercase tracking-[0.15em] ml-1">Email (Protegido)</label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-secondary/40" />
                  <input 
                    type="email" readOnly value={user?.email || ''}
                    className="w-full pl-12 pr-4 py-3 bg-studio-bg/50 border border-studio-border rounded-lg font-bold text-sm text-studio-text-body/60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-studio-text-body uppercase tracking-[0.15em] ml-1">Cumpleaños</label>
                <div className="relative">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-secondary" />
                  <input 
                    type="date"
                    value={profile.birthday || ''}
                    onChange={(e) => setProfile({...profile, birthday: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-studio-bg border border-transparent rounded-lg outline-none focus:border-studio-primary focus:bg-studio-surface transition-all font-bold text-sm text-studio-text-title"
                  />
                </div>
              </div>
            </div>

            {/* Footer de formulario */}
            <div className="pt-10 flex items-center justify-end border-t border-studio-border">
              <button 
                type="submit" disabled={updating}
                className="w-full md:w-auto px-10 bg-studio-primary text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {updating ? 'Guardando...' : <><FiCheck size={18} /> Guardar Cambios</>}
              </button>
            </div>
          </form>
        </main>
      </div>
      
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            className="fixed top-24 right-6 z-[200] w-full max-w-[300px] bg-white rounded-xl shadow-2xl border border-gray-100 flex items-center overflow-hidden"
          >
            <div className="w-1.5 h-16 bg-studio-primary shrink-0" />

            <div className="flex items-center gap-3 p-4 flex-1">
              <div className="bg-studio-primary/10 p-2 rounded-full shrink-0 text-studio-primary">
                <FiCheck size={18} />
              </div>

              <div className="flex-1 pr-4">
                <p className="font-bold text-studio-text-title text-sm leading-tight">
                  Cambios guardados
                </p>
                <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-wider mt-0.5">
                  Perfil actualizado
                </p>
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