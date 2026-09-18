import { ImageResponse } from "next/og";

// iOS home-screen icon. Same brand mark as icon.tsx, rendered larger without
// rounding (iOS applies its own mask).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F766E",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 124,
            height: 124,
            borderRadius: 9999,
            border: "14px solid #FFFFFF",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 9999,
              border: "14px solid #FFFFFF",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 9999,
                background: "#FFFFFF",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
