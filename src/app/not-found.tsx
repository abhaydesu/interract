import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/interract/page-shell";
import { Eyebrow, Section } from "@/components/interract/frame";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <PageShell>
      <Section marks={false} bleed={false} className="overflow-hidden">
        <div className="bg-grid mask-radial pointer-events-none absolute inset-0" />
        <div className="relative flex flex-col items-center px-6 py-28 text-center md:py-36">
          <Eyebrow>Error 404</Eyebrow>
          <p className="mt-6 font-pixel text-7xl text-foreground md:text-8xl" aria-hidden>
            404
          </p>
          <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-foreground">
            This page doesn’t exist.
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            The link may be broken, or the component may have been renamed.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/">
                <ArrowLeft /> Back home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/components">Browse components</Link>
            </Button>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
