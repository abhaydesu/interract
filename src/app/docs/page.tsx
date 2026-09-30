"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check, Copy, Layers, Palette, Zap } from "lucide-react";
import { PageShell } from "@/components/interract/page-shell";
import { Eyebrow, Section } from "@/components/interract/frame";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group flex items-center gap-3 rounded-xl bg-surface px-4 py-3 shadow-soft">
      <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground">
        <span className="text-muted-foreground select-none">$ </span>
        {code}
      </code>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        aria-label="Copy"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-surface-2 hover:text-foreground hover:shadow-btn"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

const steps = [
  { title: "Initialize shadcn", body: "In any Next.js + Tailwind project.", code: "npx shadcn@latest init" },
  {
    title: "Add a component",
    body: "Point the CLI at the Interract registry.",
    code: 'npx shadcn@latest add "https://interract.dev/r/button.json"',
  },
  { title: "Import and use", body: "It’s plain TSX in your repo now.", code: 'import { Button } from "@/components/ui/button"' },
];

const sections = [
  { title: "Components", description: "Browse and install individual UI components.", href: "/components", icon: Layers },
  { title: "Icons", description: "Animated icons with built-in micro-interactions.", href: "/icons", icon: Zap },
  { title: "Theming", description: "Tune shadow, line and surface tokens in globals.css.", href: "/docs", icon: Palette },
];

export default function DocsPage() {
  return (
    <PageShell>
      <Section marks={false} bleed={false}>
        <div className="px-6 pt-16 pb-10 md:px-10">
          <Eyebrow>Documentation</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
            Getting started
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Get up and running with Interract in under a minute.
          </p>
        </div>
      </Section>

      <Section>
        <div className="px-6 py-12 md:px-10">
          <ol className="relative max-w-2xl space-y-10 border-l border-dashed border-line-strong pl-8">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="absolute top-0 -left-[45px] flex h-6 w-6 items-center justify-center rounded-lg bg-surface font-mono text-[11px] text-foreground shadow-btn">
                  {i + 1}
                </span>
                <h3 className="text-sm font-medium text-foreground">{s.title}</h3>
                <p className="mt-1 mb-3 text-[13px] text-muted-foreground">{s.body}</p>
                <CodeBlock code={s.code} />
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group flex flex-col bg-background p-6 transition-colors hover:bg-black/[0.015] md:p-8 dark:hover:bg-white/[0.02]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface text-muted-foreground shadow-btn">
                  <s.icon className="h-4 w-4" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-foreground dark:text-neutral-600" />
              </div>
              <h3 className="mt-6 text-sm font-medium text-foreground">{s.title}</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">{s.description}</p>
            </Link>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
