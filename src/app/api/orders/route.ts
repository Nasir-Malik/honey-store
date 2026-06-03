import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { CartItem, Address, PaymentMethod } from '@/types';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const body = await req.json() as {
    items: CartItem[];
    address: Address;
    paymentMethod: PaymentMethod;
    totalPKR: number;
  };

  const { items, address, paymentMethod, totalPKR } = body;

  if (!items?.length || !address || !paymentMethod) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Create order record
  const orderPayload = {
    items,
    address,
    total_pkr: totalPKR,
    payment_method: paymentMethod,
    payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
    fulfillment_status: 'pending',
  };

  const { data: order, error } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select()
    .single();

  if (error || !order) {
    console.error('Order insert error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }

  // Stripe checkout
  if (paymentMethod === 'stripe') {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.product.name },
        unit_amount: Math.round(item.product.price_usd * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?paid=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      metadata: { order_id: order.id },
    });

    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    return NextResponse.json({ orderId: order.id, checkoutUrl: session.url });
  }

  return NextResponse.json({ orderId: order.id });
}
