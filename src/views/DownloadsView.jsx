import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiDownload, FiPackage, FiExternalLink, FiSearch, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function DownloadsView() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUserDownloads() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Traemos los items de los pedidos completados
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          products (
            id,
            name,
            image_url,
            download_url,
            product_types ( name )
          ),
          orders!inner ( status, user_id )
        `)
        .eq('orders.user_id', user.id)
        .eq('orders.status', 'completed'); // Solo lo que ya pagó

      if (!error) {
        // Eliminamos duplicados si el usuario compró el mismo producto dos veces
        const uniqueProducts = Array.from(new Map(data.map(item => [item.products.id, item.products])).values());
        setDownloads(uniqueProducts);
      }
      setLoading(false);
    }

    fetchUserDownloads();
  }, []);

  const filteredDownloads = downloads.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-40 text-center font-black animate-pulse text-digital-lavender">PREPARANDO TUS ARCHIVOS...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-soft-snow">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-panda-black uppercase tracking-tighter">Mi Librería</h1>
            <p className="text-xs font-bold text-panda-black/40 uppercase tracking-widest mt-2">Tus recursos digitales de A&B Studio</p>
          </div>

          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-panda-black/20" />
            <input 
              type="text"
              placeholder="Buscar en mis compras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-digital-lavender transition-all"
            />
          </div>
        </div>

        {filteredDownloads.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 italic text-panda-black/20 font-bold">
            {searchTerm ? "No se encontraron coincidencias en tu librería" : "Aún no tienes productos para descargar"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDownloads.map((item) => (
              <motion.div 
                layout
                key={item.id}
                className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all"
              >
                <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 bg-soft-snow">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black bg-digital-lavender/10 text-digital-lavender px-2 py-0.5 rounded-full uppercase">
                      {item.product_types?.name || 'Digital'}
                    </span>
                  </div>
                  <h3 className="font-black text-panda-black text-lg truncate mb-4">{item.name}</h3>
                  
                  <a 
                    href={item.download_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-panda-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-digital-lavender transition-all active:scale-95"
                  >
                    <FiDownload /> Descargar Ahora
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-20 p-10 bg-digital-lavender/5 rounded-[3rem] border border-digital-lavender/10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-digital-lavender">
            <FiFileText size={32} />
          </div>
          <div>
            <h4 className="font-black text-panda-black uppercase tracking-tight">¿Necesitas ayuda con tu software?</h4>
            <p className="text-sm font-medium text-panda-black/50 italic">Consulta nuestra documentación o contacta con soporte técnico de A&B Studio.</p>
          </div>
          <button className="md:ml-auto text-xs font-black text-digital-lavender border-b-2 border-digital-lavender pb-1 uppercase tracking-widest">
            Soporte Técnico
          </button>
        </div>
      </div>
    </div>
  );
}