"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/interract/page-shell";
import { Eyebrow, Section } from "@/components/interract/frame";
import { Preview } from "@/components/interract/previews";
import { componentsRegistry, categories } from "@/lib/registry";

export default function ComponentsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const q = searchQuery.toLowerCase();
  const filteredComponents = componentsRegistry.filter((c) => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <PageShell>
      <Section marks={false} bleed={false}>
        <div className="px-6 pt-16 pb-10 md:px-10">
          <Eyebrow>{componentsRegistry.length} components</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
            Components
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Primitives and interactive blocks with motion built in. Every preview below is live.
          </p>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="relative w-full md:w-64">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-[10px] bg-surface pr-3 pl-9 text-[13px] text-foreground shadow-btn transition-shadow outline-none placeholder:text-muted-foreground focus:shadow-[var(--sh-btn),0_0_0_4px_rgb(120_120_120/0.12)]"
            />
          </div>
          <div className="-mx-1 flex gap-0.5 overflow-x-auto px-1 py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "relative h-8 shrink-0 rounded-lg px-3 text-[13px] font-medium transition-colors",
                  selectedCategory === cat ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {selectedCategory === cat && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-lg bg-surface shadow-btn"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map((component) => (
            <div key={component.slug} className="group/cell flex flex-col bg-background">
              <div className="bg-dots flex min-h-[280px] flex-1 items-center justify-center overflow-hidden px-6 py-10">
                <Preview slug={component.slug} />
              </div>
              <Link
                href={`/components/${component.slug}`}
                className="flex items-center justify-between gap-4 border-t border-line px-5 py-3.5 transition-colors hover:bg-black/[0.015] dark:hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{component.name}</p>
                    <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                      {component.category}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{component.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover/cell:text-foreground dark:text-neutral-600" />
              </Link>
            </div>
          ))}
          {gridFillers(filteredComponents.length).map((cls, i) => (
            <div key={`filler-${i}`} aria-hidden className={cn("bg-background bg-hatch", cls)} />
          ))}
          {filteredComponents.length === 0 && (
            <div className="col-span-full bg-background py-24 text-center text-sm text-muted-foreground">
              No components match “{searchQuery}”.
            </div>
          )}
        </div>
      </Section>
    </PageShell>
  );
}

/** Hatched cells that complete the last row of the 2- and 3-column grids. */
function gridFillers(n: number) {
  if (n === 0) return [];
  const sm = (2 - (n % 2)) % 2;
  const lg = (3 - (n % 3)) % 3;
  return [0, 1].map((i) =>
    cn("hidden", i < sm && "sm:block", i < lg ? "lg:block" : "lg:hidden")
  );
}
