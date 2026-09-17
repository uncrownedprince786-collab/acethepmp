import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The macOS/Home user folder also contains a package-lock.json; pin the
  // project root so Next.js does not treat the whole user directory as a
  // workspace.
  outputFileTracingRoot: path.join(import.meta.dirname),
};

export default nextConfig;
