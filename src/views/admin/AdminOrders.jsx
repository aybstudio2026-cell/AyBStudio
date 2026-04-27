// src/views/admin/AdminOrders.jsx
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FiShoppingBag, FiUser, FiCalendar, FiEye, 
  FiSearch, FiX, FiArrowUpRight, FiCheckCircle, FiLoader 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Estados para Detalles de la Orden
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => { fetchAllOrders(); }, []);
  useEffect(() => { applyFilters(); }, [searchTerm, startDate, endDate, orders]);

  async function fetchAllOrders() {
    setLoading(true);
    // Asumiendo que admin_orders_view es la vista que creamos en Supabase
    const { data } = await supabase.from('admin_orders_view').select('*').order('created_at', { ascending: false });
    if (data) {
      setOrders(data);
      setFilteredOrders(data);
    }
    setLoading(false);
  }

  async function viewOrderDetails(order) {
    setSelectedOrder(order);
    setLoadingItems(true);
    
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        quantity,
        price_at_purchase,
        products (
          name,
          image_url
        )
      `)
      .eq('order_id', order.id);

    if (!error) setOrderItems(data);
    setLoadingItems(false);
  }

  const applyFilters = () => {
    let result = [...orders];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(o => 
        o.full_name?.toLowerCase().includes(term) || 
        o.username?.toLowerCase().includes(term) || 
        o.id.includes(term)
      );
    }
    if (startDate) result = result.filter(o => new Date(o.created_at) >= new Date(startDate));
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(o => new Date(o.created_at) <= end);
    }
    setFilteredOrders(result);
  };

  if (loading) return (
    <div className="p-40 text-center bg-studio-bg min-h-screen flex flex-col items-center justify-center gap-4">
      <FiLoader className="animate-spin text-studio-primary" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-studio-secondary animate-pulse">Auditando Ventas...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-studio-bg min-h-screen text-studio-text-title font-sans">
      
      {/* HEADER EDITORIAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-studio-border pb-8">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-studio-primary uppercase tracking-[0.4em]">Operations Audit</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            Gestión de <span className="text-studio-primary">Ventas</span>
          </h1>
        </div>
      </div>

      {/* FILTROS GÉLIDOS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-[2rem] border border-studio-border shadow-sm">
        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-secondary/30 group-focus-within:text-studio-primary transition-colors" />
          <input 
            type="text" 
            placeholder="BUSCAR CLIENTE O ID..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-studio-bg border border-studio-border rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-studio-primary transition-all" 
          />
        </div>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="bg-studio-bg border border-studio-border rounded-xl py-3 px-4 text-[10px] font-black text-studio-text-title outline-none focus:border-studio-primary transition-all" 
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="bg-studio-bg border border-studio-border rounded-xl py-3 px-4 text-[10px] font-black text-studio-text-title outline-none focus:border-studio-primary transition-all" 
        />
        <button 
          onClick={() => {setSearchTerm(''); setStartDate(''); setEndDate('');}} 
          className="bg-studio-text-title text-white hover:bg-studio-primary rounded-xl py-3 text-[9px] font-black uppercase tracking-widest transition-all"
        >
          <FiX className="inline mr-2" size={14}/> Limpiar Filtros
        </button>
      </div>

      {/* TABLA DE ÓRDENES */}
      <div className="bg-white rounded-[2.5rem] border border-studio-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-studio-border">
              <tr className="text-[9px] uppercase tracking-[0.3em] text-studio-secondary font-black opacity-50">
                <th className="p-8">Cliente / Orden</th>
                <th className="p-8">Fecha de Transacción</th>
                <th className="p-8">Monto Total</th>
                <th className="p-8 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-border">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-studio-bg transition-colors group">
                  <td className="p-8 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-studio-bg border border-studio-border flex items-center justify-center font-black text-xs text-studio-primary shrink-0 overflow-hidden shadow-inner">
                      {order.avatar_url ? <img src={order.avatar_url} className="w-full h-full object-cover" /> : <FiUser size={18} />}
                    </div>
                    <div>
                      <p className="font-black text-sm text-studio-text-title uppercase tracking-tight">{order.full_name || order.username || 'Usuario'}</p>
                      <p className="text-[9px] font-mono text-studio-secondary font-bold uppercase tracking-widest mt-1 opacity-40">#{order.id.slice(0,12)}</p>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2 text-studio-secondary">
                      <FiCalendar size={14} className="text-studio-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="p-8">
                    <p className="text-xl font-black text-studio-text-title italic tracking-tighter">${order.total_amount}</p>
                  </td>
                  <td className="p-8 text-right">
                    <button 
                      onClick={() => viewOrderDetails(order)}
                      className="bg-white border border-studio-border p-4 rounded-2xl text-studio-secondary hover:text-studio-primary hover:border-studio-primary transition-all shadow-sm"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <FiShoppingBag size={40} className="mx-auto text-studio-secondary/10" />
            <p className="text-[10px] font-black text-studio-secondary uppercase tracking-[0.4em] opacity-30">No se encontraron transacciones</p>
          </div>
        )}
      </div>

      {/* MODAL DE DETALLES (ESTILO BOUTIQUE) */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-studio-text-title/40 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] border border-studio-border shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-7">
                <div className="space-y-2">
                  <span className="text-[8px] font-black bg-studio-primary text-white px-3 py-1 rounded-full uppercase tracking-[0.2em]">Transaction Invoice</span>
                  <h2 className="text-2xl font-black text-studio-text-title mt-2 uppercase italic tracking-tighter leading-none">#{selectedOrder.id.slice(0,12)}</h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 flex items-center justify-center bg-studio-bg rounded-xl text-studio-secondary/40 hover:text-studio-primary transition-all"><FiX size={20}/></button>
              </div>

              <div className="space-y-6">
                {/* Info Cliente */}
                <div className="flex items-center gap-4 bg-studio-bg p-5 rounded-[1.5rem] border border-studio-border">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center border border-studio-border text-studio-primary shadow-sm">
                    <FiUser size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-studio-text-title uppercase tracking-widest">{selectedOrder.full_name || 'Comprador Final'}</p>
                    <p className="text-[9px] text-studio-secondary font-bold uppercase opacity-50">Log: @{selectedOrder.username}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-3 custom-scrollbar">
                  {loadingItems ? (
                    <div className="py-10 text-center animate-pulse text-studio-secondary/20 font-black uppercase italic text-xs tracking-widest">Sincronizando items...</div>
                  ) : (
                    orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-studio-border hover:border-studio-primary/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <img src={item.products?.image_url} className="w-12 h-12 rounded-xl object-cover border border-studio-border group-hover:scale-105 transition-transform duration-500" />
                          <div>
                            <p className="text-xs font-black text-studio-text-title uppercase tracking-tight">{item.products?.name}</p>
                            <p className="text-[8px] font-black text-studio-primary uppercase tracking-[0.2em] mt-1">Units: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-studio-text-title italic tracking-tighter">${item.price_at_purchase}</p>
                          <p className="text-[8px] font-black text-studio-secondary/30 uppercase tracking-widest">Unit Price</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Resumen Final */}
                <div className="pt-6 border-t border-studio-border flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-studio-secondary uppercase tracking-[0.3em] opacity-40">Monto Total</p>
                    <p className="text-4xl font-black text-studio-text-title tracking-tighter italic">${selectedOrder.total_amount}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-[9px] font-black text-studio-secondary uppercase tracking-widest opacity-40 flex items-center justify-end gap-2">
                      Gate: Dodo Payments <FiArrowUpRight />
                    </p>
                    <div className="flex items-center gap-2 bg-studio-primary/10 text-studio-primary px-4 py-2 rounded-xl border border-studio-primary/20">
                      <FiCheckCircle size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Pago Verificado</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}