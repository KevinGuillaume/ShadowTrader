import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const AirplaneIcon: React.FC<IconProps> = ({
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
      <linearGradient id="holo-plane" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dbeafe" />
        <stop offset="40%" stopColor="#a5d6ff" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
      <linearGradient id="holo-accent" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#a5d6ff" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>

    {/* Main airplane body – filled with holographic gradient */}
    <path
      d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9L2 14v2l8-2.5V19l-2 1.5V22l3-1 3 1v-1.5L13 19v-5.5l8 2.5z"
      fill="url(#holo-plane)"
      opacity="0.94"
    />

    {/* Subtle inner highlight / shine on the body */}
    <path
      d="M21 16v-2l-8-5V9l8 5v2z M13 19l-2 1.5V22l3-1 3 1v-1.5l-2-1.5z"
      fill="none"
      stroke="#dbeafe"
      strokeWidth="0.9"
      opacity="0.65"
    />

    {/* Wing and tail accents for depth */}
    <path
      d="M13 9l8 5 M2 14l8 2.5"
      stroke="#ffffff"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.45"
    />

    {/* Tiny glow highlight near nose / cockpit area */}
    <circle cx="19" cy="14" r="1.1" fill="#dbeafe" opacity="0.5" />
  </svg>
);