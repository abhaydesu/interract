"use client";

import * as React from "react";
import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { Section } from "@/components/interract/frame";
import { Preview } from "@/components/interract/previews";
import { CopyButton } from "@/components/interract/copy-button";
import { Segmented } from "./segmented";

export function ComponentPlayground({
  slug,
  source,
  fileName,
}: {
  slug: string;
  source: string | null;
  fileName: string;
}) {
  const [view, setView] = React.useState<"preview" | "code">("preview");
  const [replay, setReplay] = React.useState(0);
  const [spin, setSpin] = React.useState(0);
  const lines = source?.replace(/\n$/, "").split("\n") ?? [];

  return (
    <Section>
      <div className="flex items-center justify-between gap-3 px-6 py-3 md:px-10">
        <Segmented label="View" value={view} options={["preview", "code"] as const} onChange={setView} />
        <div className="flex min-w-0 items-center gap-1">
          {view === "preview" ? (
            <button
              type="button"
              onClick={() => {
                setReplay((r) => r + 1);
                setSpin((s) => s - 360);
              }}
              aria-label="Reset preview"
              title="Reset preview"
              className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-all hover:bg-surface hover:text-foreground hover:shadow-btn"
            >
              <motion.span animate={{ rotate: spin }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <RotateCcw className="h-3.5 w-3.5" />
              </motion.span>
              <span className="hidden sm:inline">Reset</span>
            </button>
          ) : (
            <>
              <span className="hidden truncate font-mono text-[11px] text-muted-foreground sm:block">{fileName}</span>
              {source && <CopyButton text={source} label="Copy source" />}
            </>
          )}
        </div>
      </div>
      <div className="px-3 pb-3 md:px-6 md:pb-6">
        <div className="relative rounded-[22px] bg-black/[0.02] p-1.5 shadow-inset dark:bg-white/[0.02]">
          {view === "preview" ? (
            <div
              key={replay}
              className="bg-dots flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-background px-4 py-14 shadow-hairline sm:px-6 md:min-h-[440px] md:py-16"
            >
              <Preview slug={slug} />
            </div>
          ) : source ? (
            <pre
              tabIndex={0}
              aria-label={`Source of ${fileName}`}
              className="max-h-[560px] min-h-[360px] overflow-auto overscroll-contain rounded-2xl bg-surface py-4 font-mono text-[12.5px] leading-relaxed text-neutral-700 shadow-hairline md:min-h-[440px] dark:text-neutral-300"
            >
              <code className="grid min-w-max grid-cols-[auto_1fr]">
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    <span className="sticky left-0 bg-surface pr-4 pl-4 text-right text-neutral-300 select-none dark:text-neutral-600">
                      {i + 1}
                    </span>
                    <span className="pr-6">{line || " "}</span>
                  </React.Fragment>
                ))}
              </code>
            </pre>
          ) : (
            <div className="flex min-h-[360px] items-center justify-center rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground shadow-hairline">
              Source unavailable for this component.
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
