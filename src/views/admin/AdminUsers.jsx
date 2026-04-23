import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiUser, FiShield, FiMail, FiGlobe, FiAlertCircle } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    // Nota: Solo traemos los campos que existen en tu tabla profiles
    const { data, error: supabaseError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, website, role, updated_at')
      .order('updated_at', { ascending: false });

    if (supabaseError) {
      console.error("Error fetching users:", supabaseError);
      setError(supabaseError.message);
    } else {
      setUsers(data);
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-digital-lavender border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-red-400 flex items-center gap-2">
      <FiAlertCircle /> Error: {error}. Revisa las políticas RLS en Supabase.
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter">Usuarios</h1>
        <p className="text-white/30 text-sm font-medium mt-1">Gestión de perfiles y roles del sistema</p>
      </div>

      <div className="bg-[#161b27] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40">
            <tr>
              <th className="p-6">Usuario</th>
              <th className="p-6">Sitio Web</th>
              <th className="p-6">Rol</th>
              <th className="p-6">Última Actividad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6 flex items-center gap-4">
                  <div className="w-10 h-10 bg-digital-lavender/20 rounded-full flex items-center justify-center overflow-hidden border border-white/5">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <FiUser className="text-digital-lavender" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white">{u.full_name || 'Sin nombre'}</p>
                    <p className="text-[10px] font-mono text-white/30">@{u.username || 'n/a'}</p>
                  </div>
                </td>
                <td className="p-6">
                  {u.website ? (
                    <a href={u.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                      <FiGlobe size={12} /> Link
                    </a>
                  ) : (
                    <span className="text-white/10">-</span>
                  )}
                </td>
                <td className="p-6">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${
                    u.role === 'admin' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-blue-400/10 text-blue-400'
                  }`}>
                    {u.role || 'user'}
                  </span>
                </td>
                <td className="p-6 text-white/30 text-xs">
                  {u.updated_at ? new Date(u.updated_at).toLocaleDateString() : 'Nunca'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}