import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0b1220 0%, #0f172a 55%, #0b1220 100%)",
        color: "#f8fafc",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: 80,
          borderRadius: 36,
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(148, 163, 184, 0.25)",
          boxShadow: "0 30px 80px rgba(2, 6, 23, 0.45)",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -1 }}>
          BNSSA QCM
        </div>
        <div style={{ fontSize: 30, opacity: 0.82 }}>
          Preparation examen · 4 QCM · Mode examen
        </div>
        <div
          style={{
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#a7f3d0",
          }}
        >
          Formation BNSSA
        </div>
      </div>
    </div>,
    size,
  );
}
