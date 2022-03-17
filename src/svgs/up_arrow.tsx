import * as React from "react";

const UpArrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 12 7"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="#fff"
    strokeWidth={2}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="m1 6 5-5 5 5" />
  </svg>
);

export default UpArrow;