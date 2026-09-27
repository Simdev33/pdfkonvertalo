/**
 * Document building blocks on top of pdf-lib (@cantoo/pdf-lib fork, which can
 * also decrypt protected files). Everything in here is environment agnostic
 * so it can be unit tested in Node.
 */
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFObjectCopier,
  PDFPage,
  PDFRef,
  PDFString,
  clip,
  concatTransformationMatrix,
  degrees,
  drawObject,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  type PDFObject,
  type PDFPageLeaf,
} from "@cantoo/pdf-lib";

const Name = {
  A: PDFName.of("A"),
  Annots: PDFName.of("Annots"),
  B: PDFName.of("B"),
  D: PDFName.of("D"),
  Dest: PDFName.of("Dest"),
  Dests: PDFName.of("Dests"),
  GoTo: PDFName.of("GoTo"),
  Kids: PDFName.of("Kids"),
  Lang: PDFName.of("Lang"),
  Link: PDFName.of("Link"),
  Names: PDFName.of("Names"),
  S: PDFName.of("S"),
  Subtype: PDFName.of("Subtype"),
};

export interface LoadSourceOptions {
  password?: string;
}

/** Loads (and if needed decrypts) the source document and prepares it for copying. */
export async function loadSource(bytes: Uint8Array, options: LoadSourceOptions = {}) {
  const doc = await PDFDocument.load(bytes, {
    password: options.password ?? "",
    updateMetadata: false,
    throwOnInvalidObject: false,
  });
  try {
    resolveNamedDestinations(doc);
  } catch {
    // Best effort only – links are a nicety, never a reason to fail.
  }
  return doc;
}

export interface OutputMeta {
  title: string;
  producer: string;
}

/** Creates an empty output document that inherits the source's descriptive metadata. */
export async function createOutput(src: PDFDocument | null, meta: OutputMeta) {
  const doc = await PDFDocument.create({ updateMetadata: true });
  doc.setTitle(meta.title);
  doc.setProducer(meta.producer);
  doc.setCreator(meta.producer);
  if (src) {
    try {
      const author = src.getAuthor();
      if (author) doc.setAuthor(author);
      const subject = src.getSubject();
      if (subject) doc.setSubject(subject);
      const keywords = src.getKeywords();
      if (keywords) doc.setKeywords([keywords]);
      const lang = src.catalog.lookup(Name.Lang);
      if (lang instanceof PDFString || lang instanceof PDFHexString) doc.setLanguage(lang.decodeText());
    } catch {
      // Malformed Info dictionaries are surprisingly common; metadata is optional.
    }
  }
  return doc;
}

export function saveOutput(doc: PDFDocument) {
  return doc.save({ useObjectStreams: true, addDefaultPage: false });
}

/* -------------------------------------------------------------------------- */
/*                                Page copying                                */
/* -------------------------------------------------------------------------- */

type CopierInternals = { traversedObjects?: unknown };

/**
 * Copies pages like `PDFDocument.copyPages`, but
 *  - references to the copied pages (link targets, /P entries) point at the
 *    real copies instead of detached duplicates, so internal links keep working;
 *  - references to pages that are *not* copied are cut off, so a table of
 *    contents does not drag the content of the whole source file along.
 * The returned pages are not yet added to `dest`.
 */
export function copyPages(src: PDFDocument, dest: PDFDocument, indices: readonly number[]): PDFPage[] {
  const copier = PDFObjectCopier.for(src.context, dest.context);
  const traversed = (copier as unknown as CopierInternals).traversedObjects;
  const srcPages = src.getPages();
  const wanted = new Set(indices);
  const refs = new Map<number, PDFRef>();

  if (traversed instanceof Map && wanted.size === indices.length) {
    const map = traversed as Map<PDFObject, PDFObject>;
    // Deliberately never assigned: dangling references are read as null.
    const detached = dest.context.nextRef();
    srcPages.forEach((page, index) => {
      if (wanted.has(index)) {
        const ref = dest.context.nextRef();
        refs.set(index, ref);
        map.set(page.ref, ref);
      } else {
        map.set(page.ref, detached);
      }
    });
  }

  return indices.map((index) => {
    const node = copier.copy(srcPages[index].node) as PDFPageLeaf;
    let ref = refs.get(index);
    if (ref) dest.context.assign(ref, node);
    else ref = dest.context.register(node);
    return PDFPage.of(node, ref, dest);
  });
}

