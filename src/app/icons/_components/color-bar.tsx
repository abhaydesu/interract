"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/** Lightness every picked colour shares, so hue and saturation are the only knobs. */
const LIGHT = 56;
const DEFAULT_SAT = 86;

const hsl = (h: number, s: number) => `hsl(${h} ${s}% ${LIGHT}%)`;

/** One continuous hue spectrum, red round to red. */
const spectrum = `linear-gradient(to right, ${Array.from({ length: 13 }, (_, i) => hsl(i * 30, DEFAULT_SAT)).join(", ")})`;

const OPEN_WIDTH = 340;
const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

/** Normalises "#abc", "abc", "#aabbcc" or "aabbcc" to "#aabbcc"; null when invalid. */
export function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(raw)) return `#${raw.split("").map((c) => c + c).join("")}`;
  if (/^[0-9a-f]{6}$/.test(raw)) return `#${raw}`;
  return null;
}

function toHex(hue: number, sat: number) {
  const s = sat / 100;
  const l = LIGHT / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Hue (0–359) and HSL saturation (0–100) of a hex colour. */
function fromHex(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return { hue: null, sat: 0 };
  const l = (max + min) / 2;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return {
    hue: Math.round((h * 60 + 360) % 360),
    sat: Math.round((d / (1 - Math.abs(2 * l - 1))) * 100),
  };
}

/**
 * The icon colour control. Closed, it's a drop of the current colour. Open, it
 * stretches into a hue spectrum and a saturation track you can drag through,
 * with a hex field and a reset. `null` means auto: the theme's foreground colour.
 */
export function ColorBar({
  value,
  onChange,
  className,
}: {
  value: string | null;
  onChange: (color: string | null) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const hueRef = React.useRef<HTMLDivElement>(null);

  // Hue and saturation live here so they survive auto (and greys, which have no hue).
  const [hue, setHue] = React.useState(() => (value ? fromHex(value).hue : null) ?? 210);
  const [sat, setSat] = React.useState(() => (value ? fromHex(value).sat : DEFAULT_SAT));
  const [seen, setSeen] = React.useState(value);
  if (value !== seen) {
    setSeen(value);
    if (value && value !== toHex(hue, sat)) {
      const next = fromHex(value);
      if (next.hue !== null) setHue(next.hue);
      setSat(next.sat);
    }
  }

  const pick = (h: number, s: number) => {
    setHue(h);
    setSat(s);
    onChange(toHex(h, s));
  };

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Focus the hue track when the bar opens so arrow keys work straight away.
  React.useEffect(() => {
    if (open) hueRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn("relative h-9 w-9 shrink-0", className)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          rootRef.current?.querySelector<HTMLElement>("[data-drop]")?.focus();
        }
      }}
    >
      {/* grows up and down evenly so the drop stays put */}
      <motion.div
        initial={false}
        animate={{ width: open ? OPEN_WIDTH : 36, height: open ? 52 : 36, top: open ? -8 : 0 }}
        transition={spring}
        style={{ maxWidth: "calc(100vw - 48px)" }}
        className={cn(
          "absolute right-0 flex items-center justify-end overflow-hidden rounded-[26px] bg-surface shadow-btn",
          open && "z-30 shadow-float"
        )}
      >
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.06, duration: 0.2 } }}
              exit={{ opacity: 0, x: 12, transition: { duration: 0.1 } }}
              className="flex w-[304px] max-w-[calc(100vw-84px)] min-w-0 shrink-0 items-center gap-2 pr-1 pl-3"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <Track
                  ref={hueRef}
                  label="Hue"
                  value={hue}
                  max={359}
                  valueText={`${hue} degrees`}
                  background={spectrum}
                  thumb={hsl(hue, DEFAULT_SAT)}
                  dim={value === null}
                  onChange={(h) => pick(h, sat)}
                />
                <Track
                  label="Saturation"
                  value={sat}
                  max={100}
                  valueText={`${sat}%`}
                  background={`linear-gradient(to right, ${hsl(hue, 0)}, ${hsl(hue, 100)})`}
                  thumb={hsl(hue, sat)}
                  dim={value === null}
                  onChange={(s) => pick(hue, s)}
                />
              </div>
              <HexField value={value} onChange={onChange} />
              <button
                type="button"
                onClick={() => onChange(null)}
                disabled={value === null}
                aria-label="Reset to auto"
                title="Reset to auto (follows theme)"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          data-drop
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={value ? `Icon color ${value}` : "Icon color: auto"}
          title={open ? "Close" : "Icon color"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        >
          <Drop color={value ?? "var(--foreground)"} active={open} />
        </button>
      </motion.div>
    </div>
  );
}

