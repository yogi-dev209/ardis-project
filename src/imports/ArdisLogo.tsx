interface ArdisLogoProps {
  className?: string;
}

export function ArdisLogo({ className = "h-10" }: ArdisLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon */}
      <div className="relative">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background rounded square */}
          <rect width="40" height="40" rx="8" fill="#1a2642"/>

          {/* Filing cabinet/box top */}
          <rect x="8" y="8" width="24" height="3" rx="1" fill="#e8630a"/>

          {/* Main box body */}
          <rect x="8" y="12" width="24" height="14" rx="1" fill="#e8630a"/>

          {/* File tabs inside box */}
          <rect x="10" y="14" width="5" height="8" rx="0.5" fill="white" opacity="0.9"/>
          <rect x="16" y="14" width="5" height="8" rx="0.5" fill="white" opacity="0.7"/>
          <rect x="22" y="14" width="5" height="8" rx="0.5" fill="white" opacity="0.5"/>

          {/* Bottom destruction indicator (shredder lines) */}
          <g opacity="0.8">
            <line x1="11" y1="28" x2="11" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="15" y1="28" x2="15" y2="31" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="28" x2="19" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="23" y1="28" x2="23" y2="31" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="27" y1="28" x2="27" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </g>

          {/* Small circle indicator */}
          <circle cx="34" cy="34" r="4" fill="#4ade80" stroke="#1a2642" strokeWidth="1.5"/>
          <path d="M32.5 34L33.5 35L35.5 33" stroke="#1a2642" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg leading-none tracking-tight">ARDIS</span>
        <span className="text-[#7a9ac4] text-[9px] leading-tight">Archive Records Destruction Information System</span>
      </div>
    </div>
  );
}

export function ArdisLogoIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background rounded square */}
      <rect width="40" height="40" rx="8" fill="#1a2642"/>

      {/* Filing cabinet/box top */}
      <rect x="8" y="8" width="24" height="3" rx="1" fill="#e8630a"/>

      {/* Main box body */}
      <rect x="8" y="12" width="24" height="14" rx="1" fill="#e8630a"/>

      {/* File tabs inside box */}
      <rect x="10" y="14" width="5" height="8" rx="0.5" fill="white" opacity="0.9"/>
      <rect x="16" y="14" width="5" height="8" rx="0.5" fill="white" opacity="0.7"/>
      <rect x="22" y="14" width="5" height="8" rx="0.5" fill="white" opacity="0.5"/>

      {/* Bottom destruction indicator (shredder lines) */}
      <g opacity="0.8">
        <line x1="11" y1="28" x2="11" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="15" y1="28" x2="15" y2="31" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="19" y1="28" x2="19" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="23" y1="28" x2="23" y2="31" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="27" y1="28" x2="27" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </g>

      {/* Small circle indicator */}
      <circle cx="34" cy="34" r="4" fill="#4ade80" stroke="#1a2642" strokeWidth="1.5"/>
      <path d="M32.5 34L33.5 35L35.5 33" stroke="#1a2642" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
