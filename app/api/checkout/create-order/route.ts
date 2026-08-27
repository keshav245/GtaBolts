import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
       if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET env vars');
      return NextResponse.json({ error: 'Payment system is not configured. Contact support.' }, { status: 500 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }

    const { modSlug } = await request.json();
    if (!modSlug) {
      return NextResponse.json({ error: 'modSlug is required' }, { status: 400 });
    }

    const { data: mod } = await supabase
      .from('mods')
      .select('id, price_in_paise, title')
      .eq('slug', modSlug)
      .eq('status', 'published')
      .single();

    if (!mod) {
      return NextResponse.json({ error: 'Mod not found' }, { status: 404 });
    }

    const { data: existing } = await supabase
      .from('purchases')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('mod_id', mod.id)
      .maybeSingle();

    if (existing?.status === 'completed') {
      return NextResponse.json({ error: 'You already own this mod' }, { status: 400 });
    }

    if (mod.price_in_paise < 100) {
      // Razorpay requires a minimum order amount (₹1 = 100 paise).
      return NextResponse.json({ error: 'This mod is priced too low to process.' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: mod.price_in_paise,
      currency: 'INR',
      receipt: `${user.id}-${mod.id}`.slice(0, 40),
      notes: { modId: mod.id, userId: user.id },
    });

    // Pending purchase row, tied to this order. Completion (status -> 'completed')
    // only ever happens in the webhook handler once Razorpay confirms payment.
    const { error: upsertError } = await supabase.from('purchases').upsert(
      {
        user_id: user.id,
        mod_id: mod.id,
        razorpay_order_id: order.id,
        amount_in_paise: mod.price_in_paise,
        status: 'pending',
      },
      { onConflict: 'user_id,mod_id' }
    );

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      modTitle: mod.title,
    });
 } catch (err) {
    console.error('create-order failed:', err);
    // Extract Razorpay API errors (they are objects, not Error instances)
    if (err && typeof err === 'object' && 'statusCode' in err) {
      const rzpErr = err as { statusCode: number; error?: { description?: string } };
      const description = rzpErr.error?.description ?? 'Razorpay error';
      return NextResponse.json(
        { error: `Payment error (${rzpErr.statusCode}): ${description}` },
        { status: 500 }
      );
    }
    const message = err instanceof Error ? err.message : 'Checkout failed unexpectedly.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
