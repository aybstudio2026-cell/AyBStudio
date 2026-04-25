import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiPackage, FiCalendar, FiInbox, FiEye, FiCheckCircle, FiClock, FiXCircle, FiFilter } from 'react-icons/fi';
import UserSidebar from '../components/layout/UserSidebar';
import OrderDetailsModal from '../components/modals/OrderDetailsModal';

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- VALIDACIÓN INTELIGENTE ---
  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    if (endDate && value > endDate) {
      setEndDate('');
    }
  };
  const handleEndDateChange = (e) => {
    const value = e.target.value;
    if (!startDate || value >= startDate) {
      setEndDate(value);
    }
  };

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
            products ( name, image_url, product_types ( name ))
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setOrders(data);
    }
    fetchOrders();
  }, []);

  // LÓGICA DE FILTRADO LOCAL
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at).toISOString().split('T')[0];
    if (startDate && orderDate < startDate) return false;
    if (endDate && orderDate > endDate) return false;
    return true;
  });

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-studio-bg flex justify-center items-start">
      <div className="w-full max-w-7xl px-4 md:px-10 flex flex-col md:flex-row gap-10 items-start">
        
        <UserSidebar />

        <main className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* HEADER Y BARRA DE FILTROS */}
          <div className="p-8 md:p-10 border-b border-gray-50 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl font-bold text-studio-text-title uppercase tracking-tight flex items-center gap-3">
                  <FiPackage className="text-studio-primary" size={24} />
                  Mis Pedidos
                </h1>
                <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-[0.2em] mt-2 leading-none">
                  Gestiona tus adquisiciones digitales
                </p>
              </div>

              {/* BARRA DE FILTROS CON VALIDADORES */}
              <div className="flex flex-wrap items-center gap-4 bg-studio-bg p-2 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 px-3">
                  <FiFilter className="text-studio-secondary" size={14} />
                  <span className="text-[10px] font-black text-studio-secondary uppercase tracking-widest">Filtrar:</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="bg-white text-[11px] font-bold text-studio-text-title px-3 py-2 rounded-lg border border-transparent focus:border-studio-primary outline-none transition-all shadow-sm"
                  />
                  <span className="text-studio-secondary opacity-30">—</span>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="bg-white text-[11px] font-bold text-studio-text-title px-3 py-2 rounded-lg border border-transparent focus:border-studio-primary outline-none transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LISTADO DE PEDIDOS FILTRADOS */}
          <div className="p-2 md:p-8 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <FiInbox size={60} strokeWidth={1} className="text-studio-secondary" />
                <p className="font-bold uppercase tracking-widest text-[10px]">No se encontraron pedidos en estas fechas</p>
                {(startDate || endDate) && (
                  <button onClick={clearFilters} className="text-studio-primary font-bold text-[10px] uppercase border-b border-studio-primary">Ver todos los pedidos</button>
                )}
              </div>
            ) : (
              filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  className="group bg-white border border-gray-100 rounded-xl transition-all duration-300 hover:shadow-flat hover:border-studio-primary/20"
                >
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* ID y Fecha */}
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-xl ${order.status === 'completed' ? 'bg-studio-primary/5 text-studio-primary' : 'bg-amber-50 text-amber-500'}`}>
                        {order.status === 'completed' ? <FiCheckCircle size={22} /> : <FiClock size={22} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-studio-secondary uppercase tracking-widest">Orden</span>
                          <span className="text-sm font-bold text-studio-text-title">#{order.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-studio-secondary mt-1 font-medium">
                          <FiCalendar size={14} className="text-studio-primary/60" />
                          {new Date(order.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Previews */}
                    <div className="flex items-center -space-x-3 overflow-hidden px-2">
                      {order.order_items.map((item, idx) => (
                        <img 
                          key={idx}
                          src={item.products.image_url} 
                          className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-studio-bg shrink-0"
                          title={item.products.name}
                          alt=""
                        />
                      ))}
                      {order.order_items.length > 4 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-studio-bg flex items-center justify-center text-[10px] font-bold text-studio-secondary shadow-sm">
                          +{order.order_items.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Total y Botón */}
                    <div className="flex items-center justify-between lg:justify-end gap-10 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-50">
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] font-black text-studio-secondary uppercase tracking-widest leading-none">Total Pagado</p>
                        <p className="text-xl font-black text-studio-text-title mt-1.5">${order.total_amount.toFixed(2)}</p>
                      </div>
                      
                      <button 
                        onClick={() => openDetails(order)}
                        className="flex items-center gap-2 px-6 py-3 bg-studio-text-title text-white font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all hover:bg-studio-primary shadow-sm active:scale-95 shrink-0"
                      >
                        <FiEye size={16} /> Ver Detalles
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
      />
    </div>
  );
}