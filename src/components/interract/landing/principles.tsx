import { Accessibility, Code2, MoonStar, Waves } from "lucide-react";
import { Section, SectionHeader } from "@/components/interract/frame";

const principles = [
  {
    icon: Waves,
    title: "Motion with restraint",
    body: "Springs tuned to settle fast. Animation explains state changes — it never performs for its own sake.",
    visual: <SpringCurve />,
  },
  {
    icon: Accessibility,
    title: "Accessible by default",
    body: "Radix primitives underneath. Focus rings, roles and keyboard paths come standard.",
    visual: <FocusRing />,
  },
  {
    icon: Code2,
    title: "You own the code",
    body: "Installed through the shadcn CLI straight into your repo. No runtime package, no lock-in.",
    visual: <FileTree />,
  },
  {
    icon: MoonStar,
    title: "Dark mode, natively",
    body: "Shadows, rings and highlights are re-tuned per theme — not just inverted.",
    visual: <ThemeSwatch />,
  },
];

export function Principles() {
  return (
    <Section>
      <SectionHeader
        index="02"
        eyebrow="Principles"
        title="Quiet by design."
        muted="Crafted in the details."
      />
      <div className="grid grid-cols-1 gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {principles.map(({ icon: Icon, title, body, visual }) => (
          <div key={title} className="flex flex-col bg-background p-6">
            <div className="flex h-28 items-center justify-center rounded-xl bg-surface-2/60 shadow-inset">
              {visual}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">{title}</h3>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-pretty text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SpringCurve() {
  return (
    <svg viewBox="0 0 160 60" className="h-16 w-40 text-foreground">
      <path d="M0 50 H160" className="stroke-line-strong" strokeDasharray="2 3" />
      <path
        d="M4 50 C 30 50, 38 4, 62 8 S 88 22, 100 16 S 122 12, 156 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="156" cy="12" r="3" className="fill-surface stroke-foreground" strokeWidth="1.5" />
    </svg>
  );
}

function FocusRing() {
  return (
    <span className="inline-flex h-8 items-center rounded-lg bg-surface px-3 text-xs font-medium text-foreground shadow-[var(--sh-btn),0_0_0_4px_var(--background),0_0_0_5.5px_rgb(120_120_120/0.5)]">
      Continue
    </span>
  );
}

function FileTree() {
  return (
    <div className="font-mono text-[11px] leading-5 text-muted-foreground">
      <p>components/</p>
      <p className="pl-3">ui/</p>
      <p className="pl-6 text-foreground">button.tsx</p>
      <p className="pl-6">command-menu.tsx</p>
    </div>
  );
}

function ThemeSwatch() {
  return (
    <div className="flex gap-2">
      <span className="h-12 w-12 rounded-xl bg-white shadow-[0_0_0_1px_rgb(38_38_43/0.08),0_4px_8px_-2px_rgb(38_38_43/0.1),inset_0_1px_0_white]" />
      <span className="h-12 w-12 rounded-xl bg-[#111] shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_4px_8px_-2px_rgb(0_0_0/0.5),inset_0_1px_0_rgb(255_255_255/0.08)]" />
    </div>
  );
}
