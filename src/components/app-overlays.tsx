"use client";

import { DropOverlay } from "./overlays/drop-overlay";
import { JobOverlay } from "./overlays/job-overlay";
import { PasswordDialog } from "./overlays/password-dialog";
import { ResultsDialog } from "./overlays/results-dialog";
import { Toaster } from "./overlays/toaster";

/** Dialogs and overlays shared by every tool. */
export function AppOverlays() {
  return (
    <>
      <DropOverlay />
      <PasswordDialog />
      <JobOverlay />
      <ResultsDialog />
      <Toaster />
    </>
  );
}
