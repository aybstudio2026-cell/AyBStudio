import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiRadio, FiPlus, FiTrash2, FiToggleRight, FiToggleLeft } from 'react-icons/fi';

export default function AdminNews() {
  const [news, setNews] = useState([]);

  useEffect(() => { fetchNews(); }, []);

  async function fetchNews() {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (data) setNews(data);
  }

  async function toggleState(id, currentState) {
    await supabase.from('news').update({ state: !currentState }).eq('id', id);
    fetchNews();
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black italic">Noticias & Promos</h1>
        <button className="bg-digital-lavender px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest">
          <FiPlus className="inline mr-2" /> Nueva Noticia
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map(item => (
          <div key={item.id} className={`p-6 rounded-[2rem] border transition-all ${item.state ? 'bg-[#161b27] border-digital-lavender/30' : 'bg-[#0f1117] border-white/5 opacity-50'}`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase text-digital-lavender">{item.slogan}</span>
              <div className="flex gap-2">
                <button onClick={() => toggleState(item.id, item.state)}>
                  {item.state ? <FiToggleRight className="text-mint-green" size={24} /> : <FiToggleLeft size={24} />}
                </button>
                <button className="text-red-400/50 hover:text-red-400"><FiTrash2 /></button>
              </div>
            </div>
            <h3 className="text-xl font-black mb-2">{item.title}</h3>
            <p className="text-xs text-white/40 italic line-clamp-2 mb-6">{item.description}</p>
            <div className="h-24 w-full rounded-2xl overflow-hidden grayscale opacity-30">
              <img src={item.image_url} className="w-full h-full object-cover" alt="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}