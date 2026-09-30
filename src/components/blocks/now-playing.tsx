"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

const DURATION = 214; // seconds

// 8x8 dot-matrix "cover art"
const cover = [
  "00111100",
  "01000010",
  "10100101",
  "10000001",
  "10100101",
  "10011001",
  "01000010",
  "00111100",
];

function format(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export interface NowPlayingProps {
  className?: string;
}

/** Compact media player with a dot-matrix cover, live equalizer and scrubbable progress. */
export function NowPlaying({ className }: NowPlayingProps) {
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(71);

  React.useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTime((t) => (t + 1) % DURATION), 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  const scrub = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setTime(Math.round(pct * DURATION));
  };

  return (
    <div className={cn("w-full max-w-[320px] rounded-2xl bg-surface p-3 shadow-raised", className)}>
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 grid-cols-8 gap-[2px] rounded-xl bg-neutral-900 p-2 shadow-btn-primary dark:bg-neutral-950 dark:shadow-hairline">
          {cover.join("").split("").map((on, i) => (
            <motion.span
              key={i}
              className={cn("rounded-full", on === "1" ? "bg-white" : "bg-white/10")}
              animate={playing && on === "1" ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
              transition={{ duration: 1.4, repeat: playing ? Infinity : 0, delay: (i % 8) * 0.08 }}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-foreground">Soft Focus</p>
          <p className="truncate text-xs text-muted-foreground">Low Tide Collective</p>
        </div>
        <Equalizer playing={playing} />
      </div>

      <div className="mt-4 px-0.5">
        <div
          className="group relative h-4 cursor-pointer touch-none"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            scrub(e);
          }}
          onPointerMove={(e) => e.buttons === 1 && scrub(e)}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={DURATION}
          aria-valuenow={time}
        >
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-black/[0.06] transition-[height] group-hover:h-1.5 dark:bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-300 ease-linear"
              style={{ width: `${(time / DURATION) * 100}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-surface shadow-btn transition-[transform,left] duration-300 ease-linear group-hover:scale-100"
            style={{ left: `${(time / DURATION) * 100}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground tabular-nums">
          <span>{format(time)}</span>
          <span>-{format(DURATION - time)}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        <ControlButton label="Previous" onClick={() => setTime(0)}>
          <SkipBack className="h-4 w-4" fill="currentColor" />
        </ControlButton>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-btn-primary dark:bg-white dark:text-neutral-900"
        >
          <motion.span
            key={playing ? "pause" : "play"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            {playing ? (
              <Pause className="h-4 w-4" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
            )}
          </motion.span>
        </motion.button>
        <ControlButton label="Next" onClick={() => setTime((t) => Math.min(t + 15, DURATION - 1))}>
          <SkipForward className="h-4 w-4" fill="currentColor" />
        </ControlButton>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
    >
      {children}
    </motion.button>
  );
}

function Equalizer({ playing }: { playing: boolean }) {
  const bars = [0.5, 0.9, 0.35, 0.7];
  return (
    <div className="flex h-4 items-end gap-[2px] pr-1" aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-foreground"
          initial={{ height: "25%" }}
          animate={
            playing
              ? { height: ["25%", `${h * 100}%`, "40%", `${(1 - h / 2) * 100}%`, "25%"] }
              : { height: "25%" }
          }
          transition={{ duration: 1.1 + i * 0.15, repeat: playing ? Infinity : 0, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
