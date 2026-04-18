import { Link, useSearchParams } from "react-router-dom";

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const table = searchParams.get("table");
  const orderId = searchParams.get("orderId");

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-10">
      <section className="w-full rounded-2xl bg-white p-6 text-center shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <p className="text-4xl">✅</p>
        <h1 className="mt-2 text-2xl font-bold">Order Placed Successfully</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Thank you! Your order for Table #{table} is now in queue.
        </p>
        <p className="mt-2 text-xs text-slate-500">Order ID: {orderId}</p>
        <Link
          to={`/menu?table=${table}`}
          className="mt-5 inline-block rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white"
        >
          Continue Ordering
        </Link>
      </section>
    </main>
  );
};

export default OrderConfirmationPage;
