// src/views/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0, users: 0, orders: 0, revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: products },
        { count: users },
        { data: orders },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount, status, created_at, user_id'),
      ]);

      const completedOrders = orders?.filter(o => o.status === 'completed') || [];
      const revenue = completedOrders.reduce((acc, o) => acc + Number(o.total_amount), 0);

      setStats({
        products: products || 0,
        users: users || 0,
        orders: completedOrders.length,
        revenue: revenue.toFixed(2),
      });

      // Últimas 5 órdenes
      const { data: recent } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentOrders(recent || []);
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Productos', value: stats.products, icon: FiPackage, color: 'text-digital-lavender', bg: 'bg-digital-lavender/10' },
    { label: 'Usuarios', value: stats.users, icon: FiUsers, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Órdenes', value: stats.orders, icon: FiShoppingBag, color: 'text-mint-green', bg: 'bg-mint-green/10' },
    { label: 'Ingresos', value: `$${stats.revenue}`, icon: FiDollarSign, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-digital-lavender border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter">Dashboard</h1>
        <p className="text-white/30 text-sm font-medium mt-1">Resumen general de A&B Studio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-[#161b27] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/40 text-xs font-black uppercase tracking-widest">{stat.label}</p>
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Órdenes recientes */}
      <div className="bg-[#161b27] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="font-black text-sm uppercase tracking-widest text-white/60">
            Órdenes Recientes
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-white/80 font-mono">
                  #{order.id.slice(0, 8)}
                </p>
                <p className="text-[10px] text-white/30 mt-1">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                  order.status === 'completed'
                    ? 'bg-mint-green/10 text-mint-green'
                    : 'bg-yellow-400/10 text-yellow-400'
                }`}>
                  {order.status}
                </span>
                <p className="font-black text-white">${order.total_amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}