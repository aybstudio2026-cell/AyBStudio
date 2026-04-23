// api/create-payment.js
import DodoPayments from 'dodopayments';

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: process.env.VITE_DODO_ENV === 'test' ? 'test_mode' : 'live_mode',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cart, customerEmail, userId } = req.body;

    const productCart = cart.map((item) => ({
      product_id: item.dodo_product_id,
      quantity: item.quantity,
    }));

    // Solo enviamos los datos mínimos en metadata
    const cartMini = cart.map((item) => ({
      id: item.id,
      qty: item.quantity,
      price: item.price,
    }));

    // Convertimos a string y verificamos que no exceda 500 chars
    const cartString = JSON.stringify(cartMini);

    const payment = await client.payments.create({
      billing: {
        city: 'Lima',
        country: 'PE',
        state: 'Lima',
        street: 'N/A',
        zipcode: '15000',
      },
      customer: {
        email: customerEmail,
        name: customerEmail,
        create_new_customer: false,
      },
      product_cart: productCart,
      metadata: {
        uid: userId,
        c: cartString,
      },
      payment_link: true,
      return_url: `${process.env.APP_URL}/success`,
    });

    return res.status(200).json({
      payment_id: payment.payment_id,
      payment_link: payment.payment_link,
    });

  } catch (error) {
    console.error('Dodo error:', error);
    return res.status(500).json({ error: error.message });
  }
}