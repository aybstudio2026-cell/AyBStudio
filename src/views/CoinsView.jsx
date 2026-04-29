import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiZap, FiClock, FiTrendingUp, FiX, FiAlertCircle, FiCheck, FiShoppingBag } from 'react-icons/fi';
import { Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserSidebar from '../components/layout/UserSidebar';

export default function CoinsView() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', title: '', subtitle: '' });

  const showToast = (type, title, subtitle) => {
    setToast({ show: true, type, title, subtitle });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 4500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      
      // 1. Traer balance del perfil
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(prof);
      
      // 2. Traer Canjes (Ingresos)
      const { data: income } = await supabase
        .from('vouchers')
        .select('id, code, amount, used_at')
        .eq('used_by', session.user.id);

      // 3. Traer Compras con Coins (Gastos)
      // Buscamos en order_items los productos comprados con monedas
      const { data: expenses } = await supabase
        .from('order_items')
        .select(`
          id, 
          coins_at_purchase, 
          products ( name ),
          orders!inner ( created_at, user_id )
        `)
        .eq('orders.user_id', session.user.id)
        .gt('coins_at_purchase', 0);

      // 4. Unificar y ordenar movimientos por fecha
      const movements = [
        ...(income || []).map(i => ({
          id: i.id,
          type: 'income',
          label: `Canje: ${i.code}`,
          amount: i.amount,
          date: i.used_at
        })),
        ...(expenses || []).map(e => ({
          id: e.id,
          type: 'expense',
          label: `Compra: ${e.products?.name || 'Producto'}`,
          amount: e.coins_at_purchase,
          date: e.orders.created_at
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setHistory(movements);
    }
  }

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);

    const { data, error } = await supabase.rpc('redeem_voucher', {
      p_code: code.trim(),
      p_user_id: user.id
    });

    if (error || !data.success) {
      showToast('error', 'Código inválido', data?.message || 'Error al procesar el código');
    } else {
      showToast('success', 'Voucher canjeado', `Has sumado ${data.amount} A&BCoins`);
      setCode('');
      fetchData(); 
    }
    setLoading(false);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-studio-bg flex justify-center items-start">
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            className="fixed top-24 right-6 z-[200] w-full max-w-[340px] bg-white rounded-xl shadow-2xl border border-gray-100 flex items-center overflow-hidden"
          >
            <div className={`w-1.5 h-16 shrink-0 ${toast.type === 'error' ? 'bg-red-500' : 'bg-studio-primary'}`} />
            <div className="flex items-center gap-3 p-4 flex-1">
              <div className={`p-2 rounded-full shrink-0 ${toast.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-studio-primary/10 text-studio-primary'}`}>
                {toast.type === 'error' ? <FiAlertCircle size={18} /> : <FiCheck size={18} />}
              </div>
              <div className="flex-1 pr-6">
                <p className="font-bold text-studio-text-title text-sm leading-tight">{toast.title}</p>
                <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-wider mt-0.5">{toast.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setToast((t) => ({ ...t, show: false }))}
              className="absolute top-2 right-2 p-1 hover:bg-studio-bg rounded-md transition-colors text-studio-secondary/40 hover:text-studio-secondary"
            >
              <FiX size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-7xl px-4 md:px-10 flex flex-col md:flex-row gap-10 items-start">
        
        <UserSidebar />

        <main className="flex-1 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-1 bg-studio-text-title text-white p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <FiZap className="absolute -right-6 -bottom-6 text-white/10 rotate-12" size={160} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Tu Crédito</p>
                <h2 className="text-4xl text-studio-bg font-black italic tracking-tighter">
                  {profile?.balance || 0} <span className="text-studio-primary not-italic uppercase text-xl">A&BCoins</span>
                </h2>
              </div>
              <div className="relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                  Moneda Virtual Oficial
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-studio-text-title uppercase tracking-tight flex items-center gap-2">
                  <Wallet className="text-studio-primary" /> Canjear Voucher
                </h3>
                <p className="text-[10px] font-bold text-studio-secondary/60 uppercase tracking-widest mt-1">
                  Introduce tu código para sumar fondos instantáneamente
                </p>
              </div>

              <form onSubmit={handleRedeem} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="AB-XXXX-XXXX"
                  className="flex-1 bg-studio-bg border border-gray-100 p-4 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-studio-primary/20 focus:border-studio-primary transition-all uppercase"
                />
                <button 
                  disabled={loading}
                  className="px-8 py-4 bg-studio-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-lg hover:shadow-studio-primary/30 transition-all disabled:opacity-50 active:scale-95"
                >
                  {loading ? 'Validando...' : 'Aplicar'}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-studio-text-title">
                <FiClock className="text-studio-primary" /> Historial de Billetera
              </h3>
            </div>
            
            <div className="divide-y divide-gray-50">
              {history.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center opacity-20">
                  <FiZap size={40} />
                  <p className="font-bold uppercase tracking-widest text-[9px] mt-4">Aún no hay movimientos</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="p-6 flex justify-between items-center hover:bg-studio-bg/40 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.type === 'income' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                      }`}>
                        {item.type === 'income' ? <FiTrendingUp size={18} /> : <FiShoppingBag size={18} />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-studio-text-title uppercase">
                          {item.label}
                        </p>
                        <p className="text-[8px] font-black text-studio-secondary/40 uppercase tracking-widest">
                          {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-black italic tracking-tighter ${
                        item.type === 'income' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.type === 'income' ? '+' : '-'}{item.amount}
                      </p>
                      <p className="text-[7px] font-black text-studio-primary uppercase tracking-tighter">A&BCoins</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}