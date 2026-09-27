"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[calc(100dvh-3.5rem)] place-items-center px-5">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger-soft text-danger">
          <TriangleAlert className="size-6" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Valami elromlott</h1>
        <p className="mt-3 text-fg-muted">Váratlan hiba történt. A fájljaid nem kerültek sehova – próbáld újra.</p>
        <Button variant="primary" size="lg" className="mt-8" onClick={reset}>
          Újrapróbálom
        </Button>
      </div>
    </main>
  );
}
