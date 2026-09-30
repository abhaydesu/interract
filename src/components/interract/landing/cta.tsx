import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/interract/frame";

export function CtaSection() {
  return (
    <Section className="overflow-hidden">
      <div className="bg-grid mask-radial pointer-events-none absolute inset-0" />
      <div className="relative px-6 py-24 text-center md:py-32">
        <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-balance text-foreground md:text-5xl">
          Build something that{" "}
          <span className="text-shimmer">feels good</span> to use.
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">
          Free and open source. MIT licensed. Made for people who notice the details.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="group h-10 rounded-[11px] px-5">
            <Link href="/components">
              Start building
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-10 rounded-[11px] px-5">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </Section>
  );
}
