import CartClient from '@/components/cart/CartClient';
import { getCartItems } from '@/lib/queries/cart';
import { requireUser } from '@/lib/auth-guards';

export default async function CartPage() {
  await requireUser();
  const items = await getCartItems();

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Checkout</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl">Your cart</h1>
      </div>
      <CartClient initialItems={items} />
    </div>
  );
}
