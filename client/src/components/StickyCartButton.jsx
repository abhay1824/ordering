import { useCart } from "../hooks/useCart";

const StickyCartButton = ({ onClick }) => {
  const { items, totalPrice } = useCart();
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

  if (quantity === 0) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-3.5 text-left text-white shadow-card-hover ring-2 ring-orange-500/30 transition hover:ring-orange-400/50 dark:from-orange-600 dark:to-amber-600 dark:ring-amber-300/40"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-bold">
          {quantity} {quantity === 1 ? "item" : "items"} in cart
        </span>
        <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold tabular-nums">Rs {totalPrice}</span>
      </div>
    </button>
  );
};

export default StickyCartButton;
