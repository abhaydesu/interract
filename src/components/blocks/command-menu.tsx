"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Box,
  CornerDownLeft,
  FileText,
  Moon,
  Palette,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string; label: string; icon: React.ElementType; group: string; hint?: string };

const items: Item[] = [
  { id: "new", label: "Create new component", icon: Sparkles, group: "Suggestions", hint: "⌘N" },
  { id: "browse", label: "Browse blocks", icon: Box, group: "Suggestions" },
  { id: "theme", label: "Toggle dark mode", icon: Moon, group: "Suggestions", hint: "⌘D" },
  { id: "docs", label: "Search documentation", icon: FileText, group: "Navigation" },
  { id: "tokens", label: "Edit design tokens", icon: Palette, group: "Navigation" },
  { id: "profile", label: "Open profile", icon: User, group: "Settings" },
  { id: "prefs", label: "Preferences", icon: Settings, group: "Settings", hint: "⌘," },
];

export interface CommandMenuProps {
  className?: string;
  onSelect?: (id: string) => void;
}

/**
 * A ⌘K style command palette with fuzzy-ish filtering,
 * keyboard navigation and a spring-driven highlight.
 */
export function CommandMenu({ className, onSelect }: CommandMenuProps) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [ran, setRan] = React.useState<string | null>(null);
  const uid = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);
  const ranTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(ranTimer.current), []);

  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));
  const groups = Array.from(new Set(filtered.map((i) => i.group)));
  const activeIndex = Math.min(active, Math.max(filtered.length - 1, 0));

  const run = (item: Item) => {
    setRan(item.label);
    onSelect?.(item.id);
    window.clearTimeout(ranTimer.current);
    ranTimer.current = window.setTimeout(() => setRan(null), 1600);
  };

  const moveTo = (i: number) => {
    setActive(i);
    // Keep the highlighted row visible inside the list (without scrolling the page).
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>(`[data-index="${i}"]`);
    if (!list || !row) return;
    const pad = 6;
    if (i === 0) {
      list.scrollTop = 0;
    } else if (row.offsetTop - pad < list.scrollTop) {
      list.scrollTop = row.offsetTop - pad;
    } else if (row.offsetTop + row.offsetHeight + pad > list.scrollTop + list.clientHeight) {
      list.scrollTop = row.offsetTop + row.offsetHeight + pad - list.clientHeight;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!filtered.length && e.key !== "Escape") return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveTo((activeIndex + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveTo((activeIndex - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      moveTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      moveTo(filtered.length - 1);
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      run(filtered[activeIndex]);
    } else if (e.key === "Escape" && query) {
      e.preventDefault();
      setQuery("");
      setActive(0);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-[420px] overflow-hidden rounded-2xl bg-surface shadow-raised",
        className
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Type a command or search…"
          aria-label="Command"
          role="combobox"
          aria-expanded
          aria-controls={`${uid}-list`}
          aria-activedescendant={filtered[activeIndex] ? `${uid}-${filtered[activeIndex].id}` : undefined}
          autoComplete="off"
          spellCheck={false}
          className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-neutral-400 focus-visible:outline-none sm:text-sm dark:placeholder:text-neutral-600"
        />
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setActive(0);
          }}
          tabIndex={-1}
          aria-hidden
          className={cn(
            "rounded-[5px] bg-surface px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground shadow-key transition-opacity",
            !query && "pointer-events-none opacity-50"
          )}
        >
          ESC
        </button>
      </div>

      <div ref={listRef} id={`${uid}-list`} className="relative max-h-[272px] overflow-y-auto overscroll-contain p-1.5" role="listbox">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No results for “{query}”</p>
        )}
        {groups.map((group) => (
          <div key={group} className="pb-1">
            <p className="px-2.5 pt-2 pb-1.5 text-[11px] font-medium text-muted-foreground">{group}</p>
            {filtered
              .filter((i) => i.group === group)
              .map((item) => {
                const idx = filtered.indexOf(item);
                const isActive = idx === activeIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`${uid}-${item.id}`}
                    data-index={idx}
                    type="button"
                    tabIndex={-1}
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => idx !== activeIndex && setActive(idx)}
                    onClick={() => run(item)}
                    className="relative flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px]"
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`${uid}-active`}
                        className="absolute inset-0 rounded-lg bg-black/[0.045] dark:bg-white/[0.06]"
                        transition={{ type: "spring", stiffness: 600, damping: 40 }}
                      />
                    )}
                    <Icon
                      className={cn(
                        "relative h-4 w-4 transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "relative flex-1 transition-colors",
                        isActive ? "text-foreground" : "text-neutral-600 dark:text-neutral-400"
                      )}
                    >
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="relative font-mono text-[11px] text-muted-foreground">
                        {item.hint}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      <div className="flex h-10 items-center justify-between border-t border-line bg-surface-2/60 px-3 text-[11px] text-muted-foreground">
        <AnimatePresence mode="wait" initial={false}>
          {ran ? (
            <motion.span
              key="ran"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-1.5 text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {ran}
            </motion.span>
          ) : (
            <motion.span
              key="brand"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="font-pixel text-xs"
            >
              interract
            </motion.span>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            Open
            <kbd className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-surface shadow-key">
              <CornerDownLeft className="h-2.5 w-2.5" />
            </kbd>
          </span>
          <span className="flex items-center gap-1">
            Navigate
            <kbd className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-surface shadow-key">
              <ArrowRight className="h-2.5 w-2.5 rotate-90" />
            </kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
