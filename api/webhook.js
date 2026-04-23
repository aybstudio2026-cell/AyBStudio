// api/webhook.js
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Cliente de Supabase con SERVICE ROLE KEY (tiene permisos totales)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Verificar que el webhook viene de Dodo
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
  const signature = req.headers['webhook-signature'];
  
  if (webhookSecret && signature) {
    const hmac = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hmac !== signature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  const event = req.body;

  // 2. Solo procesamos pagos completados
  if (event.type !== 'payment.succeeded') {
    return res.status(200).json({ received: true });
  }

  try {
    const { metadata, payment_id, total_amount, customer } = event.data;
    const userId = metadata?.uid; 
    const cart = JSON.parse(metadata?.c || '[]'); 

    if (!userId || cart.length === 0) {
      return res.status(400).json({ error: 'Missing user_id or cart in metadata' });
    }

    // 3. Crear la orden en Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: total_amount / 100, // Dodo envía en centavos
        status: 'completed',
        dodo_payment_id: payment_id,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Crear los items de la orden
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