/** A disc of liquid colour with highlights slowly swirling through it. */
function Drop({ color, active }: { color: string; active: boolean }) {
  return (
    <motion.span
      animate={{ scale: active ? 0.82 : 1 }}
      whileHover={{ scale: active ? 0.88 : 1.1 }}
      whileTap={{ scale: 0.76 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      className="relative block h-[22px] w-[22px] overflow-hidden rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12),0_1px_3px_rgb(0_0_0/0.18)] transition-[background-color] duration-300"
      style={{ backgroundColor: color }}
    >
      {/* light swirling one way, shade the other: reads as a liquid turning over */}
      <span className="absolute -inset-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,rgb(255_255_255/0.55)_70deg,transparent_150deg,transparent_360deg)] motion-safe:animate-[spin_3.2s_linear_infinite]" />
      <span className="absolute -inset-1/2 bg-[conic-gradient(from_180deg,transparent_0deg,rgb(0_0_0/0.28)_80deg,transparent_170deg,transparent_360deg)] motion-safe:animate-[spin_5s_linear_infinite_reverse]" />
      <span className="absolute top-[3px] left-[5px] h-[5px] w-[8px] -rotate-[25deg] rounded-full bg-white/70 blur-[0.5px]" />
    </motion.span>
  );
}

/** A slim draggable track with a white-ringed thumb. */
const Track = React.forwardRef<
  HTMLDivElement,
  {
    label: string;
    value: number;
    max: number;
    valueText: string;
    background: string;
    thumb: string;
    dim: boolean;
    onChange: (value: number) => void;
  }
>(function Track({ label, value, max, valueText, background, thumb, dim, onChange }, ref) {
  const [dragging, setDragging] = React.useState(false);

  const set = (v: number) => onChange(Math.max(0, Math.min(max, Math.round(v))));
  const fromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    set(((e.clientX - rect.left) / rect.width) * max);
  };

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      title={label}
      aria-label={`Icon ${label.toLowerCase()}`}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={dim ? "Auto" : valueText}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        fromPointer(e);
      }}
      onPointerMove={(e) => dragging && fromPointer(e)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={(e) => {
        const step = (e.shiftKey ? 10 : 2) * (max / 100);
        const keys: Record<string, number> = {
          ArrowRight: value + step,
          ArrowUp: value + step,
          ArrowLeft: value - step,
          ArrowDown: value - step,
          Home: 0,
          End: max,
        };
        if (e.key in keys) {
          e.preventDefault();
          set(keys[e.key]);
        }
      }}
      className="group/track relative flex h-5 w-full cursor-pointer touch-none items-center rounded-full outline-none"
    >
      <span
        aria-hidden
        className="relative h-2.5 w-full overflow-hidden rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1),inset_0_1px_2px_rgb(0_0_0/0.18)] transition-[background] duration-150"
        style={{ background }}
      >
        <span className="absolute inset-x-1.5 top-px h-[2px] rounded-full bg-white/35" />
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-[9px] left-[9px]">
        {/* whole-pixel sizes and auto margins keep the thumb dead centre on the track */}
        <motion.span
          className="absolute inset-y-0 my-auto -ml-[9px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_0_0_0.5px_rgb(0_0_0/0.14),0_1px_3px_rgb(0_0_0/0.22)] group-focus-visible/track:ring-2 group-focus-visible/track:ring-foreground/40"
          style={{ originX: 0.5, originY: 0.5 }}
          initial={false}
          animate={{ left: `${(value / max) * 100}%`, scale: dragging ? 1.15 : 1 }}
          transition={{
            left: dragging ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36 },
            scale: { type: "spring", stiffness: 500, damping: 20 },
          }}
        >
          <span
            className={cn("absolute inset-[3px] rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]", dim && "opacity-40")}
            style={{ backgroundColor: thumb }}
          />
        </motion.span>
      </span>
    </div>
  );
});

function HexField({ value, onChange }: { value: string | null; onChange: (color: string | null) => void }) {
  const [draft, setDraft] = React.useState(value ?? "");
  const [seen, setSeen] = React.useState(value);
  if (value !== seen) {
    setSeen(value);
    setDraft(value ?? "");
  }

  const commit = () => {
    const hex = normalizeHex(draft);
    if (hex) onChange(hex);
    else setDraft(value ?? "");
  };

  return (
    <label className="flex h-7 shrink-0 items-center rounded-full bg-surface-2 pr-2 pl-2.5 shadow-inset">
      <span className="sr-only">Hex color</span>
      <span className="font-mono text-[12px] text-muted-foreground select-none">#</span>
      <input
        value={draft.replace(/^#/, "")}
        placeholder="auto"
        spellCheck={false}
        autoComplete="off"
        maxLength={7}
        onChange={(e) => {
          setDraft(e.target.value);
          if (e.target.value.replace(/^#/, "").length === 6) {
            const hex = normalizeHex(e.target.value);
            if (hex) onChange(hex);
          }
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
        }}
        className="w-[66px] bg-transparent pl-0.5 font-mono text-base text-foreground lowercase outline-none placeholder:text-muted-foreground focus-visible:outline-none sm:w-[52px] sm:text-[12px]"
      />
    </label>
  );
}
