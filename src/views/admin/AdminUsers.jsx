// src/views/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FiUser, FiSearch, FiShield, FiMoreHorizontal, 
  FiCheckCircle, FiAlertCircle, FiSlash, FiMinusCircle 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => { fetchUsersPage(1, searchTerm); }, []);

  useEffect(() => {
    fetchUsersPage(page, searchTerm);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchUsersPage(1, searchTerm);
  }, [searchTerm]);

  async function fetchUsersPage(nextPage, term) {
    setLoading(true);
    const from = (nextPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const baseQuery = supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });

    const countQuery = supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    if (term) {
      const safe = term.replaceAll(',', ' ');
      const filter = `username.ilike.%${safe}%,full_name.ilike.%${safe}%,email.ilike.%${safe}%`;
      baseQuery.or(filter);
      countQuery.or(filter);
    }

    const [pageResult, countResult] = await Promise.all([
      baseQuery.range(from, to),
      countQuery
    ]);

    if (pageResult.data) setUsers(pageResult.data);
    setTotalCount(countResult.count || 0);
    setLoading(false);
  }

  async function updateStatus(userId, newStatus) {
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId);
    
    if (!error) fetchUsersPage(page, searchTerm);
  }

  // Estilos de estado gélidos y profesionales
  const statusStyles = {
    ok: 'bg-studio-primary/10 text-studio-primary border-studio-primary/20',
    alerta: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    suspendido: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    bloqueado: 'bg-red-500/10 text-red-600 border-red-500/20'
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="p-8 space-y-8 bg-studio-bg min-h-screen text-studio-text-title">
      
      {/* CABECERA EDITORIAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-studio-border pb-8">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-studio-primary uppercase tracking-[0.4em]">User Access Management</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            Gestión de <span className="text-studio-primary">Usuarios</span>
          </h1>
        </div>

        {/* BUSCADOR */}
        <div className="relative w-full md:w-80 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-secondary/40 group-focus-within:text-studio-primary transition-colors" />
          <input 
            type="text"
            placeholder="BUSCAR POR NOMBRE O EMAIL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-studio-border pl-12 pr-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-studio-primary shadow-sm transition-all"
          />
        </div>
      </div>

      {/* CONTENEDOR DE TABLA */}
      <div className="bg-white rounded-[2.5rem] border border-studio-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-studio-border">
              <tr className="text-[9px] uppercase tracking-[0.3em] text-studio-secondary font-black opacity-50">
                <th className="p-8">Perfil / Identidad</th>
                <th className="p-8">Rol de Sistema</th>
                <th className="p-8">Estado Actual</th>
                <th className="p-8 text-right">Modificar Acceso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-border">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="p-8 h-20 bg-gray-50/30" />
                  </tr>
                ))
              ) : (
                users.map(u => (
                  <motion.tr 
                    layout
                    key={u.id} 
                    className="hover:bg-studio-bg transition-colors group"
                  >
                    <td className="p-8 flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-studio-bg border border-studio-border flex items-center justify-center font-black text-xs text-studio-primary shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                          <FiUser size={18} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-sm text-studio-text-title uppercase tracking-tight truncate">
                          {u.full_name || u.username}
                        </p>
                        <p className="text-[10px] text-studio-secondary font-bold uppercase opacity-40">@{u.username}</p>
                      </div>
                    </td>

                    <td className="p-8">
                      <div className="flex items-center gap-2">
                        <FiShield className={u.role === 'admin' ? 'text-studio-primary' : 'text-studio-secondary/30'} size={14} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'text-studio-primary' : 'text-studio-secondary/60'}`}>
                          {u.role}
                        </span>
                      </div>
                    </td>

                    <td className="p-8">
                      <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${statusStyles[u.status || 'ok']}`}>
                        {u.status || 'ok'}
                      </span>
                    </td>

                    <td className="p-8 text-right">
                      <div className="relative inline-block group/select">
                        <select 
                          value={u.status || 'ok'}
                          onChange={(e) => updateStatus(u.id, e.target.value)}
                          className="appearance-none bg-white border border-studio-border text-studio-text-title text-[9px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 pr-10 outline-none focus:border-studio-primary cursor-pointer transition-all hover:bg-studio-bg shadow-sm"
                        >
                          <option value="ok">Status: OK</option>
                          <option value="alerta">Status: Alerta</option>
                          <option value="suspendido">Status: Suspendido</option>
                          <option value="bloqueado">Status: Bloqueado</option>
                        </select>
                        <FiMoreHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-studio-primary pointer-events-none" />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="p-20 text-center space-y-4">
            <FiSearch size={40} className="mx-auto text-studio-secondary/10" />
            <p className="text-[10px] font-black text-studio-secondary uppercase tracking-[0.4em] opacity-30">
              No se encontraron usuarios con ese criterio
            </p>
          </div>
        )}
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
    </div>
  );
}