import React from 'react';

interface CosmicBackgroundProps {
  intensity?: 'subtle' | 'standard' | 'pronounced';
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  intensity = 'subtle',
}) => {
  const opacityMultiplier =
    intensity === 'pronounced' ? 1.4 : intensity === 'standard' ? 1.0 : 0.8;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none bg-[#07080D]"
    >
      {/* 1. Large Blurred Purple Radial Nebula Glow (behind left & center) */}
      <div
        className="absolute -top-32 left-1/4 w-[750px] h-[750px] rounded-full bg-gradient-to-br from-purple-700/20 via-indigo-900/10 to-transparent blur-[140px] mix-blend-screen"
        style={{ opacity: 0.45 * opacityMultiplier }}
      />

      {/* 2. Smaller Cyan / Blue Radial Glow (behind right rail) */}
      <div
        className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-cyan-600/15 via-blue-900/10 to-transparent blur-[150px] mix-blend-screen"
        style={{ opacity: 0.4 * opacityMultiplier }}
      />

      {/* 3. Deep Obsidian Base Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_20%,_#07080D_95%)]" />

      {/* 4. Subtle Orbital Arcs & Planetary Tracks (SVG, Opacity 3% - 8%) */}
      <svg
        className="absolute inset-0 w-full h-full text-white pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cosmicArc1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="cosmicArc2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.06" />
            <stop offset="70%" stopColor="#A855F7" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Outer Elliptical Orbital Ring centered on the page */}
        <ellipse
          cx="48%"
          cy="42%"
          rx="680"
          ry="310"
          transform="rotate(-18 680 310)"
          fill="none"
          stroke="url(#cosmicArc1)"
          strokeWidth="1.2"
          strokeDasharray="8 12"
        />

        {/* Counter Orbital Ring */}
        <ellipse
          cx="52%"
          cy="48%"
          rx="520"
          ry="240"
          transform="rotate(22 520 240)"
          fill="none"
          stroke="url(#cosmicArc2)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Soft Constellation Dots & Connectors */}
        <g opacity="0.07">
          <line x1="180" y1="220" x2="310" y2="170" stroke="#8B5CF6" strokeWidth="0.75" />
          <line x1="310" y1="170" x2="420" y2="290" stroke="#8B5CF6" strokeWidth="0.75" />
          <line x1="920" y1="140" x2="1080" y2="220" stroke="#06B6D4" strokeWidth="0.75" />
          <line x1="1080" y1="220" x2="1240" y2="180" stroke="#06B6D4" strokeWidth="0.75" />

          {/* Tiny constellation nodes */}
          <circle cx="180" cy="220" r="2" fill="#C084FC" />
          <circle cx="310" cy="170" r="2.5" fill="#38BDF8" />
          <circle cx="420" cy="290" r="2" fill="#C084FC" />
          <circle cx="920" cy="140" r="2" fill="#38BDF8" />
          <circle cx="1080" cy="220" r="3" fill="#FBBF24" />
          <circle cx="1240" cy="180" r="2" fill="#38BDF8" />
        </g>
      </svg>

      {/* 5. Floating Knowledge Micro-Spheres (animated very slow pulse, 4%-9% opacity) */}
      <div className="absolute top-[22%] left-[15%] w-3 h-3 rounded-full bg-cyan-400/20 blur-[1px] animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute top-[45%] right-[18%] w-4 h-4 rounded-full bg-purple-400/20 blur-[1px] animate-[pulse_8s_ease-in-out_infinite_2s]" />
      <div className="absolute bottom-[28%] left-[28%] w-2.5 h-2.5 rounded-full bg-amber-400/15 blur-[1px] animate-[pulse_7s_ease-in-out_infinite_1s]" />
      <div className="absolute bottom-[18%] right-[24%] w-3 h-3 rounded-full bg-indigo-400/20 blur-[1px] animate-[pulse_9s_ease-in-out_infinite_3s]" />
    </div>
  );
};
