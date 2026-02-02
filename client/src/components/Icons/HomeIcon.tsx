import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const HomeIcon: React.FC<IconProps> = ({
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
      <linearGradient id="holo-home" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a5d6ff" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>

    {/* House shape – main body with gradient fill */}
    <path
      d="M3 12 L12 3 L21 12 M5 10 V20 C5 20.5523 5.44772 21 6 21 H18 C18.5523 21 19 20.5523 19 20 V10"
      stroke="url(#holo-home)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.95"
    />

    {/* Door */}
    <rect x="10" y="15" width="4" height="6" rx="0.8" fill="url(#holo-home)" opacity="0.7" />

    {/* Roof shine / highlight */}
    <path
      d="M12 3 L21 12"
      stroke="#dbeafe"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity="0.65"
    />

    {/* Subtle inner glow on the house body */}
    <path
      d="M6 11 V19 H18 V11"
      stroke="#dbeafe"
      strokeWidth="0.9"
      opacity="0.4"
    />
  </svg>
);