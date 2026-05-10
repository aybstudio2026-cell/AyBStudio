import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiPackage, FiCalendar, FiInbox, FiEye, FiCheckCircle, FiClock, FiFilter, FiX } from 'react-icons/fi';
import UserSidebar from '../components/layout/UserSidebar';
import OrderDetailsModal from '../components/modals/OrderDetailsModal';

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    if (endDate && value > endDate) setEndDate('');
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    if (!startDate || value >= startDate) setEndDate(value);
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

  const hasFilters = startDate || endDate;

  return (
    <div className="pt-24 pb-24 md:pt-32 md:pb-20 min-h-screen bg-studio-bg flex justify-center items-start">
      <div className="w-full max-w-7xl px-4 md:px-10 flex flex-col md:flex-row gap-0 md:gap-10 items-start">

        <UserSidebar />

        <main className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Header + Filtros */}
          <div className="p-5 md:p-10 border-b border-gray-50 space-y-5">

            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-studio-text-title uppercase tracking-tight flex items-center gap-3">
                  <FiPackage className="text-studio-primary" size={22} />
                  Mis Pedidos
                </h1>
                <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-[0.2em] mt-1.5 leading-none ml-9">
                  Gestiona tus adquisiciones digitales
                </p>
              </div>

              {/* Botón limpiar filtros — solo visible si hay filtros activos */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-studio-primary border border-studio-primary/30 bg-studio-primary/5 px-3 py-2 rounded-lg shrink-0 hover:bg-studio-primary/10 transition-all"
                >
                  <FiX size={12} /> Limpiar
                </button>
              )}
            </div>

            {/* Filtros de fecha — stack vertical en mobile */}
            <div className="bg-studio-bg rounded-xl border border-gray-100 p-3 md:p-2 md:flex md:items-center md:gap-4 space-y-3 md:space-y-0">
              <div className="flex items-center gap-2 md:px-3">
                <FiFilter className="text-studio-secondary shrink-0" size={13} />
                <span className="text-[10px] font-black text-studio-secondary uppercase tracking-widest">Filtrar por fecha:</span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="flex-1 bg-white text-[11px] font-bold text-studio-text-title px-3 py-2.5 rounded-lg border border-transparent focus:border-studio-primary outline-none transition-all shadow-sm"
                />
                <span className="text-studio-secondary opacity-30 shrink-0">—</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="flex-1 bg-white text-[11px] font-bold text-studio-text-title px-3 py-2.5 rounded-lg border border-transparent focus:border-studio-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Lista de pedidos */}
          <div className="p-3 md:p-8 space-y-3 md:space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="py-24 md:py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <FiInbox size={52} strokeWidth={1} className="text-studio-secondary" />
                <p className="font-bold uppercase tracking-widest text-[10px]">
                  No se encontraron pedidos{hasFilters ? ' en estas fechas' : ''}
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-studio-primary font-bold text-[10px] uppercase border-b border-studio-primary"
                  >
                    Ver todos los pedidos
                  </button>
                )}
              </div>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="group bg-white border border-gray-100 rounded-xl transition-all duration-300 hover:shadow-sm hover:border-studio-primary/20"
                >
                  <div className="p-4 md:p-6 flex flex-col gap-4">

                    {/* Fila superior: icono + ID + fecha + previews */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 md:gap-5 min-w-0">
                        <div className={`p-2.5 md:p-3 rounded-xl shrink-0 ${
                          order.status === 'completed'
                            ? 'bg-studio-primary/5 text-studio-primary'
                            : 'bg-amber-50 text-amber-500'
                        }`}>
                          {order.status === 'completed'
                            ? <FiCheckCircle size={18} />
                            : <FiClock size={18} />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-black text-studio-secondary uppercase tracking-widest">Orden</span>
                            <span className="text-sm font-bold text-studio-text-title">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-studio-secondary mt-0.5 font-medium">
                            <FiCalendar size={12} className="text-studio-primary/60 shrink-0" />
                            <span className="truncate">
                              {new Date(order.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Previews de productos */}
                      <div className="flex items-center -space-x-2 shrink-0">
                        {order.order_items.slice(0, 4).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.products.image_url}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white object-cover shadow-sm bg-studio-bg shrink-0"
                            title={item.products.name}
                            alt=""
                          />
                        ))}
                        {order.order_items.length > 4 && (
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-studio-bg flex items-center justify-center text-[9px] font-bold text-studio-secondary shadow-sm shrink-0">
                            +{order.order_items.length - 4}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Fila inferior: total + botón */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div>
                        <p className="text-[9px] font-black text-studio-secondary uppercase tracking-widest leading-none">
                          Total Pagado
                        </p>
                        <p className="text-xl font-black text-studio-text-title mt-1">
                          ${order.total_amount.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-studio-text-title text-white font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all hover:bg-studio-primary shadow-sm active:scale-95 shrink-0"
                      >
                        <FiEye size={14} /> Ver Detalles
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