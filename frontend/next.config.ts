import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // build a small self-contained server for Docker
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;

// standalone makes npm run build produce a folder with a server.js and only the packages the server actually uses. 
// That’s how 690 MB becomes about 68 MB.