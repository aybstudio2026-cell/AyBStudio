// src/views/admin/AdminDashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FiDollarSign, FiPackage, FiZap, FiTarget, 
  FiCalendar, FiArrowUpRight, FiBarChart2, FiAward, FiShoppingBag, FiChevronDown 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [data, setData] = useState({ products: [], orders: [], loading: true });
  const [viewRange, setViewRange] = useState('7days'); // '7days' o 'monthly'
  
  // Filtros de fecha (Carga la fecha actual por defecto)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const years = [2024, 2025, 2026];

  useEffect(() => {
    async function fetchData() {
      const [p, o] = await Promise.all([
        supabase.from('products').select('*, categories(name)'),
        supabase.from('orders').select('*, order_items(quantity, products(name, image_url))')
          .order('created_at', { ascending: false })
      ]);
      setData({ products: p.data || [], orders: o.data || [], loading: false });
    }
    fetchData();
  }, []);

  const analytics = useMemo(() => {
    const completed = data.orders.filter(o => o.status === 'completed');
    const now = new Date();

    // 1. CÁLCULO DE INGRESOS (DIARIO, SEMANAL, MENSUAL)
    const dailyRev = completed
      .filter(o => new Date(o.created_at).toDateString() === now.toDateString())
      .reduce((acc, o) => acc + Number(o.total_amount), 0);

    const weeklyRev = completed
      .filter(o => {
        const d = new Date(o.created_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return d > sevenDaysAgo;
      }).reduce((acc, o) => acc + Number(o.total_amount), 0);

    const monthlyRev = completed
      .filter(o => {
        const d = new Date(o.created_at);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      }).reduce((acc, o) => acc + Number(o.total_amount), 0);

    // 2. MÉTRICAS EXTRA
    const totalRevenue = completed.reduce((acc, o) => acc + Number(o.total_amount), 0);
    const aov = completed.length > 0 ? totalRevenue / completed.length : 0;

    // 3. TOP PRODUCTOS
    const productMap = {};
    completed.forEach(o => o.order_items?.forEach(i => {
      const name = i.products?.name;
      if (name) {
        productMap[name] = { name, img: i.products.image_url, qty: (productMap[name]?.qty || 0) + i.quantity };
      }
    }));
    const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

    // 4. LÓGICA DEL GRÁFICO (DÍAS DEL MES SELECCIONADO)
    let chartItems = [];
    if (viewRange === '7days') {
      chartItems = Array(7).fill(0).map((_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (6 - i));
        const amount = completed
          .filter(o => new Date(o.created_at).toDateString() === d.toDateString())
          .reduce((acc, o) => acc + Number(o.total_amount), 0);
        return { label: d.toLocaleDateString('es-ES', { weekday: 'short' }), amount };
      });
    } else {
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      chartItems = Array(daysInMonth).fill(0).map((_, i) => {
        const day = i + 1;
        const amount = completed
          .filter(o => {
            const d = new Date(o.created_at);
            return d.getDate() === day && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
          }).reduce((acc, o) => acc + Number(o.total_amount), 0);
        return { label: day, amount };
      });
    }

    return { dailyRev, weeklyRev, monthlyRev, aov, topProducts, chartItems, recentSales: data.orders.slice(0, 10) };
  }, [data, viewRange, selectedMonth, selectedYear]);

  if (data.loading) return (
    <div className="h-screen flex items-center justify-center bg-studio-bg">
      <div className="w-8 h-8 border-2 border-studio-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const maxChartVal = Math.max(...analytics.chartItems.map(d => d.amount), 1);

  return (
    <div className="p-8 space-y-8 bg-studio-bg min-h-screen text-studio-text-title font-sans">
      
      {/* HEADER EDITORIAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-studio-border pb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
            Business <span className="text-studio-primary">Intelligence</span>
          </h1>
          <p className="text-[10px] font-black text-studio-secondary uppercase tracking-[0.4em] opacity-40 mt-2">A&B Studio Operations Manager</p>
        </div>

        {/* FILTROS DE FECHA */}
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white border border-studio-border p-1 rounded-xl shadow-sm">
            <button 
              onClick={() => setViewRange('7days')}
              className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewRange === '7days' ? 'bg-studio-bg shadow-inner' : 'opacity-30 hover:opacity-100'}`}
            >
              7 Días
            </button>
            <button 
              onClick={() => setViewRange('monthly')}
              className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewRange === 'monthly' ? 'bg-studio-bg shadow-inner' : 'opacity-30 hover:opacity-100'}`}
            >
              Mensual
            </button>
          </div>

          <div className="flex gap-2">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-white border border-studio-border px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-studio-primary transition-colors cursor-pointer"
            >
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white border border-studio-border px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-studio-primary transition-colors cursor-pointer"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* MÉTRICAS (DIARIO, SEMANAL, MENSUAL, ETC.) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Ingreso Hoy', val: `$${analytics.dailyRev.toFixed(2)}` },
          { label: 'Últimos 7 Días', val: `$${analytics.weeklyRev.toFixed(2)}` },
          { label: `Ingreso ${months[selectedMonth]}`, val: `$${analytics.monthlyRev.toFixed(2)}` },
          { label: 'Activos Totales', val: data.products.length },
          { label: 'Ticket Medio', val: `$${analytics.aov.toFixed(1)}` },
          { label: 'Ventas Totales', val: data.orders.length },
        ].map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-studio-border shadow-sm group hover:border-studio-primary/30 transition-all">
            <p className="text-[9px] font-black text-studio-secondary uppercase tracking-widest opacity-30 mb-2">{m.label}</p>
            <p className="text-2xl font-black tracking-tighter italic">{m.val}</p>
          </div>
        ))}
      </div>

      {/* GRÁFICO DINÁMICO POR DÍAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-studio-border p-10 shadow-sm">
          <div className="flex justify-between items-center mb-16">
            <div className="space-y-1">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <FiBarChart2 className="text-studio-primary"/> Flujo de Ingresos Diario
              </h3>
              <p className="text-[9px] font-bold text-studio-secondary opacity-40 uppercase">
                {viewRange === '7days' ? 'Rendimiento última semana' : `Desglose de ${months[selectedMonth]} ${selectedYear}`}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between h-64 gap-1 md:gap-2 px-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewRange}-${selectedMonth}-${selectedYear}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-end justify-between h-64 gap-1 md:gap-2 w-full"
              >
                {analytics.chartItems.map((d, i) => (
                  <div key={`${viewRange}-${selectedMonth}-${i}`} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                    <div className="relative w-full flex flex-col items-center h-full justify-end">
                      <div className="absolute -top-10 bg-studio-text-title text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                        ${d.amount.toFixed(0)}
                      </div>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.amount / maxChartVal) * 100}%` }}
                        className={`w-full ${viewRange === '7days' ? 'max-w-[45px]' : 'max-w-[15px]'} bg-studio-primary rounded-t-lg group-hover:brightness-110 transition-all min-h-[2px]`}
                      />
                    </div>
                    <span className="text-[8px] font-black uppercase opacity-20 group-hover:opacity-100 group-hover:text-studio-primary transition-all">
                      {d.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* TOP PRODUCTOS (BEST SELLERS) */}
        <div className="lg:col-span-4 bg-studio-text-title text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-studio-primary/20 blur-3xl -mr-20 -mt-20" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-studio-primary mb-12 flex items-center gap-2 relative z-10">
            <FiAward /> Best Sellers
          </h3>
          <div className="space-y-8 relative z-10">
            {analytics.topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-5 group">
                <img src={p.img} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                <div className="grow min-w-0">
                  <p className="text-[10px] font-black uppercase truncate tracking-tight">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-studio-primary" style={{ width: `${(p.qty / (analytics.topProducts[0]?.qty || 1)) * 100}%` }} />
                    </div>
                    <p className="text-[9px] font-black opacity-30">{p.qty}u</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ÚLTIMAS 10 VENTAS */}
      <div className="bg-white rounded-[2.5rem] border border-studio-border shadow-sm overflow-hidden">
        <div className="px-10 py-6 border-b border-studio-border flex justify-between items-center bg-gray-50/30">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Historial de Transacciones</h3>
          <FiArrowUpRight className="text-studio-primary opacity-30" size={18}/>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[8px] font-black uppercase tracking-[0.3em] text-studio-secondary opacity-40 border-b border-studio-border">
                <th className="px-10 py-5">Orden / Fecha</th>
                <th className="px-10 py-5">Cliente</th>
                <th className="px-10 py-5 text-right">Monto Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-border">
              {analytics.recentSales.map((o) => (
                <tr key={o.id} className="hover:bg-studio-bg transition-colors group">
                  <td className="px-10 py-5">
                    <p className="font-mono text-[10px] font-bold">#{o.id.slice(0, 8)}</p>
                    <p className="text-[9px] opacity-30 uppercase font-black tracking-widest">{new Date(o.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-10 py-5 text-[10px] font-black uppercase tracking-tight">
                    {o.customer_email?.split('@')[0]}
                  </td>
                  <td className="px-10 py-5 text-right font-black text-base italic tracking-tighter group-hover:text-studio-primary transition-colors">
                    ${o.total_amount}
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