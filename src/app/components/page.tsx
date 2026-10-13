import type { Metadata } from "next";
import { Suspense } from "react";
import { Eyebrow, Section } from "@/components/interract/frame";
import { componentsRegistry } from "@/lib/registry";
import { ComponentsBrowser } from "./_components/components-browser";

export const metadata: Metadata = {
  title: "Components",
  description: "Primitives and interactive blocks with motion built in. Every preview is live.",
};

export default function ComponentsPage() {
  return (
    <>
      <Section marks={false} bleed={false}>
        <div className="px-6 pt-12 pb-8 md:px-10 lg:pt-14">
          <Eyebrow>{componentsRegistry.length} components</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
            Components
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Primitives and interactive blocks with motion built in. Every preview below is live, so go ahead and
            poke at them.
          </p>
        </div>
      </Section>

      {/* useSearchParams needs a Suspense boundary for static rendering */}
      <Suspense fallback={<Section><div className="min-h-[60vh]" /></Section>}>
        <ComponentsBrowser />
      </Suspense>
    </>
  );
}
