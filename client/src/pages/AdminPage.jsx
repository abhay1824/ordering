import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api, socketUrl } from "../services/api";

const nextStatusMap = {
  Pending: "Preparing",
  Preparing: "Completed",
  Completed: "Completed",
};

const AdminPage = ({ onThemeToggle }) => {
  const [orders, setOrders] = useState([]);
  const [waiterCalls, setWaiterCalls] = useState([]);

  useEffect(() => {
    const hydrateOrders = async () => {
      try {
        const [ordersResponse, callsResponse] = await Promise.all([
          api.get("/orders"),
          api.get("/waiter-calls"),
        ]);
        setOrders(ordersResponse.data);
        setWaiterCalls(callsResponse.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    const playOrderSound = () => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const context = new AudioCtx();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = 660;
      gain.gain.value = 0.18;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.frequency.setValueAtTime(660, context.currentTime);
      oscillator.frequency.setValueAtTime(880, context.currentTime + 0.12);
      oscillator.stop(context.currentTime + 0.28);
    };

    const playWaiterSound = () => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const context = new AudioCtx();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 1046;
      gain.gain.value = 0.14;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.18);
    };

    hydrateOrders();
    const socket = io(socketUrl);

    socket.on("order:created", (order) => {
      setOrders((prev) => [order, ...prev]);
      playOrderSound();
    });

    socket.on("order:updated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    });

    socket.on("waiter:called", (call) => {
      setWaiterCalls((prev) => [call, ...prev]);
      playWaiterSound();
    });

    socket.on("waiter:resolved", (resolvedCall) => {
      setWaiterCalls((prev) =>
        prev.map((call) => (call._id === resolvedCall._id ? resolvedCall : call))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateStatus = async (orderId, currentStatus) => {
    const nextStatus = nextStatusMap[currentStatus];
    if (currentStatus === "Completed") return;

    try {
      await api.put(`/orders/${orderId}`, { status: nextStatus });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const resolveWaiterCall = async (callId) => {
    try {
      await api.put(`/waiter-calls/${callId}/resolve`);
    } catch (error) {
      console.error("Failed to resolve waiter call", error);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6">
      <header className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          className="rounded-lg bg-slate-200 px-3 py-2 text-sm dark:bg-slate-800"
          onClick={onThemeToggle}
        >
          Toggle Theme
        </button>
      </header>

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold">Waiter Calls</h2>
        <div className="space-y-3">
          {waiterCalls.filter((call) => call.status === "Pending").length === 0 ? (
            <p className="rounded-xl bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
              No active waiter requests.
            </p>
          ) : (
            waiterCalls
              .filter((call) => call.status === "Pending")
              .map((call) => (
                <article
                  key={call._id}
                  className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:ring-emerald-700"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">Table #{call.tableNumber} called waiter</p>
                    <button
                      onClick={() => resolveWaiterCall(call._id)}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </article>
              ))
          )}
        </div>
      </section>

      <h2 className="mb-3 text-lg font-bold">Orders</h2>
      <div className="space-y-4">
        {orders.length === 0 && (
          <p className="rounded-xl bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
            No orders yet. Place an order from the menu screen to see it here.
          </p>
        )}
        {orders.map((order) => (
          <article
            key={order._id}
            className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">Table #{order.tableNumber}</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-700">
                {order.status}
              </span>
            </div>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
              {order.items.map((item) => (
                <p key={`${order._id}-${item.product}`}>
                  {item.name} x {item.quantity}
                </p>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-medium">Total: Rs {order.totalPrice}</p>
              <button
                onClick={() => updateStatus(order._id, order.status)}
                disabled={order.status === "Completed"}
                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Move to {nextStatusMap[order.status]}
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default AdminPage;
