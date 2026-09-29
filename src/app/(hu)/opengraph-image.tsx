import { OG_SIZE, ogAlt, renderOgImage } from "@/components/og-image";

export const alt = ogAlt("hu");
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgImage("hu");
}
