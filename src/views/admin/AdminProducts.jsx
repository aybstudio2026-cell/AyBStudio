import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*, categories(name)');
    if (data) setProducts(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (confirm('¿Eliminar este producto?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Productos</h1>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-digital-lavender px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <FiPlus /> Nuevo Producto
        </button>
      </div>

      <div className="bg-[#161b27] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40">
            <tr>
              <th className="p-6">Producto</th>
              <th className="p-6">Categoría</th>
              <th className="p-6">Precio</th>
              <th className="p-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="p-6 flex items-center gap-4">
                  <img src={p.image_url} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="font-bold">{p.name}</span>
                </td>
                <td className="p-6 text-white/60">{p.categories?.name}</td>
                <td className="p-6 font-mono text-digital-lavender">${p.price}</td>
                <td className="p-6 text-right space-x-2">
                  <button className="p-2 hover:text-digital-lavender"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 hover:text-red-400"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}