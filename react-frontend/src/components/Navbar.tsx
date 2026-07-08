import React from 'react';
import { Logo } from './Logo';

interface NavbarProps {
  activeTab: 'home' | 'triage' | 'mindease' | 'how-it-works' | 'emergency';
  setActiveTab: (tab: 'home' | 'triage' | 'mindease' | 'how-it-works' | 'emergency') => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
}) => {
  const navItems: { id: 'home' | 'triage' | 'mindease' | 'how-it-works' | 'emergency'; label: string }[] = [
    { id: 'home', label: 'Overview' },
    { id: 'triage', label: 'AI Triage' },
    { id: 'mindease', label: 'MindEase' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'emergency', label: 'Emergency 24/7' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full font-sans transition-all duration-300">
      {/* Sleek Minimalist Glassmorphic Header */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/80 transition-colors duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Minimal Brand Logo */}
            <div 
              onClick={() => setActiveTab('home')}
              className="cursor-pointer"
            >
              <Logo size="md" />
            </div>

            {/* Clean Centered Pill Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/70 p-1 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Clean Right Actions */}
            <div className="flex items-center gap-2.5">
              {/* Language Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <span>🌐</span>
                <span>EN • HI</span>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-all duration-200 shadow-xs group"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Theme"
              >
                {darkMode ? (
                  <svg className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>

          </div>

          {/* Mobile Navigation Bar (Bottom Scrollable) */}
          <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-200/50 dark:border-slate-800/50 no-scrollbar">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
};
