/**
 * Office documents (Word, Excel, PowerPoint) → PDF on the server. A browser
 * cannot lay these out the way Office does, so a real office suite does the
 * work, in this order:
 *  1. Gotenberg (LibreOffice in a container) when GOTENBERG_URL is set – on
 *     Vercel this is the internal service from /gotenberg (see vercel.json);
 *  2. a local LibreOffice (SOFFICE_PATH or the usual install locations);
 *  3. on Windows, Microsoft Word / Excel / PowerPoint through COM automation.
 * Uploaded files only live in a temporary folder until the PDF is ready.
 */
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { OFFICE_FORMATS, type OfficeApp, type OfficeFormat } from "@/lib/convert/formats";

export class OfficeError extends Error {
  constructor(
    message: string,
    readonly status = 422,
  ) {
    super(message);
    this.name = "OfficeError";
  }
}

type Engine = { kind: "gotenberg"; url: string } | { kind: "libreoffice"; path: string } | { kind: "msoffice"; app: OfficeApp };

const TIMEOUT_MS = 120_000;
/** Conversions wait in a queue; beyond this many the server says it is busy. */
const MAX_WAITING = 8;

const PASSWORD_MESSAGE = "A fájl jelszóval védett. Nyisd meg, vedd le róla a jelszót, és próbáld újra.";
const FAILED_MESSAGE = "Nem sikerült PDF-fé alakítani a fájlt. Lehet, hogy sérült vagy üres.";

interface RunError extends Error {
  killed?: boolean;
  stderr?: string;
}

function run(file: string, args: string[], timeout = TIMEOUT_MS) {
  return new Promise<void>((resolve, reject) => {
    execFile(file, args, { timeout, windowsHide: true, maxBuffer: 4 * 1024 * 1024 }, (error, _stdout, stderr) => {
      if (!error) return resolve();
      reject(Object.assign(error as RunError, { stderr: stderr?.toString().trim() }));
    });
  });
}

/* --------------------------------- engines -------------------------------- */

function findSoffice() {
  const configured = process.env.SOFFICE_PATH;
  if (configured) return existsSync(configured) ? configured : null;
  const candidates =
    process.platform === "win32"
      ? ["C:\\Program Files\\LibreOffice\\program\\soffice.exe", "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe"]
      : process.platform === "darwin"
        ? ["/Applications/LibreOffice.app/Contents/MacOS/soffice"]
        : ["/usr/bin/soffice", "/usr/bin/libreoffice", "/usr/local/bin/soffice", "/opt/libreoffice/program/soffice", "/snap/bin/libreoffice"];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

const MS_OFFICE: Record<OfficeApp, { progId: string; process: string; name: string }> = {
  word: { progId: "Word.Application", process: "WINWORD", name: "Word" },
  excel: { progId: "Excel.Application", process: "EXCEL", name: "Excel" },
  powerpoint: { progId: "PowerPoint.Application", process: "POWERPNT", name: "PowerPoint" },
};

const installed = new Map<OfficeApp, Promise<boolean>>();

function hasMsOffice(app: OfficeApp) {
  if (process.platform !== "win32") return Promise.resolve(false);
  let check = installed.get(app);
  if (!check) {
    check = run("reg", ["query", `HKCR\\${MS_OFFICE[app].progId}\\CurVer`], 10_000).then(
      () => true,
      () => false,
    );
    installed.set(app, check);
  }
  return check;
}

async function findEngine(app: OfficeApp): Promise<Engine | null> {
  const gotenberg = process.env.GOTENBERG_URL?.trim();
  if (gotenberg) return { kind: "gotenberg", url: gotenberg };
  const soffice = findSoffice();
  if (soffice) return { kind: "libreoffice", path: soffice };
  return (await hasMsOffice(app)) ? { kind: "msoffice", app } : null;
}

/* ---------------------------------- queue --------------------------------- */

// LibreOffice shares one profile and Office is heavy: local conversions run one at a time.
let queue: Promise<unknown> = Promise.resolve();
let waiting = 0;

function serial<T>(job: () => Promise<T>): Promise<T> {
  if (waiting >= MAX_WAITING) throw new OfficeError("Most sokan konvertálnak egyszerre. Próbáld újra egy perc múlva.", 503);
  waiting++;
  const next = queue.then(job, job).finally(() => waiting--);
  queue = next.catch(() => undefined);
  return next;
}

/* -------------------------------- converters ------------------------------ */

/** Streams the PDF back: a streamed response is exempt from Vercel's 4.5 MB response limit. */
async function viaGotenberg(base: string, bytes: Uint8Array, ext: string) {
  const form = new FormData();
  form.append("files", new Blob([bytes as Uint8Array<ArrayBuffer>]), `dokumentum.${ext}`);
  // Relative to the base: a Vercel service binding URL may carry a path prefix.
  const url = new URL("forms/libreoffice/convert", base.endsWith("/") ? base : `${base}/`);
  const response = await fetch(url, { method: "POST", body: form, signal: AbortSignal.timeout(TIMEOUT_MS) }).catch((error: unknown) => {
    console.error("[office] Gotenberg unreachable", error);
    throw new OfficeError("A dokumentum-átalakító szolgáltatás most nem érhető el.", 503);
  });
  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    if (/password/i.test(detail)) throw new OfficeError(PASSWORD_MESSAGE);
    console.error("[office] Gotenberg", response.status, detail);
    throw new OfficeError(FAILED_MESSAGE);
  }
  return response.body;
}

