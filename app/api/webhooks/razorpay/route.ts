import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');

  // Constant-time comparison — never use === on secrets/signatures.
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  const isValid =
    signatureBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;

    // No user session exists in a webhook request, so this is the one place
    // supabaseAdmin (service role, bypasses RLS) is required — dynamic import
    // per the security model, never a top-level import.
    const { supabaseAdmin } = await import('@/lib/supabase/admin');

    await supabaseAdmin
      .from('purchases')
      .update({ status: 'completed', razorpay_payment_id: payment.id })
      .eq('razorpay_order_id', payment.order_id);
  }

  return NextResponse.json({ ok: true });
}
