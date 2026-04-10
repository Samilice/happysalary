import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1D3557",
          borderRadius: 36,
          fontFamily: "sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 100,
            fontWeight: 900,
            letterSpacing: -4,
            display: "flex",
          }}
        >
          <span style={{ color: "#FFFFFF" }}>H</span>
          <span style={{ color: "#E63946" }}>S</span>
        </span>
      </div>
    ),
    { ...size }
  );
}
