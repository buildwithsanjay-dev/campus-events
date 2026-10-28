/** Authored icons, one stroke weight, sized by the text they sit beside. */

type IconProps = { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
});

export const PinIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const ClockIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
);

export const SeatIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M6 10V6.5A1.5 1.5 0 0 1 7.5 5h9A1.5 1.5 0 0 1 18 6.5V10" />
    <path d="M4.5 10h15a1.5 1.5 0 0 1 1.5 1.5V16H3v-4.5A1.5 1.5 0 0 1 4.5 10Z" />
    <path d="M6 16v3M18 16v3" />
  </svg>
);

export const ArrowIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M5 12h13" />
    <path d="m12.5 6.5 5.5 5.5-5.5 5.5" />
  </svg>
);

export const CloseIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="m7 7 10 10M17 7 7 17" />
  </svg>
);

export const CalendarIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
  </svg>
);

export const AlertIcon = ({ size = 20 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 4.5 2.8 20h18.4L12 4.5Z" />
    <path d="M12 10v4.2M12 17.2h.01" />
  </svg>
);
