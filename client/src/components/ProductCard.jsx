import { motion as Motion } from "framer-motion";

const ProductCard = ({ product, onAdd, onOpenDetails }) => (
  <Motion.article
    layout
    whileHover={{ y: -6 }}
    transition={{ type: "spring", stiffness: 420, damping: 28 }}
    className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-card ring-1 ring-black/[0.03] dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-none dark:ring-white/[0.06]"
  >
    <button
      type="button"
      onClick={() => onOpenDetails(product)}
      className="relative block w-full overflow-hidden text-left"
    >
      <img
        src={product.image}
        alt={product.name}
        className="h-44 w-full object-cover transition duration-500 ease-out group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-90" />
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-100">
        ~{product.estimatedPrepTimeMins ?? 15} min
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
        Rs {product.price}
      </span>
    </button>
    <div className="space-y-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
          {product.name}
        </h3>
      </div>
      <button
        type="button"
        onClick={() => onOpenDetails(product)}
        className="line-clamp-2 w-full text-left text-sm leading-relaxed text-slate-600 transition hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-300"
      >
        {product.description}
      </button>
      <button
        type="button"
        onClick={() => onAdd(product)}
        className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 py-3 text-sm font-bold text-white shadow-md transition hover:from-orange-600 hover:to-amber-600 hover:shadow-card-hover dark:from-orange-500 dark:to-amber-500 dark:hover:from-orange-400 dark:hover:to-amber-400"
      >
        Add to cart
      </button>
    </div>
  </Motion.article>
);

export default ProductCard;
