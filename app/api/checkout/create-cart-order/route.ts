import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { data: cartRows } = await supabase.from('cart_items').select('mod_id').eq('user_id', user.id);
  if (!cartRows || cartRows.length === 0) {
    return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
  }

  const modIds = cartRows.map((r) => r.mod_id);
  const { data: mods } = await supabase
    .from('mods')
    .select('id, title, price_in_paise')
    .in('id', modIds)
    .eq('status', 'published');

  if (!mods || mods.length === 0) {
    return NextResponse.json({ error: 'Nothing in your cart is available to buy' }, { status: 400 });
  }

  // Skip anything already owned (e.g. bought in another tab since it was added).
  const { data: existingPurchases } = await supabase
    .from('purchases')
    .select('mod_id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .in('mod_id', modIds);

  const alreadyOwnedIds = new Set((existingPurchases ?? []).map((p) => p.mod_id));
  const modsToBuy = mods.filter((m) => !alreadyOwnedIds.has(m.id));

  if (modsToBuy.length === 0) {
    return NextResponse.json({ error: 'You already own everything in your cart' }, { status: 400 });
  }

  const totalAmount = modsToBuy.reduce((sum, m) => sum + m.price_in_paise, 0);

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const order = await razorpay.orders.create({
    amount: totalAmount,
    currency: 'INR',
    receipt: `cart-${user.id}`.slice(0, 40),
    notes: { userId: user.id, modIds: modsToBuy.map((m) => m.id).join(',') },
  });

  // One pending purchase row per mod, all sharing this order_id — the
  // webhook's single UPDATE ... WHERE razorpay_order_id = ... naturally
  // marks all of them completed together when payment succeeds.
  const purchaseRows = modsToBuy.map((mod) => ({
    user_id: user.id,
    mod_id: mod.id,
    razorpay_order_id: order.id,
    amount_in_paise: mod.price_in_paise,
    status: 'pending' as const,
  }));

  const { error: upsertError } = await supabase
    .from('purchases')
    .upsert(purchaseRows, { onConflict: 'user_id,mod_id' });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    itemCount: modsToBuy.length,
  });
}
