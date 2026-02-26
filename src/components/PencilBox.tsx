import React from 'react';

interface PencilBoxProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export const PencilBox: React.FC<PencilBoxProps> = ({ children, className = "", padding = "p-6" }) => {
  return (
    <div className={`pencil-border bg-white dark:bg-slate-900 shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  );
};

export const RoughFilter: React.FC = () => {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <filter id="rough-paper">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
    </svg>
  );
};
