import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const BillModal = ({ isOpen, onClose, bill, tableNumber }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
        >
          <div className="bg-slate-50 px-6 py-4 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Table #{tableNumber} Bill
              </h2>
              <button
                onClick={onClose}
                className="rounded-full bg-slate-200 p-1.5 transition hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <svg
                  className="h-5 w-5 text-slate-600 dark:text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
            {!bill || bill.items.length === 0 ? (
              <p className="text-center text-slate-500 py-4">No items ordered yet.</p>
            ) : (
              <div className="space-y-4">
                {bill.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        Rs {item.price} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      Rs {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 px-6 py-5 text-white dark:bg-black">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Total Amount</span>
              <span className="text-2xl font-bold">Rs {bill?.totalAmount || 0}</span>
            </div>
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-orange-500 py-3 font-bold transition hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BillModal;
