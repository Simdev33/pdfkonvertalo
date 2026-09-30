"use client";

import dynamic from "next/dynamic";
import { useApp } from "@/lib/store";
import { DropOverlay } from "./overlays/drop-overlay";
import { JobOverlay } from "./overlays/job-overlay";
import { PasswordDialog } from "./overlays/password-dialog";
import { ResultsDialog } from "./overlays/results-dialog";
import { Toaster } from "./overlays/toaster";
import { CheckoutReturn } from "./paywall/checkout-return";

// Stripe.js and the payment page load only when a download needs payment.
const Paywall = dynamic(() => import("./paywall/paywall"), { ssr: false });

/** Dialogs and overlays shared by every tool. */
export function AppOverlays() {
  const paywall = useApp((state) => state.paywall !== null);
  return (
    <>
      <DropOverlay />
      <PasswordDialog />
      <JobOverlay />
      <ResultsDialog />
      {paywall && <Paywall />}
      <CheckoutReturn />
      <Toaster />
    </>
  );
}
