import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHash, FiCalendar, FiCreditCard, FiDownload, FiShoppingBag } from 'react-icons/fi';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReceiptPDF from './ReceiptPDF';

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-studio-text-title/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-studio-primary/10 rounded-lg text-studio-primary">
                  <FiShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-studio-text-title uppercase tracking-tight">Detalles del Pedido</h3>
                  <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-widest mt-0.5">ID: {order.id}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-studio-bg rounded-lg transition-colors text-studio-secondary">
                <FiX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh]">
              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-studio-secondary uppercase tracking-widest">Fecha</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-studio-text-title">
                    <FiCalendar className="text-studio-primary" /> {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-studio-secondary uppercase tracking-widest">Estado</p>
                  <span className="text-[10px] font-black uppercase px-2 py-1 bg-studio-primary/10 text-studio-primary rounded-md">
                    {order.status === 'completed' ? 'Completado' : order.status}
                  </span>
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <p className="text-[10px] font-black text-studio-secondary uppercase tracking-widest">Pago</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-studio-text-title uppercase">
                    <FiCreditCard className="text-studio-primary" /> Tarjeta / Paypal
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-studio-secondary uppercase tracking-widest border-b border-gray-50 pb-2">Productos({order.order_items.length})</p>
                {order.order_items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={item.products.image_url} 
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100 bg-studio-bg" 
                          alt="" 
                        />
                        {/* Badge de cantidad sobre la imagen si es mayor a 1 */}
                        {item.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 bg-studio-text-title text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-studio-text-title">
                          {item.products.name}
                        </p>
                        
                        {/* Mostramos el nombre del tipo de producto dinámicamente */}
                        <p className="text-[10px] font-bold text-studio-primary uppercase tracking-wider">
                          {item.products.product_types?.name || 'Recurso Digital'}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-studio-text-title text-sm">
                      ${item.price_at_purchase.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Summary */}
            <div className="p-8 bg-studio-bg/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-studio-secondary uppercase tracking-widest">Total Pagado</span>
                <span className="text-3xl font-black text-studio-text-title">${order.total_amount.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <PDFDownloadLink 
                  document={<ReceiptPDF order={order} />} 
                  fileName={`Boleta-ABStudio-${order.id.slice(0,8)}.pdf`}
                  className="flex-1 md:flex-none px-6 py-3 bg-studio-text-title text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  {({ loading }) => (
                    <>
                      <FiDownload size={16} />
                      {loading ? 'Generando...' : 'Descargar Boleta'}
                    </>
                  )}
                </PDFDownloadLink>
                <button 
                  onClick={onClose}
                  className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-200 text-studio-text-title rounded-xl font-bold text-xs hover:bg-gray-50 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}