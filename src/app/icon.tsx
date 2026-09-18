import { ImageResponse } from "next/og";

// Browser tab / PWA icon. Mirrors the in-app Logo mark: a teal rounded square
// with a white bullseye (Target) so the favicon matches the brand.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: 9999,
            border: "5px solid #FFFFFF",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              height: 20,
              borderRadius: 9999,
              border: "5px solid #FFFFFF",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
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
