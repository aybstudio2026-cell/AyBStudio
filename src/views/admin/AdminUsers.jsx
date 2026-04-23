import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiUser, FiAlertCircle, FiCheckCircle, FiSlash, FiMinusCircle } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }

  async function updateStatus(userId, newStatus) {
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId);
    
    if (!error) fetchUsers();
  }

  // Configuración de colores por estado
  const statusStyles = {
    ok: 'bg-mint-green/10 text-mint-green border-mint-green/20',
    alerta: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    suspendido: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    bloqueado: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter text-white">Gestión de Usuarios</h1>
      
      <div className="bg-[#161b27] rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40 font-black">
            <tr>
              <th className="p-6">Perfil</th>
              <th className="p-6">Rol</th>
              <th className="p-6">Estado</th>
              <th className="p-6">Acción de Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/[0.02]">
                <td className="p-6 flex items-center gap-4">
                   {/* Avatar UI ... */}
                   <div>
                    <p className="font-bold text-white">{u.full_name || u.username}</p>
                    <p className="text-[10px] text-white/20">@{u.username}</p>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-[10px] font-black uppercase text-digital-lavender">{u.role}</span>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${statusStyles[u.status || 'ok']}`}>
                    {u.status || 'ok'}
                  </span>
                </td>
                <td className="p-6">
                  <select 
                    value={u.status || 'ok'}
                    onChange={(e) => updateStatus(u.id, e.target.value)}
                    className="bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase rounded-lg px-2 py-1 outline-none focus:border-digital-lavender cursor-pointer transition-all hover:bg-white/10"
                  >
                    {/* Agregamos clases de fondo oscuro y texto blanco a cada opción */}
                    <option value="ok" className="bg-[#161b27] text-white">Marcar OK</option>
                    <option value="alerta" className="bg-[#161b27] text-white">Poner Alerta</option>
                    <option value="suspendido" className="bg-[#161b27] text-white">Suspender</option>
                    <option value="bloqueado" className="bg-[#161b27] text-white">Bloquear</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}