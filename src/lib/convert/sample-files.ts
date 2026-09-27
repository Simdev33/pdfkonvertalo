/**
 * Demo inputs generated on the fly, so visitors (and tests) can try the
 * converter without having files at hand.
 */
import { canvasToBlob } from "@/lib/pdf/pdfjs";

function canvas(width: number, height: number) {
  const element = document.createElement("canvas");
  element.width = width;
  element.height = height;
  return [element, element.getContext("2d")!] as const;
}

async function landscapePhoto() {
  const [element, ctx] = canvas(1600, 1000);
  const sky = ctx.createLinearGradient(0, 0, 0, 1000);
  sky.addColorStop(0, "#1e3a8a");
  sky.addColorStop(0.55, "#f97316");
  sky.addColorStop(1, "#fde68a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1600, 1000);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(1180, 560, 90, 0, Math.PI * 2);
  ctx.fill();
  const ridge = (color: string, base: number, amplitude: number, seed: number) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 1000);
    for (let x = 0; x <= 1600; x += 20) ctx.lineTo(x, base - Math.sin(x / 170 + seed) * amplitude - Math.sin(x / 61 + seed * 2) * amplitude * 0.3);
    ctx.lineTo(1600, 1000);
    ctx.fill();
  };
  ridge("#7c2d12", 700, 90, 1);
  ridge("#431407", 800, 70, 3);
  ridge("#1c0a03", 900, 40, 5);
  ctx.fillStyle = "#fff";
  ctx.font = "600 64px system-ui, sans-serif";
  ctx.fillText("Balaton, naplemente", 70, 130);
  return new File([await canvasToBlob(element, "image/jpeg", 0.9)], "naplemente.jpg", { type: "image/jpeg" });
}

async function transparentChart() {
  const [element, ctx] = canvas(1200, 900);
  const values = [42, 68, 55, 91, 77, 60];
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9"];
  ctx.fillStyle = "#111827";
  ctx.font = "600 52px system-ui, sans-serif";
  ctx.fillText("Negyedéves bevétel", 80, 110);
  values.forEach((value, i) => {
    const x = 110 + i * 170;
    const height = value * 6.5;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.roundRect(x, 800 - height, 110, height, 14);
    ctx.fill();
    ctx.fillStyle = "#374151";
    ctx.font = "500 34px system-ui, sans-serif";
    ctx.fillText(`${value}`, x + 28, 780 - height);
  });
  ctx.fillStyle = "#9ca3af";
  ctx.fillRect(80, 804, 1040, 4);
  return new File([await canvasToBlob(element, "image/png")], "grafikon-atlatszo.png", { type: "image/png" });
}

async function portrait() {
  const [element, ctx] = canvas(900, 1300);
  const gradient = ctx.createRadialGradient(450, 500, 50, 450, 650, 800);
  gradient.addColorStop(0, "#a7f3d0");
  gradient.addColorStop(1, "#065f46");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 900, 1300);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.ellipse(450, 620, 60, 260, (i * Math.PI) / 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#fde047";
  ctx.beginPath();
  ctx.arc(450, 620, 80, 0, Math.PI * 2);
  ctx.fill();
  const webp = await canvasToBlob(element, "image/webp", 0.9);
  const isWebp = webp.type === "image/webp";
  return new File([webp], isWebp ? "virag.webp" : "virag.png", { type: webp.type });
}

const MARKDOWN = `# Projektjegyzet

Ez a fájl **Markdown** formátumú. A PDF Konvertáló megtartja a címsorokat, a *kiemeléseket*, a \`kódot\` és a [hivatkozásokat](https://example.com).

## Teendők

- Árajánlat összeállítása
- Szerződés véglegesítése
  - jogi átnézés
  - aláírás
- Számla kiküldése

> A legjobb PDF az, amit nem kell kétszer elkészíteni.

## Költségek

| Tétel | Mennyiség | Ár |
|---|---:|---:|
| Tervezés | 12 óra | 180 000 Ft |
| Fejlesztés | 40 óra | 600 000 Ft |
| Tesztelés | 8 óra | 96 000 Ft |

\`\`\`json
{ "projekt": "PDF Konvertáló", "állapot": "kész" }
\`\`\`
`;

function priceList() {
  const products = ["Nyomtatópapír A4", "Tűzőgép", "Golyóstoll (kék)", "Iratrendező", "Post-it jegyzettömb", "Radír", "Vonalzó 30 cm", "Füzet A5"];
  const rows = ["Cikkszám;Megnevezés;Mennyiség;Egységár;Összesen"];
  for (let i = 0; i < 36; i++) {
    const quantity = ((i * 7) % 12) + 1;
    const price = 190 + ((i * 331) % 4800);
    rows.push(`KT-${String(1000 + i * 13)};${products[i % products.length]};${quantity} db;${price.toLocaleString("hu-HU")} Ft;${(price * quantity).toLocaleString("hu-HU")} Ft`);
  }
  return rows.join("\r\n");
}

export async function createSampleFiles(): Promise<File[]> {
  const [photo, chart, flower] = await Promise.all([landscapePhoto(), transparentChart(), portrait()]);
  return [
    photo,
    flower,
    chart,
    new File([MARKDOWN], "projektjegyzet.md", { type: "text/markdown" }),
    new File([priceList()], "arlista.csv", { type: "text/csv" }),
  ];
}
