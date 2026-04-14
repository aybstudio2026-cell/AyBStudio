import { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiCheck, FiArrowLeft, FiEdit3, FiCamera } from 'react-icons/fi';
import { supabase } from '../supabaseClient';

export default function EditProfileView() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    birthday: '',
    avatar_url: ''
  });

  // FUNCIÓN PARA SUBIR LA FOTO
  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Subir imagen al bucket 'avatars'
      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Obtener la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Actualizar estado local (para ver la preview)
      setProfile({ ...profile, avatar_url: publicUrl });
            
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

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

  async function handleUpdate(e) {
    e.preventDefault();
    setUpdating(true);
    
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
      updated_at: new Date(),
    });
    setUpdating(false);
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-digital-lavender tracking-widest animate-pulse">
      CARGANDO SISTEMA...
    </div>
  );

  return (
    <div className="pt-32 pb-20 min-h-screen bg-soft-snow flex justify-center items-start">
      <div className="w-full max-w-7xl px-6">
    
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-panda-black/5 border border-white">
          <div className="mb-12">
            <h1 className="text-3xl font-black text-panda-black uppercase tracking-tighter flex items-center gap-3">
              <div className="p-3 bg-digital-lavender/10 rounded-2xl">
                <FiEdit3 className="text-digital-lavender" size={24} />
              </div>
              Mis Datos
            </h1>
            <p className="text-[10px] font-bold text-panda-black/30 uppercase tracking-[0.2em] mt-2 ml-16">
              Gestiona tu identidad de comprador en A&B Studio
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-8">

            <div className="flex flex-col items-center gap-6 pb-12 border-b border-gray-50">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-digital-lavender flex items-center justify-center text-white text-5xl font-black shadow-inner overflow-hidden border-4 border-white transition-transform group-hover:scale-105">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    profile.full_name?.[0] || '?'
                  )}
                  
                  {/* Overlay de carga */}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Input de archivo oculto */}
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={uploadAvatar}
                  accept="image/*"
                  className="hidden"
                />

                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-2 -right-2 bg-panda-black p-3 rounded-2xl shadow-lg text-white hover:bg-digital-lavender transition-all"
                >
                  <FiCamera size={18} />
                </button>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-panda-black/20 uppercase tracking-[0.3em]">Foto de Perfil</p>
                <p className="text-xs text-panda-black/40 mt-1 font-medium">PNG, JPG o GIF. Max 2MB.</p>
              </div>
            </div>
            
            {/* Grid de dos columnas para campos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Campo: Nombre de Usuario */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-panda-black/40 uppercase tracking-widest ml-2">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-digital-lavender" />
                  <input 
                    type="text" required placeholder="pandin_01"
                    value={profile.username || ''}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className="w-full pl-14 pr-6 py-4 bg-soft-snow rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-digital-lavender/20 transition-all font-bold text-sm shadow-sm"
                  />
                </div>
              </div>

              {/* Campo: Nombre Completo */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-panda-black/40 uppercase tracking-widest ml-2">Nombre Real</label>
                <input 
                  type="text" placeholder="Tu nombre completo"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  className="w-full px-6 py-4 bg-soft-snow rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-digital-lavender/20 transition-all font-bold text-sm shadow-sm"
                />
              </div>

              {/* Campo: Email (Solo lectura) */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-panda-black/40 uppercase tracking-widest ml-2">Correo de contacto</label>
                <div className="relative opacity-60">
                  <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" readOnly value={user?.email || ''}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Campo: Fecha de Nacimiento */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-panda-black/40 uppercase tracking-widest ml-2">Fecha de Nacimiento</label>
                <div className="relative">
                  <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-digital-lavender" />
                  <input 
                    type="date"
                    value={profile.birthday || ''}
                    onChange={(e) => setProfile({...profile, birthday: e.target.value})}
                    className="w-full pl-14 pr-6 py-4 bg-soft-snow rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-digital-lavender/20 transition-all font-bold text-sm shadow-sm"
                  />
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
              <p></p>
              <button 
                type="submit" disabled={updating}
                className="w-full md:w-auto px-12 bg-panda-black text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-digital-lavender transition-all shadow-xl shadow-panda-black/10 active:scale-[0.98] disabled:opacity-50"
              >
                {updating ? 'Sincronizando...' : <><FiCheck size={20} /> Guardar Cambios</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}