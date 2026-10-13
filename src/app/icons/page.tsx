import type { Metadata } from "next";
import { PageShell } from "@/components/interract/page-shell";
import { Eyebrow, Section } from "@/components/interract/frame";
import { Suspense } from "react";
import { animatedIcons, iconSets } from "@/lib/icon-registry";
import { IconBrowser } from "./_components/icon-browser";

export const metadata: Metadata = {
  title: "Icons",
  description: "Hand-drawn icon sets, Standard and Bubbly, with SVG micro-interactions on hover and press.",
};

export default function IconsPage() {
  return (
    <PageShell>
      <Section marks={false} bleed={false}>
        <div className="px-6 pt-16 pb-10 md:px-10">
          <Eyebrow>
            {iconSets.length} sets · {animatedIcons.length * iconSets.length} icons
          </Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">Icons</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-pretty text-muted-foreground">
            Hand-drawn sets where the parts move. Hover for the micro-interaction, press to feel
            it. Click any icon to copy its import.
          </p>
        </div>
      </Section>
      {/* useSearchParams (the ?set= switch) needs a Suspense boundary for static rendering */}
      <Suspense fallback={<Section><div className="min-h-[60vh]" /></Section>}>
        <IconBrowser />
      </Suspense>
    </PageShell>
  );
}
