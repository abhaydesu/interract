"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Section } from "@/components/interract/frame";
import { CommandLine } from "@/components/interract/copy-button";
import { thockIcons, type IconState } from "@/components/icons/thock-icons";
import { bubblyIcons } from "@/components/icons/bubbly-icons";
import { animatedIcons, iconCategories, iconSets, type IconMeta, type IconSetId } from "@/lib/icon-registry";
import { getInstallCommand } from "@/lib/registry";
import { useCopy } from "@/hooks/use-copy";
import { ColorBar, normalizeHex } from "./color-bar";
import { CategoryMenu } from "./category-menu";

const setIcons = { thock: thockIcons, bubbly: bubblyIcons } as const;

// The bubble around a bubbly icon: swells on hover, squishes on press, springs back.
const bubble = {
  rest: { scale: 1, scaleX: 1, scaleY: 1, transition: { type: "spring", stiffness: 400, damping: 14 } },
  hover: { scale: 1.06, scaleX: 1, scaleY: 1, transition: { type: "spring", stiffness: 400, damping: 12 } },
  press: { scale: 1, scaleX: 1.08, scaleY: 0.9, transition: { type: "spring", stiffness: 700, damping: 26 } },
} as const;

const weights = [
  { label: "Bold", value: 2.25 },
  { label: "Thick", value: 2.75 },
  { label: "Chunky", value: 3.25 },
] as const;

export function IconBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const set: IconSetId = searchParams.get("set") === "bubbly" ? "bubbly" : "thock";
  const meta = iconSets.find((s) => s.id === set)!;
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [query, setQuery] = React.useState("");
  const [weight, setWeight] = React.useState<number>(2.75);
  const [color, setColor] = React.useState<string | null>(() => normalizeHex(searchParams.get("color") ?? ""));
  const { copied, copy } = useCopy();

  // Mirror the colour into the URL so a tinted gallery can be shared. Debounced,
  // because the native picker fires on every drag step.
  const searchString = searchParams.toString();
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      const params = new URLSearchParams(searchString);
      const next = color ? color.slice(1) : null;
      if ((params.get("color") ?? null) === next) return;
      if (next) params.set("color", next);
      else params.delete("color");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 250);
    return () => window.clearTimeout(id);
  }, [color, searchString, pathname, router]);

  const snippet = (name: string) => {
    const line = `import { ${name}Icon } from "@/components/icons/${meta.file}";`;
    return color ? `${line}\n\n<${name}Icon className="text-[${color}]" />` : line;
  };

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: animatedIcons.length };
    for (const i of animatedIcons) counts[i.category] = (counts[i.category] ?? 0) + 1;
    return counts;
  }, []);

  const q = query.trim().toLowerCase();
  const icons = animatedIcons.filter(
    (i) =>
      (selectedCategory === "All" || i.category === selectedCategory) &&
      (!q || i.name.toLowerCase().includes(q) || i.motion[set].toLowerCase().includes(q))
  );

  const selectSet = (id: IconSetId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "thock") params.delete("set");
    else params.set("set", id);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <Section>
      {/* one toolbar: search, type, category, then colour on the right */}
      <div className="flex flex-wrap items-center gap-2 px-6 pt-6 pb-5 md:px-10">
        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search icons or motions…"
            aria-label="Search icons"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            className="h-9 w-full appearance-none rounded-[10px] bg-surface pr-3 pl-9 text-base text-foreground shadow-btn transition-shadow outline-none placeholder:text-muted-foreground focus:shadow-[var(--sh-btn),0_0_0_4px_rgb(120_120_120/0.15)] focus-visible:outline-none sm:text-[13px]"
          />
        </div>
        <SetSwitcher value={set} onChange={selectSet} />
        <CategoryMenu
          value={selectedCategory}
          options={iconCategories}
          counts={categoryCounts}
          onChange={setSelectedCategory}
        />
        {set === "thock" && <WeightPicker value={weight} onChange={setWeight} />}
        <ColorBar value={color} onChange={setColor} className="ml-auto" />
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-line bg-line min-[440px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {icons.map((item) => (
          <IconTile
            key={`${set}-${item.name}`}
            set={set}
            item={item}
            weight={weight}
            color={color}
            copied={copied === `${set}-${item.name}`}
            onCopy={() => copy(snippet(item.name), `${set}-${item.name}`)}
          />
        ))}
        {gridFillers(icons.length).map((cls, i) => (
          <div key={`filler-${i}`} aria-hidden className={`bg-background bg-hatch ${cls}`} />
        ))}
        {icons.length === 0 && (
          <div className="col-span-full bg-background py-24 text-center text-sm text-muted-foreground">
            No icons match “{query}”.
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 border-t border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p className="text-[13px] text-muted-foreground">
          Install the <span className="text-foreground">{meta.name}</span> set, or click any icon to copy its import.
        </p>
        <CommandLine command={getInstallCommand(meta.file)} className="min-w-0 sm:w-[420px]" />
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? `Copied ${copied.split("-")[1]} import` : ""}
      </p>
    </Section>
  );
}

