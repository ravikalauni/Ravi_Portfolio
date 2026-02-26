import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: string, pass: string) => void;
}

export const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Ravi' && password === 'Ravi123') {
      onLogin(username, password);
      onClose();
      setError('');
    } else {
      setError('Invalid credentials. Try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 p-8 sketch-border sketch-fill shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors sketch-border-sm"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold hand-font text-slate-800 dark:text-slate-200">Admin Login</h2>
              <p className="text-slate-500 dark:text-slate-400 hand-font">Enter your credentials to access the portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 hand-font flex items-center gap-2">
                  <User size={16} /> Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600 px-4 py-3 focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all sketch-border-sm"
                  placeholder="Username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 hand-font flex items-center gap-2">
                  <Lock size={16} /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600 px-4 py-3 focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all sketch-border-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-bold hand-font animate-bounce">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 py-3 font-bold hand-font text-xl hover:scale-[1.02] active:scale-[0.98] transition-all sketch-border"
              >
                Login
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
