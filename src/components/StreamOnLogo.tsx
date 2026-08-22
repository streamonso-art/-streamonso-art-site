import React from 'react';

interface StreamOnLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const StreamOnLogo: React.FC<StreamOnLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showTagline = true,
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-2xl', sub: 'text-[11px]' },
    lg: { icon: 48, text: 'text-3xl', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];
  const isDark = variant === 'dark';

  return (
    <div id="streamon-brand-logo" className={`flex items-center gap-3 select-none ${className}`}>
      {/* Power/Play Vector Icon */}
      <div className="relative flex items-center justify-center">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_12px_rgba(180,255,57,0.45)]"
        >
          {/* Power Outer Ring with Top Opening */}
          <path
            d="M 50 18 A 38 38 0 1 0 74 25"
            stroke="#4A5568"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 26 25 A 38 38 0 0 0 50 88 A 38 38 0 0 0 88 50 A 38 38 0 0 0 74 25"
            stroke="#374151"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Top Power Bar Accent (Lime Green) */}
          <rect
            x="45"
            y="4"
            width="10"
            height="26"
            rx="5"
            fill="#B4FF39"
            className="animate-pulse"
          />
          {/* Play Triangle Inside Ring (Lime Green) */}
          <path
            d="M 42 35 L 68 50 L 42 65 Z"
            fill="#B4FF39"
            className="filter drop-shadow-[0_0_8px_#B4FF39]"
          />
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center tracking-tight font-extrabold">
          <span className={isDark ? 'text-white' : 'text-neutral-900'} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <span className={currentSize.text}>Stream</span>
            <span className={`${currentSize.text} text-[#B4FF39] ml-[1px]`}>On</span>
          </span>
        </div>
        {showTagline && (
          <span
            className={`font-medium tracking-wider uppercase mt-1 ${currentSize.sub} ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Your Brand, Always On
          </span>
        )}
      </div>
    </div>
  );
};
