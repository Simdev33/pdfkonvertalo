import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} – ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FORMATS = ["JPG", "PNG", "HEIC", "DOCX", "XLSX", "PPTX", "TXT"];

export default async function OpenGraphImage() {
  // Noto Sans has the Hungarian double acute letters (ő, ű) the default font lacks.
  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), "public", "fonts", "NotoSans-Bold.ttf")),
    readFile(join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 20% 0%, #2e2a7a 0%, #0b0c10 60%)",
          color: "#f1f2f4",
          fontFamily: "Noto Sans",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6d66f6, #4338ca)",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5" />
              <path d="M9 14.5h6M12.5 12l2.5 2.5-2.5 2.5" />
            </svg>
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{site.name}</div>
          <div style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 999, background: "rgba(60, 207, 120, 0.14)", color: "#7ee2a8", fontSize: 24 }}>
            regisztráció és vízjel nélkül
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>Képekből és fájlokból</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#a5a1ff" }}>profi PDF, pillanatok alatt.</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {FORMATS.map((format) => (
            <div key={format} style={{ padding: "8px 18px", borderRadius: 999, border: "2px solid #353843", fontSize: 26, color: "#c9ccd4" }}>
              {format}
            </div>
          ))}
          <div style={{ fontSize: 30, color: "#6f7480", margin: "0 6px" }}>→</div>
          <div style={{ padding: "8px 22px", borderRadius: 999, background: "#6c66f4", fontSize: 26, fontWeight: 700 }}>PDF</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Noto Sans", data: bold, weight: 700, style: "normal" },
        { name: "Noto Sans", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
