"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/interract/frame";
import { Preview } from "@/components/interract/previews";
import { componentsRegistry } from "@/lib/registry";

const layout: { slug: string; className: string }[] = [
  { slug: "now-playing", className: "md:col-span-2 lg:col-span-1" },
  { slug: "pricing-toggle", className: "lg:row-span-2" },
  { slug: "otp-input", className: "" },
  { slug: "settings-list", className: "" },
  { slug: "notification-stack", className: "" },
  { slug: "avatar-stack", className: "md:col-span-2 lg:col-span-3" },
];

export function FeaturedComponents() {
  return (
    <Section>
      <SectionHeader
        index="01"
        eyebrow="Blocks"
        title="Small details,"
        muted="done properly."
        description="Every block is live. Hover, click, type — they respond the way good software should."
        action={
          <Link
            href="/components"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            All components
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-px border-t border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {layout.map(({ slug, className }) => {
          const meta = componentsRegistry.find((c) => c.slug === slug)!;
          return (
            <div key={slug} className={cn("group/cell relative flex flex-col bg-background", className)}>
              <div className="bg-dots flex min-h-[300px] flex-1 items-center justify-center px-6 py-12">
                <Preview slug={slug} />
              </div>
              <Link
                href={`/components/${slug}`}
                className="flex items-center justify-between gap-4 border-t border-line px-6 py-4 transition-colors hover:bg-black/[0.015] dark:hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{meta.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{meta.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-300 transition-all group-hover/cell:text-foreground dark:text-neutral-600" />
              </Link>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
