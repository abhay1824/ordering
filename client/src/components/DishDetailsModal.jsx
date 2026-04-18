import { motion as Motion } from "framer-motion";

const DishDetailsModal = ({ dish, onClose, onAdd, onOrderNow }) => {
  if (!dish) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        onClick={(event) => event.stopPropagation()}
        className="mb-4 w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-900 sm:mb-0"
      >
        <div className="relative">
          <img src={dish.image} alt={dish.name} className="h-56 w-full object-cover sm:h-64" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-2xl font-bold leading-tight text-white drop-shadow-md">
              {dish.name}
            </h2>
            <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-bold text-orange-700 shadow-lg">
              Rs {dish.price}
            </span>
          </div>
        </div>
        <div className="space-y-4 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{dish.description}</p>
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-800 dark:bg-orange-500/15 dark:text-orange-200">
            <span aria-hidden>⏱</span>
            Ready in about {dish.estimatedPrepTimeMins || 15} minutes
          </p>
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3">
            <button
              type="button"
              onClick={onClose}
              className="order-3 rounded-2xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 sm:order-1"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onAdd(dish)}
              className="order-1 rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-400 sm:order-2"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => onOrderNow(dish)}
              className="order-2 rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 dark:bg-gradient-to-r dark:from-amber-500 dark:to-orange-500 dark:text-slate-900 dark:hover:from-amber-400 dark:hover:to-orange-400 sm:order-3"
            >
              Order now
            </button>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default DishDetailsModal;
