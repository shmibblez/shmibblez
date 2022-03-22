// S <svg stroke-linejoin="square" stroke-linecap="square" stroke-width=".55" stroke="#FFF" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7"><path d="M1 6h5V3.5H1V1h5"/></svg>
// M <svg stroke-linejoin="square" stroke-linecap="square" stroke-width=".55" stroke="#FFF" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7"><path d="M1 6V1l2.5 2.5L6 1v5"/></svg>
// L <svg stroke-linejoin="square" stroke-linecap="square" stroke-width=".55" stroke="#FFF" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7"><path d="M1 1v5h5"/></svg>

import * as React from "react";

export const SmallLetter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    strokeLinejoin="round"
    strokeLinecap="round"
    strokeWidth={0.75}
    stroke="#FFF"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0.5 0.5 6 6"
    {...props}
  >
    <path d="M1 6h5V3.5H1V1h5" />
  </svg>
);
export const MediumLetter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    strokeLinejoin="round"
    strokeLinecap="round"
    strokeWidth={0.75}
    stroke="#FFF"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0.5 0.5 6 6"
    {...props}
  >
    <path d="M1 6V1l2.5 2.5L6 1v5" />
  </svg>
);
export const LargeLetter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    strokeLinejoin="round"
    strokeLinecap="round"
    strokeWidth={0.75}
    stroke="#FFF"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0.5 0.5 6 6"
    {...props}
  >
    <path d="M1 1v5h5" />
  </svg>
);