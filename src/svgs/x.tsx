import * as React from "react";

const X = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 10 10"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="#fff"
    strokeWidth={1}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="m1 1 8 8m0-8L1 9" />
  </svg>
);

export default X;