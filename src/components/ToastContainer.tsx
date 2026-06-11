import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, ShieldCheck, Terminal, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
  type: "system" | "incoming" | "blocked" | "resolved";
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleAddToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string; type: "system" | "incoming" | "blocked" | "resolved" }>;
      if (!customEvent.detail || !customEvent.detail.text) return;

      const newToast: ToastMessage = {
        id: Math.random().toString(),
        text: customEvent.detail.text,
        type: customEvent.detail.type || "system"
      };

      setToasts(prev => [...prev, newToast].slice(-5)); // Limit to maximum 5 visible logs
    };

    window.addEventListener("secops-toast", handleAddToast);
    return () => {
      window.removeEventListener("secops-toast", handleAddToast);
    };
  }, []);

  const handleDismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auto-expire toasts after 4.5 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 4500);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none text-xs leading-5">
      <AnimatePresence>
        {toasts.map(toast => {
          // Categorize colors and icons based on threat status
          let borderCol = "rgba(77, 141, 255, 0.35)";
          let bgCol = "rgba(10, 16, 37, 0.95)";
          let textCol = "#ffffff";
          let Icon = Terminal;

          if (toast.type === "blocked") {
            borderCol = "rgba(255, 123, 115, 0.55)";
            bgCol = "rgba(25, 10, 16, 0.96)";
            textCol = "#ff7b73";
            Icon = ShieldAlert;
          } else if (toast.type === "resolved") {
            borderCol = "rgba(0, 200, 83, 0.55)";
            bgCol = "rgba(5, 25, 10, 0.96)";
            textCol = "#00c853";
            Icon = ShieldCheck;
          } else if (toast.type === "incoming") {
            borderCol = "rgba(245, 158, 11, 0.55)";
            bgCol = "rgba(25, 20, 10, 0.96)";
            textCol = "#f59e0b";
            Icon = ShieldAlert;
          }

          return (
            <motion.div
              layout
              key={toast.id}
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 25 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="pointer-events-auto border rounded-xl backdrop-blur-xl p-4 flex gap-3 shadow-2xl overflow-hidden relative"
              style={{ borderColor: borderCol, backgroundColor: bgCol, color: textCol }}
              id={`secops-toast-${toast.id}`}
            >
              {/* Terminal digital blinker line indicator */}
              <div
                className="absolute top-0 left-0 bottom-0 w-1"
                style={{
                  backgroundColor:
                    toast.type === "blocked"
                      ? "#ff7b73"
                      : toast.type === "resolved"
                      ? "#00c853"
                      : toast.type === "incoming"
                      ? "#f59e0b"
                      : "#4D8DFF"
                }}
              />

              <div className="flex-shrink-0 mt-0.5">
                <Icon size={16} className={toast.type === "blocked" ? "animate-pulse" : ""} />
              </div>

              <div className="flex-1 flex flex-col font-mono">
                <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                  [TACTICAL CONSOLE STATE]
                </span>
                <span className="text-[11px] font-bold mt-0.5 whitespace-pre-line leading-relaxed">
                  {toast.text}
                </span>
              </div>

              <button
                onClick={() => handleDismiss(toast.id)}
                className="flex-shrink-0 text-gray-500 hover:text-white transition-colors h-fit self-center cursor-pointer"
                aria-label="Dismiss message alert"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
export function triggerSecOpsToast(text: string, type: "system" | "incoming" | "blocked" | "resolved" = "system") {
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent("secops-toast", {
        detail: { text, type }
      })
    );
  }, 0);
}
