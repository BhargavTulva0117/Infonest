import React from 'react';
import { InfoNestLogo } from '../brand/InfoNestLogo';

interface CosmicLoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export const CosmicLoadingScreen: React.FC<CosmicLoadingScreenProps> = ({
  message = 'Connecting your knowledge universe...',
  subMessage = 'Synchronizing neural nodes & orbital roadmap trails',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080D]/95 backdrop-blur-2xl select-none">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-purple-600/10 via-indigo-600/10 to-cyan-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="relative flex flex-col items-center text-center px-6 max-w-md">
        {/* Rotating Orbital Rings Animation around Logo */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer rotating ring */}
          <div className="absolute w-36 h-36 rounded-full border border-purple-500/20 border-t-cyan-400/80 animate-[spin_6s_linear_infinite]" />
          {/* Inner counter-rotating ring */}
          <div className="absolute w-28 h-28 rounded-full border border-cyan-500/20 border-b-purple-400/80 animate-[spin_4s_linear_infinite_reverse]" />

          {/* Central Logo with breathing glow */}
          <div className="relative z-10 p-2 rounded-3xl bg-[#080B15]/80 border border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.3)] animate-[pulse_3s_ease-in-out_infinite]">
            <InfoNestLogo variant="icon" size="lg" />
          </div>

          {/* Orbiting particles */}
          <div className="absolute w-36 h-36 animate-[spin_5s_linear_infinite]">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
          </div>
          <div className="absolute w-28 h-28 animate-[spin_3.5s_linear_infinite_reverse]">
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
          </div>
        </div>

        {/* Brand wordmark */}
        <div className="mb-3">
          <InfoNestLogo variant="wordmark" size="md" />
        </div>

        {/* Message & Status */}
        <p className="text-sm font-medium text-slate-200 tracking-tight font-sans mb-1 animate-pulse">
          {message}
        </p>
        <p className="text-[11px] font-mono text-slate-500">
          {subMessage}
        </p>

        {/* Micro progress shimmer line */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-6 border border-white/5">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
        </div>
      </div>
    </div>
  );
};