function viaLibreOffice(soffice: string, input: string, dir: string) {
  // One persistent profile: a fresh one costs seconds on every conversion.
  const profile = pathToFileURL(path.join(os.tmpdir(), "pdf-konvertalo-soffice")).href;
  return run(soffice, [
    `-env:UserInstallation=${profile}`,
    "--headless",
    "--norestore",
    "--nolockcheck",
    "--convert-to",
    "pdf",
    "--outdir",
    dir,
    input,
  ]);
}

// Every script remembers the Office process it started (so it can be killed if
// it hangs), never runs macros, and opens files with a dummy password so a
// protected file throws instead of showing a dialog.
const START = (app: OfficeApp) => `
param([string]$In, [string]$Out, [string]$PidFile)
$ErrorActionPreference = 'Stop'
$before = @(Get-Process ${MS_OFFICE[app].process} -ErrorAction SilentlyContinue | ForEach-Object { $_.Id })
$app = New-Object -ComObject ${MS_OFFICE[app].progId}
$started = @(Get-Process ${MS_OFFICE[app].process} -ErrorAction SilentlyContinue | Where-Object { $before -notcontains $_.Id } | ForEach-Object { $_.Id })
if ($started.Count -eq 1) { Set-Content -LiteralPath $PidFile -Value $started[0] }
function Stop-Started { if ($started.Count -eq 1) { Stop-Process -Id $started[0] -Force -ErrorAction SilentlyContinue } }
`;

const RELEASE = `[void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($app)`;

