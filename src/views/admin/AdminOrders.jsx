import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiShoppingBag, FiUser, FiCalendar, FiEye, FiSearch, FiX, FiPackage, FiHash } from 'react-icons/fi';
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
    const { data } = await supabase.from('admin_orders_view').select('*').order('created_at', { ascending: false });
    if (data) {
      setOrders(data);
      setFilteredOrders(data);
    }
    setLoading(false);
  }

  // FUNCIÓN PARA VER DETALLES (Lo que pediste)
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
      result = result.filter(o => o.full_name?.toLowerCase().includes(term) || o.username?.toLowerCase().includes(term) || o.id.includes(term));
    }
    if (startDate) result = result.filter(o => new Date(o.created_at) >= new Date(startDate));
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(o => new Date(o.created_at) <= end);
    }
    setFilteredOrders(result);
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-digital-lavender font-black">AUDITANDO VENTAS...</div>;

  return (
    <div className="p-8">
      {/* Encabezado y Filtros (Igual al anterior) */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white italic">Gestión de Ventas</h1>
          <p className="text-white/30 text-sm">Historial detallado de transacciones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-[#161b27] p-6 rounded-[2rem] border border-white/5">
        <input type="text" placeholder="Buscar usuario..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-digital-lavender" />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[10px] font-black text-white outline-none" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[10px] font-black text-white outline-none" />
        <button onClick={() => {setSearchTerm(''); setStartDate(''); setEndDate('');}} className="bg-white/5 hover:bg-white/10 text-white/40 rounded-xl py-3 text-[10px] font-black uppercase"><FiX className="inline mr-2"/> Limpiar</button>
      </div>

      {/* Lista de Órdenes */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-[#161b27] p-6 rounded-2xl border border-white/5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-digital-lavender/10 rounded-xl flex items-center justify-center border border-white/5">
                {order.avatar_url ? <img src={order.avatar_url} className="w-full h-full rounded-xl object-cover" /> : <FiUser className="text-digital-lavender" />}
              </div>
              <div>
                <p className="font-black text-white">{order.full_name || order.username || 'Usuario'}</p>
                <p className="text-[10px] font-mono text-white/20 uppercase">#{order.id.slice(0,8)}</p>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="text-right">
                <p className="text-2xl font-black text-white">${order.total_amount}</p>
                <p className="text-[10px] font-bold text-digital-lavender uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              {/* EL BOTÓN DEL OJO */}
              <button 
                onClick={() => viewOrderDetails(order)}
                className="bg-white/5 p-4 rounded-2xl hover:bg-digital-lavender hover:text-panda-black transition-all"
              >
                <FiEye size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE DETALLES DE CADA ORDEN */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#161b27] rounded-[3rem] border border-white/10 shadow-2xl p-10 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-black bg-digital-lavender/10 text-digital-lavender px-3 py-1 rounded-full uppercase tracking-widest">Detalles del Pedido</span>
                  <h2 className="text-3xl font-black text-white mt-2 uppercase italic">#{selectedOrder.id.slice(0,12)}</h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white/5 rounded-full text-white/20 hover:text-white"><FiX size={24}/></button>
              </div>

              <div className="space-y-6">
                {/* Info del Cliente en el Modal */}
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-digital-lavender/20 flex items-center justify-center">
                      <FiUser className="text-digital-lavender" />
                   </div>
                   <div>
                      <p className="text-xs font-black text-white uppercase tracking-tighter">{selectedOrder.full_name || 'Comprador'}</p>
                      <p className="text-[10px] text-white/30 font-mono italic">Registrado como @{selectedOrder.username}</p>
                   </div>
                </div>

                {/* Lista de Productos Comprados */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {loadingItems ? (
                    <div className="py-10 text-center animate-pulse text-white/20 font-bold uppercase italic">Cargando items...</div>
                  ) : (
                    orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <img src={item.products?.image_url} className="w-12 h-12 rounded-xl object-cover grayscale-[0.5]" alt="" />
                          <div>
                            <p className="text-sm font-black text-white">{item.products?.name}</p>
                            <p className="text-[10px] font-bold text-digital-lavender uppercase tracking-widest">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-black text-white">${item.price_at_purchase}</p>
                          <p className="text-[9px] font-bold text-white/20 uppercase">PPU</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Resumen Final */}
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Monto Total Pagado</p>
                      <p className="text-4xl font-black text-white tracking-tighter">${selectedOrder.total_amount}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Pasarela: Dodo Payments</p>
                      <span className="bg-mint-green/10 text-mint-green text-[10px] font-black px-4 py-1 rounded-full uppercase">Transacción Exitosa</span>
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