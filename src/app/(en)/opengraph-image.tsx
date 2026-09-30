import { OG_SIZE, ogAlt, renderOgImage } from "@/components/og-image";

export const alt = ogAlt("en");
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgImage("en");
}