function IconTile({
  set,
  item,
  weight,
  color,
  copied,
  onCopy,
}: {
  set: IconSetId;
  item: IconMeta;
  weight: number;
  color: string | null;
  copied: boolean;
  onCopy: () => void;
}) {
  const Icon = setIcons[set][item.name];
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const state: IconState = pressed ? "press" : hovered ? "hover" : "rest";

  return (
    <button
      type="button"
      onClick={onCopy}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => {
        setHovered(false);
        setPressed(false);
      }}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && !e.repeat && setPressed(true)}
      onKeyUp={() => setPressed(false)}
      data-pressed={pressed}
      aria-label={`${item.name}: ${item.motion[set]}. Copy import`}
      className="group relative flex aspect-square flex-col items-center justify-center gap-4 bg-background transition-colors hover:bg-[color-mix(in_oklab,var(--background)_97.5%,var(--foreground))] focus-visible:z-10 focus-visible:-outline-offset-2"
    >
      {set === "thock" ? (
        // keycap
        <span className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-surface text-neutral-800 shadow-keycap transition-[transform,box-shadow,color] duration-100 ease-out group-hover:-translate-y-px group-data-[pressed=true]:translate-y-[3px] group-data-[pressed=true]:shadow-keycap-down dark:text-neutral-100"
          style={color ? { color } : undefined}
        >
          <Icon size={28} strokeWidth={weight} state={state} />
        </span>
      ) : (
        // bubble
        <motion.span
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-surface text-neutral-800 shadow-bubble transition-colors dark:text-neutral-100"
          style={{ color: color ?? undefined, originY: 0.8 }}
          initial={false}
          animate={state}
          variants={bubble}
        >
          <span aria-hidden className="pointer-events-none absolute top-2 left-3.5 h-2.5 w-4 -rotate-[30deg] rounded-full bg-white/80 blur-[1px] dark:bg-white/10" />
          <Icon size={30} state={state} />
        </motion.span>
      )}
      <span className="flex max-w-full flex-col items-center gap-0.5 px-2">
        <span className="max-w-full truncate font-mono text-[11px] text-foreground/80">{item.name}</span>
        <span className="max-w-full truncate text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100">
          {item.motion[set]}
        </span>
      </span>
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-neutral-900 px-1.5 py-0.5 text-[10px] text-white dark:bg-white dark:text-neutral-900"
          >
            <Check className="h-2.5 w-2.5" /> Copied
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function WeightPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Stroke weight"
      className="flex h-9 shrink-0 gap-0.5 rounded-[10px] bg-black/[0.04] p-[3px] shadow-inset dark:bg-white/[0.04]"
    >
      {weights.map((w) => {
        const selected = value === w.value;
        return (
          <button
            key={w.label}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={w.label}
            title={w.label}
            onClick={() => onChange(w.value)}
            className={cn(
              "relative flex w-9 items-center justify-center rounded-[7px] transition-colors",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {selected && (
              <motion.span
                layoutId="icon-weight"
                className="absolute inset-0 rounded-[7px] bg-surface shadow-btn"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <svg viewBox="0 0 16 16" className="relative h-4 w-4" aria-hidden>
              <path d="M3 8h10" stroke="currentColor" strokeWidth={w.value * 0.8} strokeLinecap="round" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// Column count per breakpoint, matching the grid classes above.
const columns = [
  { cols: 2, show: "block", hide: "hidden" },
  { cols: 3, show: "min-[440px]:block", hide: "min-[440px]:hidden" },
  { cols: 4, show: "sm:block", hide: "sm:hidden" },
  { cols: 5, show: "md:block", hide: "md:hidden" },
  { cols: 6, show: "lg:block", hide: "lg:hidden" },
];

/** Hatched cells that complete the last row at every breakpoint. */
function gridFillers(n: number) {
  if (n === 0) return [];
  const need = columns.map(({ cols }) => (cols - (n % cols)) % cols);
  return Array.from({ length: Math.max(...need) }, (_, i) =>
    cn(columns.map((c, j) => (i < need[j] ? c.show : c.hide)))
  );
}

function SetSwitcher({ value, onChange }: { value: IconSetId; onChange: (id: IconSetId) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Icon type"
      className="flex h-9 shrink-0 gap-0.5 rounded-[10px] bg-black/[0.04] p-[3px] shadow-inset dark:bg-white/[0.04]"
    >
      {iconSets.map((s) => {
        const selected = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={selected}
            title={`${s.name}: ${s.blurb}`}
            onClick={() => onChange(s.id)}
            className={cn(
              "relative flex items-center rounded-[7px] px-3 text-[13px] font-medium transition-colors",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {selected && (
              <motion.span
                layoutId="icon-set"
                className="absolute inset-0 rounded-[7px] bg-surface shadow-btn"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span
              className={cn(
                "relative",
                s.id === "bubbly" && `font-bubble text-[17px] leading-none font-normal tracking-[0.02em] -translate-y-px`
              )}
            >
              {s.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
