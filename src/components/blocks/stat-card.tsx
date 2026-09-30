"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ranges = {
  "7D": { total: "$12,480", delta: "+4.2%", data: [22, 28, 24, 35, 31, 42, 38, 47, 44, 52, 49, 58] },
  "30D": { total: "$48,290", delta: "+12.4%", data: [18, 24, 21, 30, 38, 34, 45, 41, 52, 58, 55, 66] },
  "90D": { total: "$131.0K", delta: "+31.8%", data: [12, 16, 22, 19, 28, 34, 30, 42, 48, 46, 58, 72] },
} as const;

type Range = keyof typeof ranges;

const W = 280;
const H = 84;

function toPoints(data: readonly number[]) {
  const max = 80;
  return data.map((v, i) => [(i / (data.length - 1)) * W, H - (v / max) * H] as const);
}

function toPath(points: ReturnType<typeof toPoints>) {
  // Smooth curve through points using cubic segments at x-midpoints.
  return points.reduce((acc, [x, y], i, arr) => {
    if (i === 0) return `M ${x},${y}`;
    const [px, py] = arr[i - 1];
    const mx = (px + x) / 2;
    return `${acc} C ${mx},${py} ${mx},${y} ${x},${y}`;
  }, "");
}

export interface StatCardProps {
  className?: string;
}

/** KPI card with range switcher, morphing sparkline and a hover scrubber. */
export function StatCard({ className }: StatCardProps) {
  const [range, setRange] = React.useState<Range>("30D");
  const [hover, setHover] = React.useState<number | null>(null);
  const gradientId = React.useId();
  const r = ranges[range];
  const points = toPoints(r.data);
  const path = toPath(points);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round((x / W) * (points.length - 1));
    setHover(Math.min(Math.max(idx, 0), points.length - 1));
  };

  return (
    <div className={cn("w-full max-w-[320px] rounded-2xl bg-surface p-4 shadow-raised", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Revenue</p>
          <motion.p
            key={range}
            initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground tabular-nums"
          >
            {r.total}
          </motion.p>
        </div>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-600 shadow-[inset_0_0_0_1px_rgb(16_185_129/0.2)] dark:text-emerald-400">
          <ArrowUpRight className="h-3 w-3" />
          {r.delta}
        </span>
      </div>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-[84px] w-full overflow-visible"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1="0"
              x2={W}
              y1={H * f}
              y2={H * f}
              className="stroke-line"
              strokeDasharray="2 4"
            />
          ))}
          <motion.path
            className="text-foreground"
            fill={`url(#${gradientId})`}
            animate={{ d: `${path} L ${W},${H} L 0,${H} Z` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          <motion.path
            className="stroke-foreground"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ d: path, pathLength: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20, pathLength: { duration: 1.2, ease: "easeOut" } }}
          />
          {hover !== null && (
            <g>
              <line x1={points[hover][0]} x2={points[hover][0]} y1="0" y2={H} className="stroke-line-strong" />
              <circle
                cx={points[hover][0]}
                cy={points[hover][1]}
                r="3.5"
                className="fill-surface stroke-foreground"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded-md bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-white shadow-btn-primary dark:bg-white dark:text-neutral-900"
            style={{ left: `${(points[hover][0] / W) * 100}%` }}
          >
            ${(r.data[hover] * 84).toLocaleString()}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-0.5">
          {(Object.keys(ranges) as Range[]).map((k) => (
            <button
              key={k}
              onClick={() => setRange(k)}
              className={cn(
                "relative h-6 rounded-md px-2 font-mono text-[10px] transition-colors",
                range === k ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range === k && (
                <motion.span
                  layoutId="stat-range"
                  className="absolute inset-0 rounded-md bg-surface shadow-btn"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">{k}</span>
            </button>
          ))}
        </div>
        <span className="text-[11px] text-muted-foreground">vs. last period</span>
      </div>
    </div>
  );
}
