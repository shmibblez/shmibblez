import * as React from "react";

// shmibblez text logo, good enough for now
// aspect ratio: 49:5
const ShmibblezTextLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    strokeLinejoin="round"
    strokeLinecap="round"
    strokeWidth={0.55}
    stroke="#FFF"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 49 5"
    {...props}
  >
    <path d="M.5 4.5h4l-4-4h4m2 0v4m0-2h4m0 2v-4m2 4v-4l2 2 2-2v4m2 0v-4m2 0v4h2l2-1-2-1 2-1-2-1h-2m0 2h2m4-2v4h2l2-1-2-1 2-1-2-1h-2m0 2h2m4-2v4h4m2-2h4m0 2h-4v-4h4m2 0h4l-4 4h4" />
  </svg>
);

export default ShmibblezTextLogo;