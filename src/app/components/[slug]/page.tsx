import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow, Section } from "@/components/interract/frame";
import { componentTypes, componentsRegistry, getInstallCommand, typeOf } from "@/lib/registry";
import { ComponentPlayground } from "./_components/component-playground";
import { InstallTabs } from "./_components/install-tabs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return componentsRegistry.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const component = componentsRegistry.find((c) => c.slug === slug);
  if (!component) return {};
  return { title: component.name, description: component.description };
}

async function readSource(componentPath: string) {
  try {
    return await readFile(path.join(process.cwd(), "src", componentPath), "utf8");
  } catch {
    return null;
  }
}

export default async function ComponentDetailPage({ params }: Props) {
  const { slug } = await params;
  const currentIndex = componentsRegistry.findIndex((c) => c.slug === slug);
  if (currentIndex === -1) notFound();

  const component = componentsRegistry[currentIndex];
  const source = await readSource(component.path);
  const prev = componentsRegistry[currentIndex - 1];
  const next = componentsRegistry[currentIndex + 1];
  const type = componentTypes.find((t) => t.id === typeOf(component))!;
  const targetPath = `components/${component.path.replace(/^\/components\//, "")}`;

  return (
    <>
      <Section marks={false} bleed={false}>
        <div className="px-6 pt-10 pb-10 md:px-10 lg:pt-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[13px] text-muted-foreground">
            <Link href="/components" className="rounded-sm transition-colors hover:text-foreground">
              Components
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <Link href={`/components?type=${type.id}`} className="rounded-sm transition-colors hover:text-foreground">
              {type.name}
            </Link>
            {type.id !== "blocks" && (
              <>
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                <Link
                  href={`/components?category=${encodeURIComponent(component.category)}`}
                  className="rounded-sm transition-colors hover:text-foreground"
                >
                  {component.category}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <span aria-current="page" className="truncate text-foreground">
              {component.name}
            </span>
          </nav>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
            {component.name}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-pretty text-muted-foreground">
            {component.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
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

      <ComponentPlayground slug={component.slug} source={source} fileName={targetPath} />

      <Section>
        <div className="grid gap-8 px-6 py-12 md:grid-cols-[220px_1fr] md:px-10">
          <div>
            <Eyebrow>Installation</Eyebrow>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Add it with the shadcn CLI, or copy the source into your project.
            </p>
          </div>
          <InstallTabs
            command={getInstallCommand(component.slug)}
            dependencies={component.dependencies ?? []}
            targetPath={targetPath}
            source={source}
          />
        </div>
      </Section>

      <Section>
        <nav aria-label="Pagination" className="grid grid-cols-2 gap-px bg-line">
          {[prev, next].map((c, i) =>
            c ? (
              <Link
                key={c.slug}
                href={`/components/${c.slug}`}
                className={cn(
                  "group relative flex min-w-0 flex-col gap-1 bg-background px-6 py-6 transition-colors hover:bg-[color-mix(in_oklab,var(--background)_97.5%,var(--foreground))] md:px-10 ",
                  i === 1 && "items-end text-right"
                )}
              >
                <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  {i === 0 && <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />}
                  {i === 0 ? "Previous" : "Next"}
                  {i === 1 && <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />}
                </span>
                <span className="max-w-full truncate text-sm font-medium text-foreground">{c.name}</span>
              </Link>
            ) : (
              <div key={i} aria-hidden className="bg-hatch bg-background" />
            )
          )}
        </nav>
      </Section>
    </>
  );
}
