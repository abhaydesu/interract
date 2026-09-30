"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Copy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/interract/page-shell";
import { Eyebrow, Section } from "@/components/interract/frame";
import { Preview } from "@/components/interract/previews";
import { componentsRegistry, getInstallCommand } from "@/lib/registry";

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      aria-label="Copy"
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-surface hover:text-foreground hover:shadow-btn",
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function Segmented<T extends string>({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-0.5 rounded-[10px] bg-black/[0.04] p-[3px] shadow-inset dark:bg-white/[0.04]">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "relative h-7 rounded-[7px] px-3 text-[13px] font-medium capitalize transition-colors",
            value === o ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {value === o && (
            <motion.span
              layoutId={id}
              className="absolute inset-0 rounded-[7px] bg-surface shadow-btn"
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
            />
          )}
          <span className="relative">{o}</span>
        </button>
      ))}
    </div>
  );
}

export default function ComponentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const component = componentsRegistry.find((c) => c.slug === slug);
  const [sourceCode, setSourceCode] = useState<string | null>(null);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [installTab, setInstallTab] = useState<"cli" | "manual">("cli");
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    if (!component) return;
    fetch(`/r/${component.slug}.json`)
      .then((r) => r.json())
      .then((data) => setSourceCode(data.files?.[0]?.content ?? null))
      .catch(() => setSourceCode(null));
  }, [component]);

  if (!component) {
    return (
      <PageShell>
        <div className="px-10 py-32 text-center text-sm text-muted-foreground">Component not found.</div>
      </PageShell>
    );
  }

  const installCommand = getInstallCommand(component.slug);
  const currentIndex = componentsRegistry.findIndex((c) => c.slug === slug);
  const prev = componentsRegistry[currentIndex - 1];
  const next = componentsRegistry[currentIndex + 1];
  const targetPath = `components/${component.path.replace(/^\/components\//, "")}`;

  return (
    <PageShell>
      <Section marks={false} bleed={false}>
        <div className="px-6 pt-14 pb-10 md:px-10">
          <nav className="flex items-center gap-1 text-[13px] text-muted-foreground">
            <Link href="/components" className="transition-colors hover:text-foreground">
              Components
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <span className="text-foreground">{component.name}</span>
          </nav>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
            {component.name}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">{component.description}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-[11px] font-medium text-white dark:bg-white dark:text-neutral-900">
              {component.category}
            </span>
            {component.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-surface px-2 py-0.5 font-mono text-[11px] text-muted-foreground shadow-btn"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex items-center justify-between px-6 py-3 md:px-10">
          <Segmented id="view-tab" value={view} options={["preview", "code"] as const} onChange={setView} />
          <div className="flex items-center gap-1">
            {view === "preview" && (
              <button
                onClick={() => setReplay((r) => r + 1)}
                aria-label="Reset preview"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-surface hover:text-foreground hover:shadow-btn"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            {view === "code" && sourceCode && <CopyButton text={sourceCode} />}
          </div>
        </div>
        <div className="px-3 pb-3 md:px-6 md:pb-6">
          <div className="relative rounded-[22px] bg-black/[0.02] p-1.5 shadow-inset dark:bg-white/[0.02]">
            {view === "preview" ? (
              <div
                key={replay}
                className="bg-dots flex min-h-[440px] items-center justify-center rounded-2xl bg-background px-6 py-16 shadow-hairline"
              >
                <Preview slug={component.slug} />
              </div>
            ) : (
              <pre className="max-h-[520px] min-h-[440px] overflow-auto rounded-2xl bg-surface p-5 font-mono text-[12.5px] leading-relaxed text-neutral-700 shadow-hairline dark:text-neutral-300">
                <code>{sourceCode ?? "// Source not built yet — run `npm run build:registry`."}</code>
              </pre>
            )}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 px-6 py-12 md:grid-cols-[220px_1fr] md:px-10">
          <div>
            <Eyebrow>Installation</Eyebrow>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Add it with the shadcn CLI, or copy the source into your project.
            </p>
          </div>
          <div className="min-w-0">
            <Segmented id="install-tab" value={installTab} options={["cli", "manual"] as const} onChange={setInstallTab} />
            <div className="mt-3 overflow-hidden rounded-xl bg-surface shadow-soft">
              {installTab === "cli" ? (
                <div className="flex items-center gap-3 px-4 py-3">
                  <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground">
                    <span className="text-muted-foreground select-none">$ </span>
                    {installCommand}
                  </code>
                  <CopyButton text={installCommand} />
                </div>
              ) : (
                <ol className="divide-y divide-line">
                  {component.dependencies && component.dependencies.length > 0 && (
                    <li className="flex items-center gap-3 px-4 py-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-2 font-mono text-[10px] text-muted-foreground shadow-hairline">
                        1
                      </span>
                      <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground">
                        npm i {component.dependencies.join(" ")}
                      </code>
                      <CopyButton text={`npm i ${component.dependencies.join(" ")}`} />
                    </li>
                  )}
                  <li className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-2 font-mono text-[10px] text-muted-foreground shadow-hairline">
                      {component.dependencies?.length ? 2 : 1}
                    </span>
                    <p className="min-w-0 flex-1 text-[13px] text-muted-foreground">
                      Copy the source into{" "}
                      <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px] text-foreground shadow-inset">
                        {targetPath}
                      </code>
                    </p>
                    {sourceCode && <CopyButton text={sourceCode} />}
                  </li>
                </ol>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-2 gap-px bg-line">
          {[prev, next].map((c, i) =>
            c ? (
              <Link
                key={c.slug}
                href={`/components/${c.slug}`}
                className={cn(
                  "group relative flex flex-col gap-1 bg-background px-6 py-6 transition-colors hover:bg-black/[0.015] md:px-10 dark:hover:bg-white/[0.02]",
                  i === 1 && "items-end text-right"
                )}
              >
                <span className="flex items-center gap-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                  {i === 0 && <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />}
                  {i === 0 ? "Previous" : "Next"}
                  {i === 1 && <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />}
                </span>
                <span className="text-sm font-medium text-foreground">{c.name}</span>
              </Link>
            ) : (
              <div key={i} className="bg-hatch bg-background" />
            )
          )}
        </div>
      </Section>
    </PageShell>
  );
}
