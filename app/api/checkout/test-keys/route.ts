import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Env vars missing',
      keyId: keyId ? `${keyId.slice(0, 8)}...` : 'MISSING',
      keySecret: keySecret ? 'SET' : 'MISSING'
    });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    await razorpay.orders.all({ count: 1 });
    return NextResponse.json({ 
      ok: true, 
      message: 'Keys are valid!',
      keyId: `${keyId.slice(0, 12)}...`
    });
  } catch (err: unknown) {
    const e = err as { statusCode?: number; error?: { description?: string } };
    return NextResponse.json({ 
      ok: false, 
      statusCode: e.statusCode,
      error: e.error?.description ?? String(err),
      keyId: `${keyId.slice(0, 12)}...`
    });
  }
}
