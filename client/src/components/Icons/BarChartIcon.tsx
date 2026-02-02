import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const BarChartIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="holo-bar" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#dbeafe" />
        <stop offset="50%" stopColor="#a5d6ff" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
      <linearGradient id="holo-trend" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a5d6ff" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>

    {/* Bars – increasing heights */}
    <rect x="4"  y="16" width="3" height="4"  rx="1" fill="url(#holo-bar)" opacity="0.92" />
    <rect x="8"  y="13" width="3" height="7"  rx="1" fill="url(#holo-bar)" opacity="0.94" />
    <rect x="12" y="9"  width="3" height="11" rx="1" fill="url(#holo-bar)" opacity="0.96" />
    <rect x="16" y="5"  width="3" height="15" rx="1" fill="url(#holo-bar)" opacity="0.98" />

    {/* Subtle shine/highlight on bars */}
    <rect x="4"  y="16" width="3" height="1.2" rx="0.6" fill="#ffffff" opacity="0.35" />
    <rect x="8"  y="13" width="3" height="1.2" rx="0.6" fill="#ffffff" opacity="0.38" />
    <rect x="12" y="9"  width="3" height="1.2" rx="0.6" fill="#ffffff" opacity="0.40" />
    <rect x="16" y="5"  width="3" height="1.2" rx="0.6" fill="#ffffff" opacity="0.42" />

    {/* Trend line connecting tops – holographic sweep */}
    <path
      d="M5.5 16 L9.5 13 L13.5 9 L17.5 5"
      stroke="url(#holo-trend)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    />

    {/* Tiny glow dot at the end of trend line */}
    <circle cx="17.5" cy="5" r="1.1" fill="#dbeafe" opacity="0.6" />
  </svg>
);