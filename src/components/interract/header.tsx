"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { Github, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

const navigation = [
  { name: "Components", href: "/components" },
  { name: "Icons", href: "/icons" },
  { name: "Docs", href: "/docs" },
  { name: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  // Pages restored mid-scroll (reload, back/forward) never fire a scroll event.
  React.useEffect(() => setScrolled(window.scrollY > 24), []);

  React.useEffect(() => setOpen(false), [pathname]);

  // Close the mobile menu on Escape or a tap outside it.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="fixed inset-x-0 top-0 z-[60] px-4 pt-3">
      <a
        href="#main"
        className="sr-only rounded-lg bg-surface px-3 py-2 text-sm font-medium text-foreground shadow-float focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-10"
      >
        Skip to content
      </a>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={cn(
          "mx-auto flex h-12 items-center justify-between rounded-2xl pr-1.5 pl-4 transition-[max-width,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled || open
            ? "max-w-3xl bg-white/75 shadow-float backdrop-blur-xl dark:bg-neutral-950/70"
            : "max-w-6xl bg-transparent"
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="font-pixel text-[17px] tracking-tight text-foreground">
            Interract
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center md:flex"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navigation.map((item, index) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHoveredIndex(index)}
                className="relative rounded-lg px-3 py-1.5 text-[13px] font-medium"
              >
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-lg bg-black/[0.04] dark:bg-white/[0.06]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </AnimatePresence>
                <span
                  className={cn(
                    "relative transition-colors",
                    active
                      ? "text-foreground"
                      : "text-neutral-500 hover:text-foreground dark:text-neutral-400"
                  )}
                >
                  {item.name}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-px h-px bg-foreground"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-8 items-center gap-1.5 rounded-lg bg-surface px-2.5 text-xs font-medium text-foreground shadow-btn transition-transform active:scale-[0.97] sm:inline-flex"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-black/[0.04] md:hidden dark:hover:bg-white/[0.06]"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 max-w-3xl rounded-2xl bg-white/90 p-1.5 shadow-float backdrop-blur-xl md:hidden dark:bg-neutral-950/90"
          >
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                    active ? "bg-black/[0.03] text-foreground dark:bg-white/[0.04]" : "text-neutral-500 dark:text-neutral-400"
                  )}
                >
                  {item.name}
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-foreground" />}
                </Link>
              );
            })}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-black/[0.04] sm:hidden dark:text-neutral-400 dark:hover:bg-white/[0.06]"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid h-6 w-6 grid-cols-3 gap-[2px] rounded-[7px] bg-neutral-900 p-[5px] shadow-btn-primary dark:bg-white",
        className
      )}
      aria-hidden
    >
      {[1, 0, 1, 0, 1, 0, 1, 0, 1].map((on, i) => (
        <span
          key={i}
          className={cn(
            "rounded-[1px]",
            on ? "bg-white dark:bg-neutral-900" : "bg-white/25 dark:bg-neutral-900/20"
          )}
        />
      ))}
    </span>
  );
}
