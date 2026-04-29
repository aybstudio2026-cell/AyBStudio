// api/webhook.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateVoucherCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  return `AB-${segment()}-${segment()}`; // Formato: AB-XXXXX-XXXXX
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const event = req.body;
    if (event.type !== 'payment.succeeded') return res.status(200).json({ received: true });

    const { metadata, payment_id } = event.data;
    const userId = metadata?.uid;
    const cart = JSON.parse(metadata?.c || '[]');

    if (!userId || cart.length === 0) return res.status(400).json({ error: 'Missing data' });

    // 1. Evitar duplicados
    const { data: existingOrder } = await supabase.from('orders').select('id').eq('dodo_payment_id', payment_id).single();
    if (existingOrder) return res.status(200).json({ received: true, duplicate: true });

    // 2. Obtener productos con su TIPO (Join con product_types)
    const productIds = cart.map(item => item.id);
    const { data: dbProducts } = await supabase
      .from('products')
      .select(`
        id, 
        coin_value,
        product_types ( name )
      `)
      .in('id', productIds);

    // 3. Crear la orden principal
    const totalUSD = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalUSD,
        status: 'completed',
        dodo_payment_id: payment_id,
      })
      .select().single();

    if (orderError) throw orderError;

    // 4. Generar items y vouchers
    const orderItemsFinal = [];

    for (const cartItem of cart) {
      const productInfo = dbProducts?.find(p => p.id === cartItem.id);
      
      // CAMBIO AQUÍ: Identificamos por el tipo de producto 'coin'
      const isCoinPack = productInfo?.product_types?.name === 'coin';

      if (isCoinPack) {
        // Generar un voucher por cada unidad comprada
        for (let i = 0; i < cartItem.qty; i++) {
          const newCode = generateVoucherCode();

          await supabase.from('vouchers').insert({
            code: newCode,
            amount: productInfo.coin_value || 0,
            is_used: false
          });

          orderItemsFinal.push({
            order_id: order.id,
            product_id: cartItem.id,
            quantity: 1, 
            price_at_purchase: cartItem.price,
            voucher_code: newCode 
          });
        }
      } else {
        orderItemsFinal.push({
          order_id: order.id,
          product_id: cartItem.id,
          quantity: cartItem.qty,
          price_at_purchase: cartItem.price,
          voucher_code: null
        });
      }
    }

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsFinal);
    if (itemsError) throw itemsError;

    return res.status(200).json({ success: true, order_id: order.id });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}