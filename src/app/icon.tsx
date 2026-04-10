import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1D3557",
          borderRadius: 7,
          fontFamily: "sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: -1,
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
