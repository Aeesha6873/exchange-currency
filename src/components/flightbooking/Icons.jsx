// Icons.jsx
import React from "react";

export const IconPlane = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <path
      d="M14 2L8 10M14 2L10 14L8 10M14 2L2 6L8 10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconUsers = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <circle cx="5" cy="5" r="2" />
    <path
      d="M12 15V13C12 11.9 11.1 11 10 11H5C3.9 11 3 11.9 3 13V15"
      strokeLinecap="round"
    />
    <path d="M15 15V13C15 11.3 13.7 10 12 10" strokeLinecap="round" />
    <path d="M8 8C9.7 8 11 6.7 11 5C11 3.3 9.7 2 8 2" strokeLinecap="round" />
  </svg>
);

export const IconUser = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <circle cx="8" cy="5" r="2" />
    <path
      d="M14 15V13C14 11.9 13.1 11 12 11H4C2.9 11 2 11.9 2 13V15"
      strokeLinecap="round"
    />
  </svg>
);

export const IconChild = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <circle cx="8" cy="4" r="2" />
    <path d="M8 6V10M5 8H6M10 8H11M7 12H9" strokeLinecap="round" />
  </svg>
);

export const IconBaby = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <circle cx="6" cy="6" r="2" />
    <circle cx="10" cy="6" r="2" />
    <path d="M6 10V8M10 10V8" strokeLinecap="round" />
    <circle cx="8" cy="12" r="1" />
  </svg>
);

export const IconSeat = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <rect x="2" y="4" width="12" height="8" rx="1" ry="1" />
    <path d="M5 4V12M11 4V12M2 8H14" strokeLinecap="round" />
  </svg>
);

export const IconCheck = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="2">
    <path d="M13 4L6 11L3 8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconShield = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <path
      d="M8 14S14 11 14 6V3L8 1L2 3V6C2 11 8 14 8 14Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconStar = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <path
      d="M8 1L10 6L15 6L11 9L12 14L8 11L4 14L5 9L1 6L6 6L8 1Z"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconCalendar = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <rect x="2" y="3" width="12" height="11" rx="1" />
    <path d="M2 7H14M5 2V4M11 2V4" strokeLinecap="round" />
  </svg>
);

export const IconSwap = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <path
      d="M12 2L14 4L12 6M2 8V6C2 4.9 2.9 4 4 4H14M4 14L2 12L4 10M14 8V10C14 11.1 13.1 12 12 12H2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconClose = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="2">
    <path d="M12 4L4 12M4 4L12 12" strokeLinecap="round" />
  </svg>
);

export const IconChevronDown = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="2">
    <path d="M4 6L8 10L12 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconEconomy = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <path
      d="M8 2L2 5L8 8L14 5L8 2Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 11L8 14L14 11M2 8L8 11L14 8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconBusiness = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <rect x="2" y="5" width="12" height="8" rx="1" />
    <path
      d="M10 15V5C10 4.4 10.4 4 11 4H5C4.4 4 4 4.4 4 5V15"
      strokeLinecap="round"
    />
  </svg>
);

export const IconFirstClass = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <path
      d="M8 2L14 5V11L8 14L2 11V5L8 2Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 5L12 7V10L8 12L4 10V7L8 5Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconPremium = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5">
    <path
      d="M8 2L2 5L8 8L14 5L8 2Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 11L8 14L14 11M2 8L8 11L14 8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 8L10 10L8 12L6 10L8 8Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
