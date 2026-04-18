import { motion as Motion } from "framer-motion";
import { useCart } from "../hooks/useCart";

const CartDrawer = ({ open, onClose, onPlaceOrder, placingOrder }) => {
  const { items, totalPrice, updateQuantity, removeItem } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4" onClick={onClose}>
      <Motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto mt-10 max-w-lg rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-sm text-slate-500">
            Close
          </button>
        </div>

        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <p className="rounded-xl bg-slate-100 p-4 text-sm dark:bg-slate-800">
              Your cart is empty.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.product}
                className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.name}</p>
                  <button
                    onClick={() => removeItem(item.product)}
                    className="text-xs text-red-500"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-slate-500">Rs {item.price}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 border-t pt-4 dark:border-slate-700">
          <div className="mb-3 flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>Rs {totalPrice}</span>
          </div>
          <button
            onClick={onPlaceOrder}
            disabled={!items.length || placingOrder}
            className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placingOrder ? "Placing..." : "Place Order"}
          </button>
        </div>
      </Motion.div>
    </div>
  );
};

export default CartDrawer;