/** Removes internal links whose target page is not part of `doc`. */
export function pruneDeadLinks(doc: PDFDocument) {
  const pages = doc.getPages();
  const pageRefs = new Set<PDFRef>(pages.map((page) => page.ref));

  for (const page of pages) {
    const node = page.node;
    // Article threads are not copied, so their beads would only dangle.
    node.delete(Name.B);
    const annots = node.lookup(Name.Annots);
    if (!(annots instanceof PDFArray)) continue;

    const kept: PDFObject[] = [];
    for (let i = 0; i < annots.size(); i++) {
      const annot = safeLookup(annots, i);
      if (annot instanceof PDFDict && isDeadLink(annot, pageRefs)) continue;
      kept.push(annots.get(i));
    }
    if (kept.length !== annots.size()) {
      if (kept.length) node.set(Name.Annots, doc.context.obj(kept));
      else node.delete(Name.Annots);
    }
  }
}

function isDeadLink(annot: PDFDict, pageRefs: ReadonlySet<PDFRef>) {
  if (annot.lookup(Name.Subtype) !== Name.Link) return false;
  const target = linkTarget(annot);
  if (target === undefined) return false; // URI, Launch, JavaScript… – not ours to judge
  if (target instanceof PDFArray) {
    const page = target.get(0);
    return page instanceof PDFRef ? !pageRefs.has(page) : false;
  }
  // Named destinations cannot be resolved without the source catalog.
  return true;
}

function linkTarget(annot: PDFDict): PDFObject | null | undefined {
  const dest = safeLookup(annot, Name.Dest);
  if (dest) return dest;
  const action = safeLookup(annot, Name.A);
  if (action instanceof PDFDict && action.lookup(Name.S) === Name.GoTo) return safeLookup(action, Name.D) ?? null;
  return undefined;
}

function safeLookup(container: PDFDict | PDFArray, key: PDFName | number): PDFObject | undefined {
  try {
    return container instanceof PDFArray ? container.lookup(key as number) : container.lookup(key as PDFName);
  } catch {
    return undefined;
  }
}

/**
 * Rewrites links that use named destinations into explicit ones. Named
 * destinations live in the document catalog, which is not copied, so without
 * this they would all break after splitting.
 */
export function resolveNamedDestinations(doc: PDFDocument) {
  const table = namedDestinationTable(doc);
  if (table.size === 0) return;

  const resolve = (value: PDFObject | undefined) => {
    if (value instanceof PDFName) return table.get(value.decodeText());
    if (value instanceof PDFString || value instanceof PDFHexString) return table.get(value.decodeText());
    return undefined;
  };

  for (const page of doc.getPages()) {
    const annots = safeLookup(page.node, Name.Annots);
    if (!(annots instanceof PDFArray)) continue;
    for (let i = 0; i < annots.size(); i++) {
      const annot = safeLookup(annots, i);
      if (!(annot instanceof PDFDict) || annot.lookup(Name.Subtype) !== Name.Link) continue;
      const explicit = resolve(safeLookup(annot, Name.Dest));
      if (explicit) annot.set(Name.Dest, explicit);
      const action = safeLookup(annot, Name.A);
      if (action instanceof PDFDict && action.lookup(Name.S) === Name.GoTo) {
        const target = resolve(safeLookup(action, Name.D));
        if (target) action.set(Name.D, target);
      }
    }
  }
}

