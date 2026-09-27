// Copies runtime assets from node_modules into /public so the browser can load
// them from our own origin:
//  - the pdf.js worker and its data (CMaps, standard fonts, wasm decoders, ICC
//    profiles) into a versioned folder, so it can be cached forever and always
//    matches the bundled pdf.js API version;
//  - the Noto fonts used when converting text files to PDF.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function packageDir(name) {
  try {
    return dirname(require.resolve(`${name}/package.json`));
  } catch {
    return null;
  }
}

/* --------------------------------- pdf.js --------------------------------- */

const pdfjsDir = packageDir("pdfjs-dist");
if (pdfjsDir) {
  const { version } = JSON.parse(readFileSync(join(pdfjsDir, "package.json"), "utf8"));
  const publicDir = join(root, "public", "pdfjs");
  const target = join(publicDir, version);
  const marker = join(target, "pdf.worker.min.mjs");

  if (!existsSync(marker)) {
    // Drop assets of other pdf.js versions.
    if (existsSync(publicDir)) {
      for (const entry of readdirSync(publicDir)) rmSync(join(publicDir, entry), { recursive: true, force: true });
    }
    mkdirSync(target, { recursive: true });
    for (const dir of ["cmaps", "standard_fonts", "wasm", "iccs"]) {
      const from = join(pdfjsDir, dir);
      if (existsSync(from)) cpSync(from, join(target, dir), { recursive: true });
    }
    // Copy the worker last: its presence marks a complete copy.
    cpSync(join(pdfjsDir, "legacy", "build", "pdf.worker.min.mjs"), marker);
    console.log(`[assets] pdf.js v${version} copied to public/pdfjs/${version}`);
  }
} else {
  console.warn("[assets] pdfjs-dist is not installed yet – skipping.");
}

/* ---------------------------------- fonts --------------------------------- */

const FONTS = [
  ["@expo-google-fonts/noto-sans", "400Regular/NotoSans_400Regular.ttf", "NotoSans-Regular.ttf"],
  ["@expo-google-fonts/noto-sans", "700Bold/NotoSans_700Bold.ttf", "NotoSans-Bold.ttf"],
  ["@expo-google-fonts/noto-sans", "400Regular_Italic/NotoSans_400Regular_Italic.ttf", "NotoSans-Italic.ttf"],
  ["@expo-google-fonts/noto-sans-mono", "400Regular/NotoSansMono_400Regular.ttf", "NotoSansMono-Regular.ttf"],
  ["@expo-google-fonts/noto-sans-mono", "700Bold/NotoSansMono_700Bold.ttf", "NotoSansMono-Bold.ttf"],
];

const fontDir = join(root, "public", "fonts");
mkdirSync(fontDir, { recursive: true });
for (const [pkg, file, name] of FONTS) {
  const dir = packageDir(pkg);
  const target = join(fontDir, name);
  if (!dir || existsSync(target)) continue;
  cpSync(join(dir, file), target);
  console.log(`[assets] font ${name} copied to public/fonts`);
}
