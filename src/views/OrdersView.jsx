import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiPackage, FiCalendar, FiExternalLink } from 'react-icons/fi';

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, total_amount, created_at, status,
          order_items (
            quantity, price_at_purchase,
            products ( name, image_url )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="p-40 text-center font-black animate-pulse text-digital-lavender">CONSULTANDO PEDIDOS...</div>;

  return (
    <div className="pt-32 pb-20 max-w-5xl mx-auto px-6">
      <h2 className="text-4xl font-black text-panda-black mb-12 uppercase tracking-tighter">Mis Compras</h2>
      
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] text-center border border-gray-100 italic text-panda-black/20 font-bold">
            Aún no has realizado ninguna compra en A&B Studio.
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-gray-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-digital-lavender/10 rounded-2xl flex items-center justify-center text-digital-lavender">
                    <FiPackage size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-panda-black/30 uppercase tracking-widest">ID: {order.id.slice(0,8)}</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-panda-black">
                      <FiCalendar /> {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black uppercase text-mint-green bg-mint-green/10 px-3 py-1 rounded-full mb-1 inline-block">
                    {order.status}
                  </span>
                  <p className="text-2xl font-black text-panda-black">${order.total_amount}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.order_items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-soft-snow p-3 rounded-2xl">
                    <img src={item.products.image_url} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-black text-panda-black">{item.products.name}</p>
                      <p className="text-[10px] font-bold text-digital-lavender uppercase">Licencia Digital</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}