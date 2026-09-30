export const site = {
  name: "ConvertPDFNow",
  /** Canonical origin for metadata, hreflang and the sitemap; on Vercel it defaults to the production domain. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),

  /**
   * The operator shown in the Terms and the Privacy Policy. Empty fields are
   * rendered as a highlighted "to be completed" marker; registration and tax
   * number are optional and hidden when empty.
   */
  operator: {
    name: "TourCierge s. r. o.",
    address: "Karpatské námestie 10A, 831 06 Bratislava – mestská časť Rača, Slovenská republika",
    email: "",
    registration: "IČO 57383898 · Obchodný register Mestského súdu Bratislava III, oddiel Sro, vložka č. 194953/B",
    taxNumber: "DIČ 2122693199",
  },

  /** Hosting provider and data processor (Vercel runs the site and the Office converter). */
  hosting: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
    web: "https://vercel.com",
  },

  /** Effective date of the current Terms and Privacy Policy. */
  legalEffective: "2026-09-30",
} as const;