function namedDestinationTable(doc: PDFDocument) {
  const table = new Map<string, PDFArray>();
  const explicit = (value: PDFObject | undefined): PDFArray | undefined => {
    const resolved = value instanceof PDFRef ? doc.context.lookup(value) : value;
    if (resolved instanceof PDFArray) return resolved;
    if (resolved instanceof PDFDict) {
      const d = safeLookup(resolved, Name.D);
      return d instanceof PDFArray ? d : undefined;
    }
    return undefined;
  };

  // PDF 1.1 style: /Dests dictionary in the catalog.
  const dests = safeLookup(doc.catalog, Name.Dests);
  if (dests instanceof PDFDict) {
    for (const [key, value] of dests.entries()) {
      const dest = explicit(value);
      if (dest) table.set(key.decodeText(), dest);
    }
  }

  // PDF 1.2+ style: name tree under /Names /Dests.
  const names = safeLookup(doc.catalog, Name.Names);
  const root = names instanceof PDFDict ? safeLookup(names, Name.Dests) : undefined;
  if (root instanceof PDFDict) {
    const visited = new Set<PDFDict>();
    const walk = (node: PDFDict, depth: number) => {
      if (visited.has(node) || depth > 32) return;
      visited.add(node);
      const pairs = safeLookup(node, Name.Names);
      if (pairs instanceof PDFArray) {
        for (let i = 0; i + 1 < pairs.size(); i += 2) {
          const key = safeLookup(pairs, i);
          const dest = explicit(pairs.get(i + 1));
          if ((key instanceof PDFString || key instanceof PDFHexString) && dest) table.set(key.decodeText(), dest);
        }
      }
      const kids = safeLookup(node, Name.Kids);
      if (kids instanceof PDFArray) {
        for (let i = 0; i < kids.size(); i++) {
          const kid = safeLookup(kids, i);
          if (kid instanceof PDFDict) walk(kid, depth + 1);
        }
      }
    };
    walk(root, 0);
  }
  return table;
}


/* -------------------------------------------------------------------------- */
/*                                   Images                                   */
/* -------------------------------------------------------------------------- */

export interface RasterImage {
  /** RGBA pixels, row by row (as returned by `CanvasRenderingContext2D.getImageData`). */
  data: Uint8ClampedArray | Uint8Array;
  width: number;
  height: number;
}

/**
 * Embeds raw pixels losslessly (Flate). Transparent pixels are composited onto
 * white; pure greyscale content (scans, text, QR codes) is stored as
 * DeviceGray, which is three times smaller.
 */
export function embedPixels(doc: PDFDocument, image: RasterImage): PDFRef {
  const { data, width, height } = image;
  const pixels = width * height;

  let gray = true;
  for (let i = 0; i < pixels * 4; i += 4) {
    if (data[i] !== data[i + 1] || data[i] !== data[i + 2]) {
      gray = false;
      break;
    }
  }

  const channels = gray ? 1 : 3;
  const samples = new Uint8Array(pixels * channels);
  for (let p = 0, s = 0, i = 0; p < pixels; p++, i += 4) {
    const alpha = data[i + 3] / 255;
    const over = 255 * (1 - alpha);
    samples[s++] = Math.round(data[i] * alpha + over);
    if (!gray) {
      samples[s++] = Math.round(data[i + 1] * alpha + over);
      samples[s++] = Math.round(data[i + 2] * alpha + over);
    }
  }

  const stream = doc.context.flateStream(samples, {
    Type: "XObject",
    Subtype: "Image",
    Width: width,
    Height: height,
    ColorSpace: gray ? "DeviceGray" : "DeviceRGB",
    BitsPerComponent: 8,
  });
  return doc.context.register(stream);
}

export type Matrix = [number, number, number, number, number, number];

/** Draws an image XObject with an arbitrary transformation, optionally clipped to a rectangle. */
export function drawImage(page: PDFPage, image: PDFRef, matrix: Matrix, clipRect?: { x: number; y: number; width: number; height: number }) {
  const name = page.node.newXObject("Im", image);
  page.pushOperators(
    pushGraphicsState(),
    ...(clipRect ? [rectangle(clipRect.x, clipRect.y, clipRect.width, clipRect.height), clip(), endPath()] : []),
    concatTransformationMatrix(...matrix),
    drawObject(name),
    popGraphicsState(),
  );
}

/** Adds a page that consists of a single bitmap. */
export function addRasterPage(doc: PDFDocument, image: RasterImage, widthPt: number, heightPt: number) {
  const page = doc.addPage([widthPt, heightPt]);
  drawImage(page, embedPixels(doc, image), [widthPt, 0, 0, heightPt, 0, 0]);
  return page;
}

/** Rotates a page clockwise on top of its current /Rotate. */
export function rotatePage(page: PDFPage, clockwise: number) {
  if (!clockwise) return;
  const current = page.getRotation().angle;
  page.setRotation(degrees((((current + clockwise) % 360) + 360) % 360));
}
