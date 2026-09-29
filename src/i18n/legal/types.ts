/**
 * Legal documents as data. Text blocks may contain "{placeholders}" (filled
 * from site.ts), "[label](/path)" links, and bare URLs / e-mail addresses,
 * which the page turns into links. The operator and hosting details are
 * rendered from site.ts by the "operator" / "hosting" blocks.
 */
export type LegalBlock = string | { list: string[] } | { details: "operator" | "hosting" };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  intro: string;
  sections: LegalSection[];
}

export interface LegalDocs {
  terms: LegalDoc;
  privacy: LegalDoc;
  labels: {
    name: string;
    address: string;
    email: string;
    registration: string;
    taxNumber: string;
    web: string;
  };
}
