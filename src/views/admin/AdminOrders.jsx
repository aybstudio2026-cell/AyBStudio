import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiShoppingBag, FiUser, FiCalendar, FiEye } from 'react-icons/fi';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllOrders() {
      setLoading(true);
      // Consultamos a la VISTA que creamos en el SQL
      const { data, error } = await supabase
        .from('admin_orders_view') 
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setOrders(data);
      } else {
        console.error("Error cargando la vista:", error);
      }
      setLoading(false);
    }
    fetchAllOrders();
  }, []);

  if (loading) return <div className="p-40 text-center animate-pulse text-digital-lavender font-black">CARGANDO REGISTROS...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter uppercase">Gestión de Ventas</h1>
        <p className="text-white/30 text-sm">Historial consolidado de A&B Studio</p>
      </div>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-[#161b27] p-20 rounded-[2.5rem] text-center border border-white/5 italic text-white/10 font-bold uppercase">
            No hay ventas registradas
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-[#161b27] p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-digital-lavender/10 rounded-xl flex items-center justify-center border border-white/5">
                  {order.avatar_url ? (
                    <img src={order.avatar_url} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <FiUser className="text-digital-lavender" />
                  )}
                </div>
                <div>
                  <p className="font-black text-white">{order.full_name || order.username || 'Usuario'}</p>
                  <p className="text-[10px] font-mono text-white/20 uppercase">Dodo ID: {order.dodo_payment_id || 'n/a'}</p>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="text-right">
                  <p className="text-2xl font-black text-white">${order.total_amount}</p>
                  <p className="text-[10px] font-bold text-digital-lavender uppercase tracking-widest">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${
                    order.status === 'completed' ? 'bg-mint-green/10 text-mint-green' : 'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                  <button className="text-white/20 hover:text-white transition-colors">
                    <FiEye />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}