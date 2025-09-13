import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allowing images from external domains:
  images: {
    // domains: ['img.freepik.com'],
    remotePatterns: [
      new URL('https://img.freepik.com/free-vector/hand-drawn-404-error_23-2147746234.jpg?semt=ais_incoming&w=740&q=80'), 
      new URL('https://static.vecteezy.com/system/resources/previews/008/255/803/non_2x/page-not-found-error-404-system-updates-uploading-computing-operation-installation-programs-system-maintenance-a-hand-drawn-layout-template-of-a-broken-robot-illustration-vector.jpg')


    ]//'https://img.freepik.com/*')]
  },
};

export default nextConfig;
