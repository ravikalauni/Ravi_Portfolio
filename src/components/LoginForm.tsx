import React, { useState, useEffect, useRef } from 'react';
import { PencilBox } from './PencilBox';
import { Terminal, X, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginFormProps {
  onLogin: (username: string) => void;
  onClose: () => void;
  adminUsername?: string;
  adminPassword?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  onClose, 
  adminUsername = 'Ravi', 
  adminPassword = 'Ravi123' 
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Welcome to Admin Terminal v2.0.4',
    'Type "help" for a list of commands.',
    ''
  ]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    
    if (!cmd) {
      if (username && password) {
        attemptLogin([...history, '> [ENTER]'], username, password);
      } else {
        setHistory([...history, '> ', 'Error: Credentials incomplete. Use u- and p- commands.']);
      }
      setInput('');
      return;
    }

    const newHistory = [...history, `> ${cmd}`];
    
    if (cmd.startsWith('u-')) {
      const val = cmd.substring(2);
      setUsername(val);
      newHistory.push(`Username set to: ${val}`);
      newHistory.push('Please enter password using p-[password]');
    } else if (cmd.startsWith('p-')) {
      const val = cmd.substring(2);
      setPassword(val);
      newHistory.push(`Password received.`);
      if (username && val) {
        attemptLogin(newHistory, username, val);
      } else if (!username) {
        newHistory.push('Error: Username not set. Use u-[username] first.');
      }
    } else if (cmd.toLowerCase() === 'login' || cmd.toLowerCase() === 'enter') {
      attemptLogin(newHistory, username, password);
    } else if (cmd.toLowerCase() === 'help') {
      newHistory.push('Available commands:');
      newHistory.push('  u-[username] - Set login username');
      newHistory.push('  p-[password] - Set login password');
      newHistory.push('  login        - Attempt to login');
      newHistory.push('  clear        - Clear terminal history');
      newHistory.push('  exit         - Close terminal');
    } else if (cmd.toLowerCase() === 'clear') {
      setHistory(['Terminal cleared.', '']);
      setInput('');
      return;
    } else if (cmd.toLowerCase() === 'exit') {
      onClose();
      return;
    } else {
      if (username && password) {
        attemptLogin(newHistory, username, password);
      } else {
        newHistory.push(`Command not found: ${cmd}. Type "help" for assistance.`);
      }
    }

    setHistory(newHistory);
    setInput('');
  };

  const attemptLogin = (currentHistory: string[], u: string, p: string) => {
    if (!u || !p) {
      currentHistory.push('Error: Username and password must be set first.');
      if (!u) currentHistory.push('  -> Set username: u-[username]');
      if (!p) currentHistory.push('  -> Set password: p-[password]');
      return;
    }

    currentHistory.push('Authenticating...');
    
    if (u === adminUsername && p === adminPassword) {
      currentHistory.push('Access Granted. Redirecting...');
      setTimeout(() => onLogin(u), 800);
    } else {
      currentHistory.push('Access Denied: Invalid credentials.');
      setPassword(''); // Reset password on failure
    }
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-slate-900 rounded-lg overflow-hidden shadow-2xl pencil-border border-slate-700">
          {/* Terminal Header */}
          <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-emerald-500" />
              <span className="text-xs font-mono text-slate-300">admin@ravi-portfolio: ~</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div 
            ref={scrollRef}
            className="h-80 overflow-y-auto p-4 font-mono text-sm bg-slate-950/50"
          >
            {history.map((line, i) => (
              <div key={i} className={`mb-1 ${line.startsWith('>') ? 'text-emerald-400' : line.startsWith('Error') || line.startsWith('Access Denied') ? 'text-red-400' : 'text-slate-300'}`}>
                {line}
              </div>
            ))}
            
            <form onSubmit={handleCommand} className="flex items-center gap-2 mt-2">
              <ChevronRight size={16} className="text-emerald-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none text-emerald-400 w-full font-mono"
                autoFocus
              />
            </form>
          </div>

          {/* Terminal Footer */}
          <div className="bg-slate-900/80 px-4 py-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <div>Status: {username && password ? 'Ready' : username ? 'Awaiting Password' : 'Awaiting Username'}</div>
            <div>UTF-8 | Bash</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
