import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiTrendingDown, FiStar } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0, users: 0, orders: 0, revenue: 0, growth: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      // 1. Consultas básicas
      const [
        { count: productsCount },
        { count: usersCount },
        { data: allOrders },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select(`
          total_amount, 
          status, 
          created_at,
          order_items (
            quantity,
            products ( name, image_url )
          )
        `),
      ]);

      const completedOrders = allOrders?.filter(o => o.status === 'completed') || [];
      const revenue = completedOrders.reduce((acc, o) => acc + Number(o.total_amount), 0);

      // 2. Lógica de Crecimiento Mensual
      const now = new Date();
      const currentMonth = now.getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

      const revenueThisMonth = completedOrders
        .filter(o => new Date(o.created_at).getMonth() === currentMonth)
        .reduce((acc, o) => acc + Number(o.total_amount), 0);

      const revenueLastMonth = completedOrders
        .filter(o => new Date(o.created_at).getMonth() === lastMonth)
        .reduce((acc, o) => acc + Number(o.total_amount), 0);

      const growthCalc = revenueLastMonth > 0 
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
        : 100;

      // 3. Lógica de Top Productos (Más Vendidos)
      const productMap = {};
      completedOrders.forEach(order => {
        order.order_items?.forEach(item => {
          const name = item.products?.name;
          if (name) {
            productMap[name] = {
              name,
              image: item.products.image_url,
              sales: (productMap[name]?.sales || 0) + item.quantity
            };
          }
        });
      });

      const topList = Object.values(productMap)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 3);

      // 4. Actualizar Estados
      setStats({
        products: productsCount || 0,
        users: usersCount || 0,
        orders: completedOrders.length,
        revenue: revenue.toFixed(2),
        growth: growthCalc.toFixed(1)
      });

      setTopProducts(topList);

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
    { 
      label: 'Ingresos', 
      value: `$${stats.revenue}`, 
      icon: FiDollarSign, 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-400/10',
      trend: stats.growth 
    },
  ];

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-digital-lavender border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Analytics Pro</h1>
          <p className="text-white/30 text-sm font-medium mt-1">Rendimiento comercial de A&B Studio</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-[#161b27] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
              {stat.trend && (
                <span className={`text-[10px] font-black flex items-center gap-1 ${Number(stat.trend) >= 0 ? 'text-mint-green' : 'text-red-400'}`}>
                  {Number(stat.trend) >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                  {Math.abs(stat.trend)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Órdenes recientes */}
        <div className="lg:col-span-2 bg-[#161b27] rounded-[2.5rem] border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-black text-xs uppercase tracking-widest text-white/60">Últimas Transacciones</h3>
            <FiShoppingBag className="text-white/10" size={20} />
          </div>
          <div className="divide-y divide-white/5">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-digital-lavender shadow-[0_0_10px_rgba(180,160,255,0.5)]" />
                  <div>
                    <p className="font-bold text-sm text-white font-mono tracking-tighter uppercase">#{order.id.slice(0, 8)}</p>
                    <p className="text-[10px] text-white/20 uppercase font-black">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${order.status === 'completed' ? 'bg-mint-green/10 text-mint-green' : 'bg-yellow-400/10 text-yellow-400'}`}>
                    {order.status}
                  </span>
                  <p className="font-black text-xl text-white tracking-tighter">${order.total_amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Productos */}
        <div className="bg-[#161b27] rounded-[2.5rem] border border-white/5 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xs uppercase tracking-widest text-white/60">Top Ventas</h3>
            <FiStar className="text-yellow-400" size={20} />
          </div>
          <div className="space-y-6">
            {topProducts.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="relative">
                  <img src={item.image} className="w-14 h-14 rounded-2xl object-cover border border-white/5 group-hover:border-digital-lavender/50 transition-colors" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-panda-black border border-white/10 rounded-full flex items-center justify-center text-[10px] font-black text-digital-lavender">
                    {idx + 1}
                  </div>
                </div>
                <div className="grow">
                  <p className="text-xs font-black text-white uppercase truncate w-32">{item.name}</p>
                  <p className="text-[10px] font-bold text-white/20 uppercase">{item.sales} ventas totales</p>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-mint-green animate-pulse" />
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-center py-10 text-white/10 font-bold italic uppercase text-xs">Sin datos de ventas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}