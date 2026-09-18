import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ace the PMP",
    short_name: "Ace PMP",
    description:
      "Free adaptive PMP preparation with original questions, a realistic exam simulator, and a readiness score aligned to the 2026 PMI Examination Content Outline.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#0F766E",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
