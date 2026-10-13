"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kbd, Section } from "@/components/interract/frame";
import { Preview } from "@/components/interract/previews";
import { categories, componentTypes, componentsRegistry, typeOf } from "@/lib/registry";

const typeTabs = [{ id: "all", name: "All" }, ...componentTypes] as const;
type TypeTab = (typeof typeTabs)[number]["id"];

export function ComponentsBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramCategory = searchParams.get("category");
  const selectedCategory = paramCategory && categories.includes(paramCategory) ? paramCategory : "All";
  const paramType = searchParams.get("type");
  const selectedType: TypeTab = typeTabs.some((t) => t.id === paramType) ? (paramType as TypeTab) : "all";
  const [searchQuery, setSearchQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const replaceParams = (type: TypeTab, category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") params.delete("type");
    else params.set("type", type);
    if (category === "All") params.delete("category");
    else params.set("category", category);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // "/" jumps to search, like most docs sites.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const filteredComponents = componentsRegistry.filter((c) => {
    const matchesFilter =
      (selectedType === "all" || typeOf(c) === selectedType) &&
      (selectedCategory === "All" || c.category === selectedCategory);
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.includes(q));
    return matchesFilter && matchesSearch;
  });

  const typeCounts = React.useMemo(() => {
    const m: Record<string, number> = { all: componentsRegistry.length };
    for (const c of componentsRegistry) m[typeOf(c)] = (m[typeOf(c)] ?? 0) + 1;
    return m;
  }, []);

  // A category always belongs to one type, so the tabs follow it.
  const categoryType = componentsRegistry.find((c) => c.category === selectedCategory);
  const activeTab: TypeTab = categoryType ? typeOf(categoryType) : selectedType;
  const showCategoryChip = selectedCategory !== "All" && selectedCategory !== "Blocks";
  const description =
    selectedType === "all" ? null : componentTypes.find((t) => t.id === selectedType)?.description;

  return (
    <Section>
      <div className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:px-10">
        <div className="relative w-full md:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search components…"
            aria-label="Search components"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchQuery("");
                e.currentTarget.blur();
              }
            }}
            className="h-9 w-full appearance-none rounded-[10px] bg-surface pr-9 pl-9 text-base text-foreground shadow-btn transition-shadow outline-none placeholder:text-muted-foreground focus:shadow-[var(--sh-btn),0_0_0_4px_rgb(120_120_120/0.15)] focus-visible:outline-none sm:text-[13px] [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 md:inline-flex">/</Kbd>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Component type"
            className="flex h-9 shrink-0 gap-0.5 rounded-[10px] bg-black/[0.04] p-[3px] shadow-inset dark:bg-white/[0.04]"
          >
            {typeTabs.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => replaceParams(tab.id, "All")}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-[7px] px-3 text-[13px] font-medium transition-colors",
                    selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="component-type"
                      className="absolute inset-0 rounded-[7px] bg-surface shadow-btn"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  <span className="relative">{tab.name}</span>
                  <span className="relative font-mono text-[10px] text-muted-foreground tabular-nums">
                    {typeCounts[tab.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {showCategoryChip && (
            <span className="flex h-7 items-center gap-1 rounded-full bg-surface pr-1 pl-3 text-[12px] text-foreground shadow-btn">
              {selectedCategory}
              <button
                type="button"
                onClick={() => replaceParams(activeTab, "All")}
                aria-label={`Remove ${selectedCategory} filter`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>

        {description && !showCategoryChip && (
          <p className="text-[13px] text-muted-foreground md:ml-auto md:max-w-[260px] md:text-right">{description}</p>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {filteredComponents.length} {filteredComponents.length === 1 ? "component" : "components"} shown
      </p>

      <div className="grid grid-cols-1 gap-px border-t border-line bg-line md:grid-cols-2">
        {filteredComponents.map((component) => (
          <div key={component.slug} className="group/cell flex flex-col bg-background">
            <div className="bg-dots flex min-h-[300px] flex-1 items-center justify-center overflow-hidden px-6 py-10">
              <Preview slug={component.slug} />
            </div>
            <Link
              href={`/components/${component.slug}`}
              className="flex items-start justify-between gap-4 border-t border-line px-5 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--background)_97.5%,var(--foreground))]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{component.name}</p>
                  {component.isNew && (
                    <span className="rounded-full bg-emerald-500/10 px-1.5 py-px text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                  {component.description}
                </p>
              </div>
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300 transition-[color,transform] group-hover/cell:translate-x-0.5 group-hover/cell:-translate-y-0.5 group-hover/cell:text-foreground dark:text-neutral-600" />
            </Link>
          </div>
        ))}
        {gridFillers(filteredComponents.length).map((cls, i) => (
          <div key={`filler-${i}`} aria-hidden className={`bg-background bg-hatch ${cls}`} />
        ))}
        {filteredComponents.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-3 bg-background py-24 text-center">
            <p className="text-sm text-muted-foreground">No components match “{searchQuery}”.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                replaceParams("all", "All");
              }}
              className="rounded-lg bg-surface px-3 py-1.5 text-xs font-medium text-foreground shadow-btn transition-transform active:scale-[0.97]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}

/** A hatched cell that completes the last row of the two-column grid. */
function gridFillers(n: number) {
  return n % 2 === 1 ? ["hidden md:block"] : [];
}
