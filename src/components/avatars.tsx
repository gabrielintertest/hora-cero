import React from 'react';

export interface AvatarProps {
  className?: string;
  isStanding?: boolean;
}

const sharedStyles = "w-16 h-20 transition-transform duration-300 ease-in-out";

export const SpeechBubble: React.FC<{ text: string }> = ({ text }) => (
    <div className="absolute bottom-full mb-2 w-48 bg-white text-slate-800 rounded-lg p-2 text-center text-xs shadow-lg animate-fade-in-up z-10">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
    </div>
);

// Each avatar is a unique component with a distinct look
export const Avatar1: React.FC<AvatarProps> = ({ className, isStanding }) => (
  <svg viewBox="0 0 50 60" className={`${sharedStyles} ${className} ${isStanding ? 'transform -translate-y-2' : ''}`}>
    <rect x="10" y="30" width="30" height="30" rx="5" fill="#475569" />
    <rect x="15" y="32" width="20" height="5" fill="#64748b" />
    <circle cx="25" cy="15" r="12" fill="#facc15" />
    <circle cx="20" cy="15" r="2" fill="#1e293b" />
    <circle cx="30" cy="15" r="2" fill="#1e293b" />
    <path d="M 20 22 Q 25 25 30 22" stroke="#1e293b" fill="none" strokeWidth="1"/>
  </svg>
);

export const Avatar2: React.FC<AvatarProps> = ({ className, isStanding }) => (
  <svg viewBox="0 0 50 60" className={`${sharedStyles} ${className} ${isStanding ? 'transform -translate-y-2' : ''}`}>
    <rect x="10" y="30" width="30" height="30" rx="5" fill="#be123c" />
    <rect x="15" y="32" width="20" height="5" fill="#fecdd3" />
    <rect x="18" y="5" width="14" height="20" rx="7" fill="#854d0e" />
    <rect y="10" x="15" width="20" height="10" fill="#a16207" />
    <circle cx="25" cy="15" r="12" fill="none" />
    <circle cx="20" cy="15" r="2" fill="white" />
    <circle cx="30" cy="15" r="2" fill="white" />
  </svg>
);

export const Avatar3: React.FC<AvatarProps> = ({ className, isStanding }) => (
  <svg viewBox="0 0 50 60" className={`${sharedStyles} ${className} ${isStanding ? 'transform -translate-y-2' : ''}`}>
    <rect x="10" y="30" width="30" height="30" rx="5" fill="#047857" />
    <path d="M 10 35 L 40 35 L 35 30 L 15 30 Z" fill="#065f46" />
    <circle cx="25" cy="15" r="12" fill="#f0abfc" />
    <rect x="18" y="10" width="14" height="3" fill="#a21caf" />
    <circle cx="21" cy="18" r="1" fill="#a21caf" />
    <circle cx="29" cy="18" r="1" fill="#a21caf" />
    <path d="M 22 22 Q 25 20 28 22" stroke="#a21caf" fill="none" strokeWidth="1"/>
  </svg>
);

export const Avatar4: React.FC<AvatarProps> = ({ className, isStanding }) => (
  <svg viewBox="0 0 50 60" className={`${sharedStyles} ${className} ${isStanding ? 'transform -translate-y-2' : ''}`}>
    <rect x="10" y="30" width="30" height="30" rx="5" fill="#1d4ed8" />
    <rect x="23" y="30" width="4" height="15" fill="#60a5fa" />
    <circle cx="25" cy="15" r="12" fill="#fdba74" />
    <path d="M 15 8 H 35 V 15 H 15 Z" fill="#f97316" />
    <rect x="18" y="18" width="5" height="5" fill="white" stroke="black" strokeWidth="1" />
    <rect x="27" y="18" width="5" height="5" fill="white" stroke="black" strokeWidth="1" />
  </svg>
);

export const Avatar5: React.FC<AvatarProps> = ({ className, isStanding }) => (
  <svg viewBox="0 0 50 60" className={`${sharedStyles} ${className} ${isStanding ? 'transform -translate-y-2' : ''}`}>
    <rect x="10" y="30" width="30" height="30" rx="5" fill="#334155" />
    <circle cx="25" cy="45" r="5" fill="#94a3b8" />
    <circle cx="25" cy="15" r="12" fill="#e2e8f0" />
    <path d="M 25 3 A 10 10 0 0 0 15 10" stroke="#94a3b8" fill="none" strokeWidth="2" />
     <path d="M 25 3 A 10 10 0 0 1 35 10" stroke="#94a3b8" fill="none" strokeWidth="2" />
    <circle cx="20" cy="17" r="1.5" fill="#334155" />
    <circle cx="30" cy="17" r="1.5" fill="#334155" />
    <rect x="23" y="22" width="4" height="2" fill="#334155" />
  </svg>
);

export const Avatar6: React.FC<AvatarProps> = ({ className, isStanding }) => (
  <svg viewBox="0 0 50 60" className={`${sharedStyles} ${className} ${isStanding ? 'transform -translate-y-2' : ''}`}>
    <rect x="10" y="30" width="30" height="30" rx="5" fill="#7e22ce" />
    <path d="M 10 30 L 25 60 L 40 30 Z" fill="#9333ea" />
    <circle cx="25" cy="15" r="12" fill="#a7f3d0" />
    <circle cx="25" cy="15" r="8" fill="#6ee7b7" />
    <circle cx="25" cy="15" r="4" fill="#34d399" />
  </svg>
);