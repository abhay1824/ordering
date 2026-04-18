import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import StickyCartButton from "../components/StickyCartButton";
import CartDrawer from "../components/CartDrawer";
import DishDetailsModal from "../components/DishDetailsModal";
import { useCart } from "../hooks/useCart";

const categories = [
  { id: "Pizza", label: "Pizza", emoji: "🍕" },
  { id: "Burgers", label: "Burgers", emoji: "🍔" },
  { id: "Drinks", label: "Drinks", emoji: "🥤" },
  { id: "Desserts", label: "Desserts", emoji: "🍰" },
];

const MenuPage = ({ onThemeToggle }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Pizza");
  const [openCart, setOpenCart] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [callingWaiter, setCallingWaiter] = useState(false);
  const [loading, setLoading] = useState(true);

  const tableNumber = searchParams.get("table") || "1";

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [products, activeCategory]
  );

  const cartQty = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const placeOrder = async () => {
    try {
      setPlacingOrder(true);
      const response = await api.post("/orders", {
        tableNumber,
        items,
        totalPrice,
        status: "Pending",
        placedAt: new Date().toISOString(),
      });
      clearCart();
      setOpenCart(false);
      navigate(`/confirmation?orderId=${response.data._id}&table=${tableNumber}`);
    } catch (error) {
      console.error("Order failed:", error);
      alert("Unable to place order right now. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const callWaiter = async () => {
    try {
      setCallingWaiter(true);
      await api.post("/waiter-calls", { tableNumber });
      alert("Waiter has been notified.");
    } catch (error) {
      console.error("Failed to call waiter:", error);
      alert("Unable to notify waiter right now. Please try again.");
    } finally {
      setCallingWaiter(false);
    }
  };

  const orderNowFromDish = (dish) => {
    addItem(dish);
    setSelectedDish(null);
    setOpenCart(true);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 font-sans">
      <header className="relative mb-8 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 p-6 text-white shadow-card dark:border-white/10 dark:from-orange-600 dark:via-amber-700 dark:to-rose-700 sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/4 h-32 w-64 rounded-full bg-black/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 inline-flex items-center gap-2 rounded-full bg-black/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/95 backdrop-blur-sm">
              Table {tableNumber}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Tonight&apos;s picks
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">
              Tap a dish for details, or add straight to your cart. Kitchen fires orders as soon as you
              confirm.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-orange-700 shadow-md transition hover:bg-orange-50"
              onClick={() => setOpenCart(true)}
            >
              View cart
              {cartQty > 0 ? (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">{cartQty}</span>
              ) : null}
            </button>
            <button
              type="button"
              className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md ring-1 ring-white/20 transition hover:bg-emerald-500 disabled:opacity-60"
              onClick={callWaiter}
              disabled={callingWaiter}
            >
              {callingWaiter ? "Calling..." : "Call waiter"}
            </button>
            <button
              type="button"
              className="rounded-2xl bg-black/20 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm transition hover:bg-black/30"
              onClick={onThemeToggle}
            >
              Theme
            </button>
          </div>
        </div>
      </header>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
              activeCategory === category.id
                ? "bg-slate-900 text-white shadow-card dark:bg-white dark:text-slate-900"
                : "border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm hover:border-orange-200 hover:bg-orange-50/80 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-orange-500/40 dark:hover:bg-slate-800"
            }`}
          >
            <span className="mr-2" aria-hidden>
              {category.emoji}
            </span>
            {category.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 bg-white/80 py-16 text-slate-600 shadow-card dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="font-medium">Loading the menu…</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-600 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-400">
          Nothing in this category yet. Try another tab above.
        </p>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAdd={addItem}
              onOpenDetails={setSelectedDish}
            />
          ))}
        </section>
      )}

      <StickyCartButton onClick={() => setOpenCart(true)} />
      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
        onPlaceOrder={placeOrder}
        placingOrder={placingOrder}
      />
      <DishDetailsModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAdd={addItem}
        onOrderNow={orderNowFromDish}
      />
    </main>
  );
};

export default MenuPage;
