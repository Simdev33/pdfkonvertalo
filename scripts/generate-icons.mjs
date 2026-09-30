/**
 * Builds the raster icons from src/app/icon.svg (run `npm run icons` after
 * changing it): favicon.ico (16/32/48) for old browsers and the /favicon.ico
 * probe, apple-icon.png (full-bleed, iOS rounds it itself) and the web
 * manifest icons. Uses sharp, which Next.js already installs.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const svg = await readFile(`${root}src/app/icon.svg`, "utf8");
const fullBleed = svg.replace(/(<rect\b[^>]*?)\s+rx="[^"]*"/, "$1");

const png = (source, size) =>
  sharp(Buffer.from(source), { density: Math.ceil((72 * size * 4) / 64) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

/** An .ico file holding PNG images (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + 16 * index;
    header.writeUInt8(size >= 256 ? 0 : size, entry);
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

const favicon = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(svg, size) })));
await writeFile(`${root}src/app/favicon.ico`, ico(favicon));
await writeFile(`${root}src/app/apple-icon.png`, await png(fullBleed, 180));
await writeFile(`${root}public/icon-192.png`, await png(svg, 192));
await writeFile(`${root}public/icon-512.png`, await png(svg, 512));
console.log("icons: favicon.ico, apple-icon.png, icon-192.png, icon-512.png");
