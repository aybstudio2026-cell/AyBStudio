import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FiMessageSquare, FiClock, FiCheckCircle, 
  FiAlertCircle, FiUser, FiMail, FiTrash2 
} from 'react-icons/fi';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    setLoading(true);
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setTickets(data);
    setLoading(false);
  }

  // Abre el gestor de correo predeterminado con los datos del ticket
  const handleEmailReply = (ticket) => {
    const subject = encodeURIComponent(`Re: ${ticket.subject} - Soporte A&B Studio`);
    const body = encodeURIComponent(`Hola ${ticket.full_name},\n\nHemos recibido tu consulta: "${ticket.message}"\n\n[Escribe tu respuesta aquí]\n\nSaludos,\nEquipo de A&B Studio`);
    
    window.location.href = `mailto:${ticket.email}?subject=${subject}&body=${body}`;
  };

  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
  }

  async function deleteTicket(id) {
    if (!confirm('¿Estás seguro de eliminar este ticket?')) return;
    const { error } = await supabase.from('support_tickets').delete().eq('id', id);
    if (!error) setTickets(tickets.filter(t => t.id !== id));
  }

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-studio-text-title uppercase tracking-tighter italic">
            Gestión de <span className="text-studio-primary">Soporte</span>
          </h1>
          <p className="text-xs font-bold text-studio-secondary/60 uppercase tracking-widest mt-1">
            Responde vía Email y gestiona los estados
          </p>
        </div>

        <div className="flex bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
          {['all', 'open', 'resolved'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === s ? 'bg-studio-primary text-white shadow-md' : 'text-studio-secondary hover:text-studio-text-title'
              }`}
            >
              {s === 'all' ? 'Todos' : s === 'open' ? 'Abiertos' : 'Resueltos'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-studio-secondary uppercase tracking-[0.2em]">Usuario</th>
                <th className="px-8 py-5 text-[10px] font-black text-studio-secondary uppercase tracking-[0.2em]">Consulta</th>
                <th className="px-8 py-5 text-[10px] font-black text-studio-secondary uppercase tracking-[0.2em]">Fecha</th>
                <th className="px-8 py-5 text-[10px] font-black text-studio-secondary uppercase tracking-[0.2em]">Estado</th>
                <th className="px-8 py-5 text-[10px] font-black text-studio-secondary uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="p-20 text-center text-xs font-bold text-studio-secondary animate-pulse">Cargando tickets...</td></tr>
              ) : filteredTickets.length === 0 ? (
                <tr><td colSpan="5" className="p-20 text-center text-xs font-bold text-studio-secondary opacity-30 uppercase tracking-widest">Sin consultas registradas</td></tr>
              ) : filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-studio-bg/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-studio-primary/10 text-studio-primary rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                        {ticket.full_name[0]}
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-bold text-studio-text-title">{ticket.full_name}</span>
                        <span className="text-[10px] font-medium text-studio-secondary">{ticket.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="max-w-xs leading-tight">
                      <p className="text-xs font-black text-studio-text-title uppercase tracking-tight mb-1">{ticket.subject}</p>
                      <p className="text-[11px] text-studio-secondary line-clamp-1 italic">"{ticket.message}"</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-bold text-studio-secondary">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      ticket.status === 'open' 
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {ticket.status === 'open' ? 'Abierto' : 'Resuelto'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Botón de Respuesta por Email */}
                      <button 
                        onClick={() => handleEmailReply(ticket)}
                        className="flex items-center gap-2 bg-studio-primary text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:brightness-110 shadow-md shadow-studio-primary/20 transition-all active:scale-95"
                        title="Responder vía Email"
                      >
                        <FiMail size={14} /> Responder
                      </button>

                      <button 
                        onClick={() => updateStatus(ticket.id, ticket.status === 'open' ? 'resolved' : 'open')}
                        className={`p-2 rounded-lg transition-all ${ticket.status === 'open' ? 'bg-gray-100 text-gray-400 hover:text-green-600' : 'bg-green-500 text-white shadow-lg shadow-green-500/20'}`}
                        title={ticket.status === 'open' ? 'Marcar como resuelto' : 'Reabrir ticket'}
                      >
                        <FiCheckCircle size={16} />
                      </button>
                      <button 
                        onClick={() => deleteTicket(ticket.id)}
                        className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
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
      </div>
    </div>
  );
}