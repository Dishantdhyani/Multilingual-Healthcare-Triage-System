import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const containerSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sleek Medical AI Emblem */}
      <div className={`${containerSizes} bg-gradient-to-tr from-teal-600 via-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-500/25 relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-teal-500/40`}>
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Pulse Cross & AI Neural Nodes SVG */}
        <svg className={`${iconSizes} transform group-hover:rotate-6 transition-transform duration-300`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Vertical Cross Bar */}
          <path d="M12 3.5V20.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* EKG Heartbeat Horizontal Bar */}
          <path d="M3.5 12H7L9.5 7.5L12 16.5L14.5 12H20.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* AI Neural Node Accent Dots */}
          <circle cx="18.5" cy="5.5" r="1.8" fill="#a7f3d0" />
          <circle cx="5.5" cy="18.5" r="1.8" fill="#a7f3d0" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex items-center gap-2">
          <span className={`${textSizes} font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-teal-950 to-indigo-900 dark:from-white dark:via-teal-200 dark:to-indigo-200 bg-clip-text text-transparent`}>
            MedTriage
          </span>
          <span className="px-2 py-0.5 text-[9px] font-extrabold tracking-widest uppercase rounded-full bg-gradient-to-r from-teal-500/15 to-indigo-500/15 dark:from-teal-400/15 dark:to-indigo-400/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 dark:border-teal-400/30 shadow-2xs">
            AI
          </span>
        </div>
      )}
    </div>
  );
};
