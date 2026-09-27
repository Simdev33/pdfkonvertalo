import type { FontStyle } from "./text-model";
import type { FontSource } from "./text-pdf";

/** Noto fonts served from /public/fonts (copied there by scripts/copy-assets.mjs). */
export const FONT_FILES: Record<FontStyle, string> = {
  regular: "NotoSans-Regular.ttf",
  bold: "NotoSans-Bold.ttf",
  italic: "NotoSans-Italic.ttf",
  mono: "NotoSansMono-Regular.ttf",
};

const cache = new Map<FontStyle, Promise<Uint8Array>>();

export const browserFonts: FontSource = (style) => {
  let font = cache.get(style);
  if (!font) {
    font = fetch(`/fonts/${FONT_FILES[style]}`)
      .then((response) => {
        if (!response.ok) throw new Error("A betűtípus nem tölthető be. Ellenőrizd az internetkapcsolatot.");
        return response.arrayBuffer();
      })
      .then((buffer) => new Uint8Array(buffer));
    font.catch(() => cache.delete(style));
    cache.set(style, font);
  }
  return font;
};
