// api/webhook.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;

    // Solo procesamos pagos completados
    if (event.type !== 'payment.succeeded') {
      return res.status(200).json({ received: true });
    }

    const { metadata, payment_id, total_amount } = event.data;
    const userId = metadata?.uid;
    const cart = JSON.parse(metadata?.c || '[]');

    if (!userId || cart.length === 0) {
      return res.status(400).json({ error: 'Missing data in metadata' });
    }

    // Verificar que no procesamos el mismo pago dos veces
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('dodo_payment_id', payment_id)
      .single();

    if (existingOrder) {
      return res.status(200).json({ received: true, duplicate: true });
    }

    // Crear la orden en Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: total_amount / 100,
        status: 'completed',
        dodo_payment_id: payment_id,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Crear los items de la orden
    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.qty,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return res.status(200).json({ success: true, order_id: order.id });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}