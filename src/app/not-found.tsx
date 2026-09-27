import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100dvh-3.5rem)] place-items-center px-5">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <FileQuestion className="size-6" />
        </span>
        <p className="mt-6 font-mono text-sm text-fg-subtle">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Ez az oldal nem található</h1>
        <p className="mt-3 text-fg-muted">Lehet, hogy elírás van a címben, vagy az oldal már nem létezik.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-[15px] font-medium text-primary-fg shadow-sm shadow-primary/25 transition-colors hover:bg-primary-hover"
        >
          Vissza a konvertálóhoz
        </Link>
      </div>
    </main>
  );
}
