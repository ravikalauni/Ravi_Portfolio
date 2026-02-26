import React from 'react';
import { X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-md px-4"
      >
        <div className="pencil-border bg-white p-4 flex items-center justify-between shadow-lg border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-full">
              <Info size={18} className="text-slate-700" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              You can turn off the mouse tail animation with <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 font-mono text-xs">CTRL+O</span>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};