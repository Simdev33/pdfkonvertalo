"use client";

import { FileQuestion, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { pathFor } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

/** Body of every error.tsx (inside the root layout, so the language is known). */
export function ErrorView({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const text = useI18n().ui.errorPage;
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[calc(100dvh-3.5rem)] place-items-center px-5">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger-soft text-danger">
          <TriangleAlert className="size-6" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">{text.title}</h1>
        <p className="mt-3 text-fg-muted">{text.text}</p>
        <Button variant="primary" size="lg" className="mt-8" onClick={reset}>
          {text.retry}
        </Button>
      </div>
    </main>
  );
}

/** Body of every not-found.tsx. */
export function NotFoundView() {
  const { locale, ui } = useI18n();
  return (
    <main className="grid min-h-[calc(100dvh-3.5rem)] place-items-center px-5">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <FileQuestion className="size-6" />
        </span>
        <p className="mt-6 font-mono text-sm text-fg-subtle">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{ui.notFound.title}</h1>
        <p className="mt-3 text-fg-muted">{ui.notFound.text}</p>
        <Link
          href={pathFor("converter", locale)}
          className="mt-8 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-[15px] font-medium text-primary-fg shadow-sm shadow-primary/25 transition-colors hover:bg-primary-hover"
        >
          {ui.notFound.back}
        </Link>
      </div>
    </main>
  );
}
