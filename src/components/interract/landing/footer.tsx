import Link from "next/link";
import { LogoMark } from "@/components/interract/header";
import { Section } from "@/components/interract/frame";

const footerLinks = [
  {
    title: "Library",
    links: [
      { name: "Components", href: "/components" },
      { name: "Icons", href: "/icons" },
      { name: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Getting started", href: "/docs" },
      { name: "About", href: "/about" },
      { name: "GitHub", href: "https://github.com/interract" },
    ],
  },
];

export function Footer() {
  return (
    <Section>
      <footer className="px-6 pt-14 pb-8 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2">
              <LogoMark />
              <span className="font-pixel text-[17px] tracking-tight text-foreground">Interract</span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Open-source components with micro-interactions built in. shadcn compatible.
            </p>
          </div>

          <div className="flex gap-16">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-neutral-600 transition-colors hover:text-foreground dark:text-neutral-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-dashed border-line-strong pt-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Interract · MIT License
          </p>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            All systems normal
          </span>
        </div>
      </footer>
      <div className="font-pixel pointer-events-none overflow-hidden px-4 text-center text-[14vw] leading-[0.8] text-black/[0.035] select-none xl:text-[160px] dark:text-white/[0.035]" aria-hidden>
        Interract
      </div>
    </Section>
  );
}
