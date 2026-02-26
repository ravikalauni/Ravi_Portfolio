import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onLoginClick: () => void;
  websiteName?: string;
  showLoginButton?: boolean;
  currentView: 'portfolio' | 'documents';
  onViewChange: (view: 'portfolio' | 'documents') => void;
}

export const Navbar = ({ onLoginClick, websiteName = 'Ravi', showLoginButton = true, currentView, onViewChange }: NavbarProps) => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navLinks = [
    { name: 'About', href: '#about', view: 'portfolio' as const },
    { name: 'Skills', href: '#skills', view: 'portfolio' as const },
    { name: 'Projects', href: '#projects', view: 'portfolio' as const },
    { name: 'Documents', href: '#documents', view: 'documents' as const },
    { name: 'Contact', href: '#contact', view: 'portfolio' as const },
  ];

  const handleLinkClick = (view: 'portfolio' | 'documents') => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md pencil-border m-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleLinkClick('portfolio')}>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-200 hand-font transform -rotate-2 sketch-stroke">{websiteName}</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.view !== currentView) {
                    e.preventDefault();
                    handleLinkClick(link.view);
                  }
                }}
                className={`text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold transition-colors hand-font text-xl ${currentView === link.view && link.name === 'Documents' ? 'text-primary dark:text-primary underline underline-offset-4' : ''}`}
              >
                {link.name}
              </a>
            ))}
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {showLoginButton && (
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white font-bold pencil-border hover:opacity-90 transition-all text-sm"
                >
                  <LogIn size={16} />
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.view !== currentView) {
                      e.preventDefault();
                      handleLinkClick(link.view);
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${currentView === link.view && link.name === 'Documents' ? 'text-primary bg-slate-50 dark:bg-slate-900' : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  {link.name}
                </a>
              ))}
              {showLoginButton && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLoginClick();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
