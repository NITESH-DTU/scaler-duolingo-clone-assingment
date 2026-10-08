import type { ReactNode } from "react";

type IconProps = { size?: number; className?: string; fill?: string };

function Svg({
  size = 32,
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16 2.5 2.5 15 5.5 18.2 16 8.8 26.5 18.2 29.5 15Z" fill="#ff4b4b" />
    <path d="M7.5 17.5 16 10 24.5 17.5V27H7.5Z" fill="#ffc800" />
    <rect x="13" y="19" width="6" height="8" rx="1.5" fill="#ff9600" />
  </Svg>
);

export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M16 3 27 7V15C27 22 22 27 16 30 10 27 5 22 5 15V7Z"
      fill="#1cb0f6"
    />
    <path d="M16 7 23 9.5V15C23 19.5 20 23 16 25.5Z" fill="#49c0f8" />
  </Svg>
);

export const ChestIcon = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M5 13V10C5 7 7 5 10 5H22C25 5 27 7 27 10V13Z"
      fill="#ff9600"
    />
    <rect x="5" y="13" width="22" height="14" rx="2" fill="#cd7900" />
    <rect x="5" y="12" width="22" height="3" fill="#ffc800" />
    <rect x="13.5" y="14" width="5" height="7" rx="1.5" fill="#ffc800" />
  </Svg>
);

export const ShopIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5H28L30 12H2Z" fill="#ff4b4b" />
    <path
      d="M10 5 9 12M16 5V12M22 5 23 12"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect x="5" y="12" width="22" height="15" rx="1" fill="#ffc800" />
    <rect x="13" y="17" width="6" height="10" fill="#ff9600" />
  </Svg>
);

export const ProfileIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle
      cx="16"
      cy="16"
      r="13"
      stroke="#afafaf"
      strokeWidth="2"
      strokeDasharray="4 3"
    />
    <circle cx="16" cy="13" r="4.5" fill="#1cb0f6" />
    <path
      d="M7.5 24C8.5 19.5 12 18.5 16 18.5S23.5 19.5 24.5 24C22.5 26.5 19.5 28 16 28S9.5 26.5 7.5 24Z"
      fill="#1cb0f6"
    />
  </Svg>
);

export const MoreIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="16" cy="16" r="13" fill="#ce82ff" />
    <circle cx="10.5" cy="16" r="1.9" fill="#fff" />
    <circle cx="16" cy="16" r="1.9" fill="#fff" />
    <circle cx="21.5" cy="16" r="1.9" fill="#fff" />
  </Svg>
);

export const BoltIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 2 6 18H14L12 30 26 12H17Z" fill="#ffc800" />
    <path d="M18 2 12 11H16Z" fill="#ffe066" />
  </Svg>
);

export const FlameIcon = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M16 2C17 8 25 11 25 20 25 26 21 30 16 30 11 30 7 26 7 20 7 15 10 13 11 9 13 11 14 12 15 12 16 9 16 5 16 2Z"
      fill="#ff9600"
    />
    <path
      d="M16 16C18 19 21 20 21 24 21 27 19 28 16 28 13 28 11 27 11 24 11 20 15 19 16 16Z"
      fill="#ffc800"
    />
  </Svg>
);

export const GemIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4H23L29 12 16 29 3 12Z" fill="#1cb0f6" />
    <path d="M3 12H29L23 4H9Z" fill="#49c0f8" />
    <path d="M9 4 13 12 16 29 3 12Z" fill="#84d8ff" opacity="0.6" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M16 28C5 20 3 14 3 10 3 6 6 4 9.5 4 12.5 4 15 6 16 8 17 6 19.5 4 22.5 4 26 4 29 6 29 10 29 14 27 20 16 28Z"
      fill="#ff4b4b"
    />
    <ellipse
      cx="9.5"
      cy="9.5"
      rx="3"
      ry="2"
      transform="rotate(-30 9.5 9.5)"
      fill="#fff"
      opacity="0.5"
    />
  </Svg>
);

export const StarIcon = ({ fill = "#fff", ...p }: IconProps) => (
  <Svg {...p}>
    <path
      d="M16 3 19.8 11.7 29 12.6 22 18.9 24.1 28 16 23.2 7.9 28 10 18.9 3 12.6 12.2 11.7Z"
      fill={fill}
      stroke={fill}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CheckIcon = ({ fill = "#fff", ...p }: IconProps) => (
  <Svg {...p}>
    <path
      d="M7 17 13 23 25 9"
      stroke={fill}
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CrownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 24 3 10 10 16 16 6 22 16 29 10 27 24Z" fill="#ffc800" />
    <rect x="5" y="24" width="22" height="3" rx="1.5" fill="#e5a900" />
  </Svg>
);

export const BookIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="4" width="22" height="24" rx="3" fill="#fff" />
    <path
      d="M10 4H8A3 3 0 0 0 5 7V25A3 3 0 0 0 8 28H10Z"
      fill="currentColor"
    />
    <path
      d="M14 11H23M14 16H23"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);

export const ChessIcon = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M10 28H24C24 22 22 20 22 17 22 12 18 8 13 7L9 3 8 8C5 11 4 15 6 18L10 17C12 15 13 15 14 15 11 18 10 22 10 28Z"
      fill="#4b4b4b"
    />
    <circle cx="13" cy="10.5" r="1.2" fill="#fff" />
  </Svg>
);

export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M20 6 10 16 20 26"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
