import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-stack" role="region" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`toast toast-${t.type}`}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.22 }}
            >
              {t.type === "success"
                ? <CheckCircle size={16} />
                : <XCircle size={16} />}
              <span>{t.message}</span>
              <button className="toast-close" onClick={() => remove(t.id)} aria-label="Dismiss">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        .toast-stack {
          position: fixed; bottom: 1.5rem; right: 1.5rem;
          display: flex; flex-direction: column; gap: 10px;
          z-index: 9999; pointer-events: none;
        }
        .toast {
          display: flex; align-items: center; gap: 10px;
          padding: 0.7rem 1rem; border-radius: var(--radius-md);
          font-size: 0.9rem; font-weight: 500;
          box-shadow: var(--shadow-pop); pointer-events: all;
          max-width: 320px;
        }
        .toast-success { background: #e4efe9; border-left: 4px solid var(--teal); color: var(--teal-dark); }
        .toast-error   { background: #f6e6e1; border-left: 4px solid var(--rust); color: var(--rust-dark); }
        .toast-close {
          margin-left: auto; background: none; border: none;
          cursor: pointer; color: inherit; opacity: 0.6; display: flex; padding: 2px;
        }
        .toast-close:hover { opacity: 1; }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
