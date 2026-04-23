import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SessionOverlay = ({ status }) => {
  if (status === "ACTIVE") return null;

  const content = {
    INACTIVE: {
      title: "Waiting for approval",
      message: "Staff has been notified. Please wait a moment while we activate your table.",
      icon: "⏳",
      bgColor: "bg-amber-500/90",
    },
    CLOSED: {
      title: "Session Closed",
      message: "This session has been ended. Please contact staff if you need further assistance.",
      icon: "🏁",
      bgColor: "bg-slate-800/95",
    },
  };

  const current = content[status] || content.INACTIVE;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md ${current.bgColor}`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-slate-900"
        >
          <div className="mb-4 text-6xl">{current.icon}</div>
          <h2 className="mb-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
            {current.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">{current.message}</p>
          {status === "INACTIVE" && (
            <div className="mt-6 flex justify-center">
              <span className="flex h-3 w-3">
                <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SessionOverlay;
