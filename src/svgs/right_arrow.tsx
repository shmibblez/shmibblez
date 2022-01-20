import * as React from "react";

const RightArrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 3 4"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="#fff"
    strokeWidth={0.4}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="m1 1 1 1-1 1" />
  </svg>
);

export default RightArrow;