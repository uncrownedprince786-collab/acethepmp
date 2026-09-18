import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F766E 0%, #1E3A8A 100%)",
          fontFamily: "Inter, sans-serif",
          color: "#fff",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          Ace the PMP
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "#F59E0B",
            marginBottom: 40,
          }}
        >
          Free Adaptive PMP Exam Preparation
        </div>
        <div
          style={{
            display: "flex",
            gap: "40px",
            fontSize: 22,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <span>130+ Original Questions</span>
          <span style={{ color: "#F59E0B" }}>|</span>
          <span>Realistic Simulator</span>
          <span style={{ color: "#F59E0B" }}>|</span>
          <span>2026 ECO Aligned</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
