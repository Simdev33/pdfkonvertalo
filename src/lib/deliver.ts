/**
 * The paywall: finished files are handed over only with an active
 * subscription, otherwise the payment page opens with them. Conversion itself
 * stays free and local, so this check runs in the browser – the server only
 * tells whether the visitor has access. Office documents are the exception:
 * the server converts them in full for subscribers only (see /api/office-to-pdf),
 * so such results are made again once paid.
 */
import { t } from "@/i18n/runtime";
import { createZip, downloadBlob } from "@/lib/files";
import { loadAccount } from "@/lib/account";
import { clearPending, savePending } from "@/lib/pending-result";
import { setPaywall, setResult, toast, type ConversionSource, type PaywallState, type ResultState } from "@/lib/store";
import { isAbortError } from "@/lib/utils";

/** `source` is given when office documents are in the result only with their first page. */
export async function deliver(result: ResultState, source?: ConversionSource) {
  const account = await loadAccount().catch(() => null);
  if (account?.access?.active) {
    setResult(source ? await (await import("@/lib/converter")).convertInFull(source) : result);
    return;
  }
  const expiresAt = await savePending({ result, source });
  setPaywall({ result, source, expiresAt });
}

/** After payment: show the files and start the download right away. */
export async function releaseResult({ result, source }: Pick<PaywallState, "result" | "source">) {
  setPaywall(null);
  if (source) {
    const converter = await import("@/lib/converter");
    try {
      result = await converter.convertInFull(source);
    } catch (error) {
      // Paid, but the full version could not be made: the inputs go back to the workspace for another try.
      converter.restoreWorkspace(source);
      toast(isAbortError(error) ? t().convert.cancelled : converter.describeError(error), "error");
      void clearPending();
      return;
    }
  }
  setResult(result);
  void clearPending();
  const [first] = result.files;
  if (result.files.length === 1) downloadBlob(first.blob, first.name);
  else if (result.files.length > 1) downloadBlob(await createZip(result.files), result.archiveName);
}
