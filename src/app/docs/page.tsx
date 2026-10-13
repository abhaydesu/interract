import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Layers, Palette, Zap } from "lucide-react";
import { PageShell } from "@/components/interract/page-shell";
import { Eyebrow, Section } from "@/components/interract/frame";
import { CommandLine } from "@/components/interract/copy-button";
import { getInstallCommand } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Docs",
  description: "Install Interract components with the shadcn CLI and tune the theme tokens.",
};

const steps = [
  { title: "Initialize shadcn", body: "In any Next.js + Tailwind project.", code: "npx shadcn@latest init" },
  {
    title: "Add a component",
    body: "Point the CLI at the Interract registry.",
    code: getInstallCommand("button"),
  },
  {
    title: "Import and use",
    body: "It’s plain TSX in your repo now.",
    code: 'import { Button } from "@/components/ui/button"',
    prompt: false,
  },
];

const sections = [
  { title: "Components", description: "Browse and install individual UI components.", href: "/components", icon: Layers },
  { title: "Icons", description: "Animated icons with built-in micro-interactions.", href: "/icons", icon: Zap },
  { title: "Theming", description: "Tune shadow, line and surface tokens in globals.css.", href: "#theming", icon: Palette },
];

const tokens = [
  { name: "--surface", use: "Card and control backgrounds", swatch: "bg-surface shadow-hairline" },
  { name: "--surface-2", use: "Recessed wells and hover fills", swatch: "bg-surface-2 shadow-inset" },
  { name: "--line", use: "Hairline rules and grid gaps", swatch: "bg-line" },
  { name: "--sh-btn", use: "Buttons, chips and inputs", swatch: "bg-surface shadow-btn" },
  { name: "--sh-soft", use: "Resting cards", swatch: "bg-surface shadow-soft" },
  { name: "--sh-raised", use: "Elevated blocks and panels", swatch: "bg-surface shadow-raised" },
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

      <Section id="installation">
        <div className="px-6 py-12 md:px-10">
          <ol className="relative max-w-2xl space-y-10 border-l border-dashed border-line-strong pl-8">
            {steps.map((s, i) => (
              <li key={s.title} className="relative min-w-0">
                <span className="absolute top-0 -left-[45px] flex h-6 w-6 items-center justify-center rounded-lg bg-surface font-mono text-[11px] text-foreground shadow-btn">
                  {i + 1}
                </span>
                <h2 className="text-sm font-medium text-foreground">{s.title}</h2>
                <p className="mt-1 mb-3 text-[13px] text-muted-foreground">{s.body}</p>
                <CommandLine command={s.code} prompt={s.prompt ?? true} />
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="theming">
        <div className="grid gap-8 px-6 py-12 md:grid-cols-[220px_1fr] md:px-10">
          <div>
            <Eyebrow>Theming</Eyebrow>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Components read a small set of CSS variables. Override them in{" "}
              <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[12px] text-foreground shadow-inset">
                globals.css
              </code>{" "}
              under <code className="font-mono text-[12px] text-foreground">:root</code> and{" "}
              <code className="font-mono text-[12px] text-foreground">.dark</code>. Shadows are re-tuned per
              theme, not inverted.
            </p>
          </div>
          <ul className="grid min-w-0 grid-cols-1 gap-px overflow-hidden rounded-xl bg-line shadow-soft sm:grid-cols-2">
            {tokens.map((t) => (
              <li key={t.name} className="flex items-center gap-4 bg-surface px-4 py-3.5">
                <span className={`h-9 w-9 shrink-0 rounded-[10px] ${t.swatch}`} aria-hidden />
                <div className="min-w-0">
                  <p className="font-mono text-[12px] text-foreground">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.use}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group flex flex-col bg-background p-6 transition-colors hover:bg-[color-mix(in_oklab,var(--background)_97.5%,var(--foreground))] md:p-8 "
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface text-muted-foreground shadow-btn">
                  <s.icon className="h-4 w-4" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-neutral-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground dark:text-neutral-600" />
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
