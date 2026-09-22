import React from 'react';

export type LogoVariant = 'full' | 'wordmark' | 'compact' | 'icon';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface InfoNestLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  showSloganOnMobile?: boolean;
  interactive?: boolean;
}

export const InfoNestLogo: React.FC<InfoNestLogoProps> = ({
  variant = 'wordmark',
  size = 'md',
  className = '',
  showSloganOnMobile = false,
  interactive = false,
}) => {
  // Size-specific styling mappings
  const sizeConfig = {
    xs: {
      iconSize: 'w-6 h-6',
      titleSize: 'text-sm font-extrabold',
      sloganSize: 'text-[9px]',
      gap: 'gap-1.5',
      starSize: 'w-2 h-2',
    },
    sm: {
      iconSize: 'w-9 h-9',
      titleSize: 'text-lg font-black',
      sloganSize: 'text-[10px]',
      gap: 'gap-2.5',
      starSize: 'w-2.5 h-2.5',
    },
    md: {
      iconSize: 'w-11 h-11',
      titleSize: 'text-2xl font-black',
      sloganSize: 'text-[11px]',
      gap: 'gap-3',
      starSize: 'w-3 h-3',
    },
    lg: {
      iconSize: 'w-16 h-16',
      titleSize: 'text-3xl font-black',
      sloganSize: 'text-xs',
      gap: 'gap-4',
      starSize: 'w-3.5 h-3.5',
    },
    xl: {
      iconSize: 'w-24 h-24 sm:w-28 sm:h-28',
      titleSize: 'text-4xl sm:text-5xl font-black',
      sloganSize: 'text-sm sm:text-base',
      gap: 'gap-4 sm:gap-5',
      starSize: 'w-4 h-4',
    },
  }[size];

  const isIconOnly = variant === 'icon';
  const isCompact = variant === 'compact';
  const isFull = variant === 'full';

  // The orbital knowledge symbol container
  const renderIcon = () => (
    <div
      className={`relative shrink-0 flex items-center justify-center rounded-2xl ${sizeConfig.iconSize} ${
        interactive ? 'group-hover:scale-105 transition-transform duration-300' : ''
      }`}
    >
      {/* Outer cosmic glow aura */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300 -z-10" />

      {/* Official Artwork Display with Rounded Cosmic Crop */}
      <div className="w-full h-full rounded-2xl overflow-hidden bg-[#090C16] border border-cyan-500/30 p-[1px] shadow-[0_0_15px_rgba(168,85,247,0.35)] flex items-center justify-center">
        <img
          src="/infonest-logo.jpg"
          alt="InfoNest Orbital Knowledge Symbol"
          className="w-full h-full object-cover rounded-[15px] transform scale-[1.12]"
          loading="eager"
        />
      </div>

      {/* Micro-sparkle pulse overlay */}
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
    </div>
  );

  if (isIconOnly) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex ${
        size === 'xl' ? 'flex-col items-center text-center' : 'items-center'
      } ${sizeConfig.gap} select-none ${className}`}
    >
      {renderIcon()}

      <div className={`flex flex-col ${size === 'xl' ? 'items-center mt-2' : ''}`}>
        {/* Wordmark: Modern geometric typography */}
        <div className="flex items-center tracking-tight leading-none">
          <span className={`text-white font-sans ${sizeConfig.titleSize}`}>
            Info<span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">Nest</span>
          </span>

          {/* Subtle Cosmos badge on sm/md if not compact */}
          {!isCompact && size !== 'xs' && size !== 'xl' && (
            <span className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 ml-2 hidden sm:inline-block">
              Cosmos
            </span>
          )}
        </div>

        {/* Official Slogan (Full Variant) */}
        {isFull && (
          <div
            className={`flex items-center gap-1.5 font-mono text-slate-400 font-medium tracking-tight mt-1 ${sizeConfig.sloganSize} ${
              showSloganOnMobile ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <span>Learn Together.</span>
            <span className="text-purple-400">Share Freely.</span>
            <span className="text-cyan-300">Grow Further.</span>
          </div>
        )}
      </div>
    </div>
  );
};
