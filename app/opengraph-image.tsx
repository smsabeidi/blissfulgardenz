import { ImageResponse } from "next/og";

// Interim brand OG card (FR-30). Uses system serif until the licensed display
// face ships in the asset pipeline; swap is a one-line change.
export const alt = "Blissful Gardenz. Harmony on the horizon.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "linear-gradient(to bottom, #F2EAD6 0%, #F6E9C9 40%, #ECDBA8 62%, #F7F4EC 100%)",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Sun on the horizon */}
        <div
          style={{
            position: "absolute",
            top: 268,
            left: 510,
            width: 180,
            height: 90,
            borderTopLeftRadius: 180,
            borderTopRightRadius: 180,
            background: "#C9A227",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 356,
            left: 80,
            width: 1040,
            height: 3,
            background: "#C9A227",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 404,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 64, color: "#0F2E22", fontWeight: 600, display: "flex" }}>
            Blissful Gardenz
          </div>
          <div style={{ fontSize: 30, color: "#56675C", fontStyle: "italic", display: "flex" }}>
            Harmony on the horizon.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
