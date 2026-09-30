import { Accessibility, Github, Sparkles, SwatchBook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/interract/page-shell";
import { Eyebrow, Section } from "@/components/interract/frame";

const pillars = [
  { icon: Accessibility, title: "Accessible", body: "Built on Radix UI primitives for full accessibility support out of the box." },
  { icon: Sparkles, title: "Animated", body: "Micro-interactions powered by Motion — short, interruptible, purposeful." },
  { icon: SwatchBook, title: "Customizable", body: "Tailwind tokens for shadows, lines and surfaces make theming trivial." },
];

const stack = ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Radix UI", "Lucide"];

export default function AboutPage() {
  return (
    <PageShell>
      <Section marks={false} bleed={false}>
        <div className="px-6 pt-16 pb-12 md:px-10">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-balance text-foreground md:text-5xl">
            Interfaces should feel{" "}
            <span className="text-neutral-400 dark:text-neutral-500">as good as they look.</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Interract is a component library focused on interactive UI, micro-interactions and
            motion-enhanced design — built with accessibility and developer experience in mind.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-background p-6 md:p-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface text-muted-foreground shadow-btn">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="mt-6 text-sm font-medium text-foreground">{title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <Eyebrow>Built with</Eyebrow>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {stack.map((tech) => (
                <span key={tech} className="rounded-lg bg-surface px-2.5 py-1 text-xs text-foreground shadow-btn">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github /> GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter /> Twitter
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
