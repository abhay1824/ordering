import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api, socketUrl } from "../services/api";
import BillModal from "../components/BillModal";

const nextStatusMap = {
  Pending: "Preparing",
  Preparing: "Completed",
  Completed: "Completed",
};

const AdminPage = ({ onThemeToggle }) => {
  const [orders, setOrders] = useState([]);
  const [waiterCalls, setWaiterCalls] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showBill, setShowBill] = useState(false);
  const [selectedBillTable, setSelectedBillTable] = useState(null);
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const hydrateOrders = async () => {
      try {
        const [ordersResponse, callsResponse, sessionsResponse] = await Promise.all([
          api.get("/orders"),
          api.get("/waiter-calls"),
          api.get("/sessions"),
        ]);
        setOrders(ordersResponse.data);
        setWaiterCalls(callsResponse.data);
        setSessions(sessionsResponse.data);
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

    socket.on("session:created", (session) => {
      setSessions((prev) => [session, ...prev]);
    });

    socket.on("session:updated", (updatedSession) => {
      setSessions((prev) =>
        prev.map((s) => (s._id === updatedSession._id ? updatedSession : s))
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

  const updateSessionStatus = async (sessionId, status) => {
    try {
      await api.put(`/sessions/${sessionId}`, { status });
    } catch (error) {
      console.error("Failed to update session status", error);
    }
  };

  const fetchBillForAdmin = async (session) => {
    try {
      const response = await api.get(`/sessions/status/${session.sessionId}/bill`);
      setBillData(response.data);
      setSelectedBillTable(session.tableNumber);
      setShowBill(true);
    } catch (error) {
      console.error("Failed to fetch bill", error);
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

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Table Sessions</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
            {sessions.filter((s) => s.status === "ACTIVE").length} Active Tables
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions
            .filter((s) => s.status !== "CLOSED")
            .map((session) => (
              <article
                key={session._id}
                className={`rounded-2xl p-4 ring-1 transition ${
                  session.status === "ACTIVE"
                    ? "bg-emerald-50 ring-emerald-200 dark:bg-emerald-900/10 dark:ring-emerald-800"
                    : "bg-white ring-slate-200 dark:bg-slate-900 dark:ring-slate-700"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Table
                    </p>
                    <p className="text-xl font-bold">#{session.tableNumber}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-tight ${
                      session.status === "ACTIVE"
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-400 text-slate-900"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
                <p className="mb-4 text-[10px] text-slate-400">
                  Created: {new Date(session.createdAt).toLocaleTimeString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchBillForAdmin(session)}
                    className="shrink-0 rounded-xl bg-slate-200 p-2.5 transition hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                    title="View Bill"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {session.status === "INACTIVE" ? (
                    <button
                      onClick={() => updateSessionStatus(session._id, "ACTIVE")}
                      className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => updateSessionStatus(session._id, "CLOSED")}
                      className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </article>
            ))}
        </div>
        {sessions.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-4">No table sessions found.</p>
        )}
      </section>

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
      <BillModal
        isOpen={showBill}
        onClose={() => setShowBill(false)}
        bill={billData}
        tableNumber={selectedBillTable}
      />
    </main>
  );
};

export default AdminPage;
