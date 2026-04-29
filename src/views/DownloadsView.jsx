import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiDownload, FiPackage, FiSearch, FiInbox, FiKey, FiCopy, FiCheck, FiZap } from 'react-icons/fi';
import UserSidebar from '../components/layout/UserSidebar';

export default function InventoryView() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [copiedId, setCopiedId] = useState(null);
  const [voucherStatus, setVoucherStatus] = useState({});

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          voucher_code,
          products (
            id, name, image_url, download_url, secret_key,
            product_types ( name )
          ),
          orders!inner ( status, user_id, created_at )
        `)
        .eq('orders.user_id', user.id)
        .eq('orders.status', 'completed');

      if (!error) {
        const processedItems = [];
        const uniqueDownloadables = new Set();

        data.forEach(item => {
          const type = item.products.product_types?.name.toLowerCase();

          if (type === 'descargable') {
            if (!uniqueDownloadables.has(item.products.id)) {
              processedItems.push({ ...item, displayType: 'download' });
              uniqueDownloadables.add(item.products.id);
            }
          } else if (type === 'consumible') {
            for (let i = 0; i < item.quantity; i++) {
              processedItems.push({ 
                ...item, 
                displayType: 'consumible',
                instanceKey: `${item.id}-${i}` 
              });
            }
          } else if (type === 'coin') {
            // LÓGICA NUEVA: Los packs de monedas ya vienen desglosados 1 a 1 por el webhook
            processedItems.push({ 
              ...item, 
              displayType: 'coin',
              instanceKey: `coin-${item.id}` 
            });
          }
        });

        const coinCodes = processedItems
          .filter((it) => it.displayType === 'coin' && it.voucher_code)
          .map((it) => it.voucher_code);

        if (coinCodes.length > 0) {
          const { data: voucherRows } = await supabase
            .from('vouchers')
            .select('code, is_used, used_at')
            .in('code', coinCodes);

          const map = {};
          (voucherRows || []).forEach((v) => {
            map[v.code] = { is_used: Boolean(v.is_used), used_at: v.used_at || null };
          });
          setVoucherStatus(map);

          const enriched = processedItems.map((it) => {
            if (it.displayType !== 'coin') return it;
            const meta = it.voucher_code ? map[it.voucher_code] : null;
            return {
              ...it,
              voucher_is_used: Boolean(meta?.is_used),
              voucher_used_at: meta?.used_at || null
            };
          });
          setInventory(enriched);
        } else {
          setVoucherStatus({});
          setInventory(processedItems);
        }
      }
      setLoading(false);
    }
    fetchInventory();
  }, []);

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.products.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "todos" || item.displayType === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pt-32 pb-20 min-h-screen bg-studio-bg flex justify-center items-start">
      <div className="w-full max-w-7xl px-4 md:px-10 flex flex-col md:flex-row gap-10 items-start">
        
        <UserSidebar />

        <main className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[700px]">
          <div className="p-8 md:p-10 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <h1 className="text-2xl font-bold text-studio-text-title uppercase tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-studio-primary/10 rounded-lg text-studio-primary">
                <FiPackage size={20} />
              </div>
              Mi Inventario
            </h1>
            
            <div className="flex items-center gap-1 bg-studio-bg p-1.5 rounded-2xl w-fit border border-gray-100">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'download', label: 'Descargables' },
                { id: 'consumible', label: 'Consumibles' },
                { id: 'coin', label: 'Monedas' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveFilter(option.id)}
                  className={`
                    px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${activeFilter === option.id 
                      ? 'bg-white text-studio-primary shadow-sm ring-1 ring-black/5' 
                      : 'text-studio-secondary hover:text-studio-text-title'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-32 flex flex-col items-center justify-center opacity-30 text-center">
                <FiInbox size={48} />
                <p className="font-bold uppercase tracking-widest text-[10px] mt-4">Inventario vacío</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.instanceKey || item.id} className="flex items-center gap-5 p-5 rounded-2xl border border-gray-100 bg-white hover:border-studio-primary/20 transition-all group">
                  
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-50 relative">
                    <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        {item.displayType === 'download' ? <FiDownload className="text-white" /> : 
                         item.displayType === 'coin' ? <FiZap className="text-white" /> : <FiKey className="text-white" />}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      item.displayType === 'download' ? 'text-studio-primary' : 
                      item.displayType === 'coin' ? 'text-studio-primary' : 'text-amber-500'
                    }`}>
                      {item.displayType === 'download' ? 'Acceso Permanente' : 
                       item.displayType === 'coin' ? 'Código de Canje' : 'Clave de Activación'}
                    </span>
                    <h3 className="font-bold text-studio-text-title text-sm truncate mb-3">{item.products.name}</h3>

                    {/* LÓGICA DE BOTÓN/CÓDIGO SEGÚN TIPO */}
                    {item.displayType === 'download' ? (
                      <a 
                        href={item.products.download_url} 
                        target="_blank" 
                        className="inline-flex items-center gap-2 bg-studio-text-title text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-studio-primary transition-all active:scale-95 shadow-sm"
                      >
                        <FiDownload /> Descargar
                      </a>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="bg-studio-bg px-3 py-2 rounded-lg text-[11px] font-mono font-bold text-studio-text-body border border-gray-100">
                          {item.displayType === 'coin' ? (item.voucher_code || 'PROCESANDO...') : (item.products.secret_key || 'SIN CLAVE')}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(item.displayType === 'coin' ? item.voucher_code : item.products.secret_key, item.instanceKey)}
                          disabled={
                            item.displayType === 'coin'
                              ? (!item.voucher_code || item.voucher_is_used)
                              : !item.products.secret_key
                          }
                          className="p-2.5 bg-studio-bg text-studio-secondary rounded-lg hover:text-studio-primary transition-colors disabled:opacity-40 disabled:hover:text-studio-secondary disabled:cursor-not-allowed"
                        >
                          {copiedId === item.instanceKey ? <FiCheck className="text-green-500" /> : <FiCopy />}
                        </button>
                      </div>
                    )}
                    {item.displayType === 'coin' && (
                      <div className="mt-2 flex items-center justify-between gap-3">
                        {item.voucher_is_used ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                            <span className="text-[8px] font-black uppercase tracking-widest">Canjeado</span>
                            {item.voucher_used_at && (
                              <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                                {new Date(item.voucher_used_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="text-[8px] font-black text-studio-secondary/40 uppercase tracking-tighter">
                            * Úsalo en la sección "Mi Billetera"
                          </p>
                        )}

                        {!item.voucher_code && (
                          <p className="text-[8px] font-black text-studio-secondary/40 uppercase tracking-tighter">
                            * Generando código...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}