import * as React from "react";

// shmibblez logo, good enough for now
// aspect ratio: 123.244:122
const Shmibblogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-1 -1 123.244 122"
    fill="none"
    stroke="#FFF"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.25}
    {...props}

  >
    <path d="M34.641 45v20m0-10-17.32-10m8.66 5 17.32-10m0 0v30m0 0 8.661 5m0 0L34.641 85m0-10v20m0 0 8.66-5m0 0v10m0 0-17.32 10m0 0V70m0 0 17.32 10m-17.32 30-8.66-5m0 0V65m0 0L0 55m0 0V45m0 0 34.641 20m-17.32-20 25.98-15m0 0-8.66-5m0 0L0 45m43.301 25 8.661-5m0 0 8.66 5m0 0 8.66-5m0 0 8.66 5m0 0-25.98 15m0 0 17.32 10m0 0v10m0 0L43.301 90m0 10 34.641 20m0 0V80m0 0-17.32 10m8.66 5V85m8.66-15V60m0 0 17.321 10m-8.66-5v20m0-10 17.32-10m0 0-8.66-5m0 0 8.66-5m0 0 17.321 10m0 0L86.603 85m-8.661 35 8.661-5m0 0V95m0 0 34.641-20m0 0V65m-25.981-5V30m0 0L77.942 40m8.661-5v20m0 0L60.622 40m0 0v10m0 0 8.66 5m0 0v10m17.321-20L69.282 35m0 0 34.641-20m0 0v40m0-40-8.66-5m0 0L77.942 20m0 0L43.301 0m0 0-8.66 5m0 0v20m8.66 5V20m0 0 17.321 10m-8.66-5v20m0 0 8.66-5m0 10-8.66 5m0 0v10m0-30 17.32-10m0 0L34.641 5" />
  </svg>
);

export default Shmibblogo;