const SCRIPTS: Record<OfficeApp, string> = {
  word: `${START("word")}
try {
  $app.Visible = $false
  $app.DisplayAlerts = 0
  $app.AutomationSecurity = 3
  $doc = $app.Documents.Open($In, $false, $true, $false, '__nincs_jelszo__')
  try { $doc.ExportAsFixedFormat($Out, 17) } finally { $doc.Close([ref]0) }
} finally {
  try { $app.Quit([ref]0) } catch { Stop-Started }
  ${RELEASE}
}
`,
  excel: `${START("excel")}
try {
  $app.Visible = $false
  $app.DisplayAlerts = $false
  $app.ScreenUpdating = $false
  $app.AskToUpdateLinks = $false
  $app.AutomationSecurity = 3
  $book = $app.Workbooks.Open($In, 0, $true, [System.Reflection.Missing]::Value, '__nincs_jelszo__')
  # The whole workbook: every visible sheet, with its own page setup.
  try { $book.ExportAsFixedFormat(0, $Out) } finally { $book.Close($false) }
} finally {
  try { $app.Quit() } catch { Stop-Started }
  ${RELEASE}
}
`,
  // PowerPoint runs as a single instance: if the user already had it open, we
  // borrowed theirs, so it is only closed when we started it and it is idle.
  powerpoint: `${START("powerpoint")}
try {
  $app.DisplayAlerts = 1
  $app.AutomationSecurity = 3
  # "file::password::" – read only, no window.
  $pres = $app.Presentations.Open("$($In)::__nincs_jelszo__::", -1, 0, 0)
  try { $pres.SaveAs($Out, 32) } finally { $pres.Close() }
} finally {
  if ($started.Count -eq 1 -and $app.Presentations.Count -eq 0) {
    try { $app.Quit() } catch { Stop-Started }
  }
  ${RELEASE}
}
`,
};

async function viaMsOffice(app: OfficeApp, input: string, output: string, dir: string) {
  const script = path.join(dir, "convert.ps1");
  const pidFile = path.join(dir, "office.pid");
  await writeFile(script, "\ufeff" + SCRIPTS[app], "utf8");
  try {
    await run("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", script, "-In", input, "-Out", output, "-PidFile", pidFile]);
  } catch (error) {
    if ((error as RunError).killed) {
      const pid = Number((await readFile(pidFile, "utf8").catch(() => "")).trim());
      if (pid > 0) await run("taskkill", ["/PID", String(pid), "/T", "/F"], 10_000).catch(() => undefined);
    }
    throw error;
  }
}

/* ---------------------------------- public -------------------------------- */

const utf16 = (text: string) => Buffer.from(text, "utf16le");

/** Encrypted DOCX/XLSX/PPTX files are OLE containers with an "EncryptedPackage" stream. */
function isEncryptedPackage(bytes: Uint8Array) {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).includes(utf16("EncryptedPackage"));
}

export async function officeToPdf(bytes: Uint8Array, format: OfficeFormat): Promise<ReadableStream<Uint8Array> | Uint8Array> {
  const { app, container } = OFFICE_FORMATS[format];
  if (container === "ooxml" && isEncryptedPackage(bytes)) throw new OfficeError(PASSWORD_MESSAGE);

  const engine = await findEngine(app);
  if (!engine) {
    throw new OfficeError(`Ezen a szerveren nincs átalakító ehhez a fájlhoz (LibreOffice, Gotenberg vagy Microsoft ${MS_OFFICE[app].name}).`, 501);
  }
  if (engine.kind === "gotenberg") return viaGotenberg(engine.url, bytes, format);

  return serial(async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "pdf-konvertalo-"));
    const input = path.join(dir, `dokumentum.${format}`);
    const output = path.join(dir, "dokumentum.pdf");
    try {
      await writeFile(input, bytes);
      if (engine.kind === "libreoffice") await viaLibreOffice(engine.path, input, dir);
      else await viaMsOffice(engine.app, input, output, dir);
      if (!existsSync(output)) throw new OfficeError(FAILED_MESSAGE);
      return new Uint8Array(await readFile(output));
    } catch (error) {
      if (error instanceof OfficeError) throw error;
      const { killed, stderr, message } = error as RunError;
      if (killed) throw new OfficeError("Túl sokáig tartott a fájl átalakítása.", 504);
      if (/password|jelsz/i.test(`${stderr} ${message}`)) throw new OfficeError(PASSWORD_MESSAGE);
      console.error(`[office] ${engine.kind === "msoffice" ? MS_OFFICE[engine.app].name : engine.kind} failed`, stderr || message);
      throw new OfficeError(FAILED_MESSAGE);
    } finally {
      await rm(dir, { recursive: true, force: true }).catch(() => undefined);
    }
  });
}
