"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { PanelLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { animatedIcons, iconSets } from "@/lib/icon-registry";
import { componentTypes, componentsRegistry, groupByCategory } from "@/lib/registry";

type NavLink = { name: string; href: string; count?: number; isNew?: boolean };
type NavGroup = { heading?: string; headingHref?: string; links: NavLink[] };
type NavSection = { title: string; count?: number; href?: string; groups: NavGroup[] };

const sections: NavSection[] = [
  {
    title: "Getting started",
    groups: [
      {
        links: [
          { name: "All components", href: "/components", count: componentsRegistry.length },
          { name: "Installation", href: "/docs#installation" },
          { name: "Theming", href: "/docs#theming" },
        ],
      },
    ],
  },
  ...componentTypes.map((type) => {
    const groups = groupByCategory(type.id);
    return {
      title: type.name,
      href: `/components?type=${type.id}`,
      count: groups.reduce((n, g) => n + g.items.length, 0),
      // Blocks is a single category, so skip the redundant sub-heading.
      groups: groups.map((g) => ({
        heading: groups.length > 1 ? g.category : undefined,
        headingHref: `/components?category=${encodeURIComponent(g.category)}`,
        links: g.items.map((c) => ({ name: c.name, href: `/components/${c.slug}`, isNew: c.isNew })),
      })),
    };
  }),
  {
    title: "Icons",
    href: "/icons",
    count: animatedIcons.length * iconSets.length,
    groups: [
      {
        links: iconSets.map((s) => ({
          name: `${s.name} set`,
          href: s.id === "thock" ? "/icons" : `/icons?set=${s.id}`,
          count: animatedIcons.length,
        })),
      },
    ],
  },
];

/** Sticky left rail on desktop; a slide-over drawer below lg. */
export function ComponentsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Close the drawer whenever the route changes.
  const [seen, setSeen] = React.useState(pathname);
  if (pathname !== seen) {
    setSeen(pathname);
    setOpen(false);
  }

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <aside
        aria-label="Components"
        className="sticky top-[72px] hidden h-[calc(100dvh-72px)] border-r border-line lg:block"
      >
        <SidebarNav pathname={pathname} layoutId="sidebar-active" />
      </aside>

      {/* below lg: a slim bar that opens the same nav as a drawer */}
      <div className="sticky top-[72px] z-30 border-b border-line bg-background/85 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="flex h-11 w-full items-center gap-2 px-6 text-[13px] text-muted-foreground transition-colors hover:text-foreground md:px-10"
        >
          <PanelLeft className="h-4 w-4" />
          <span>Browse components</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Browse components">
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute inset-y-0 left-0 flex w-[min(300px,85vw)] flex-col bg-background shadow-float"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 420, damping: 40 }}
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-line pr-3 pl-5">
                <span className="text-sm font-medium text-foreground">Browse</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  autoFocus
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground hover:shadow-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <SidebarNav pathname={pathname} layoutId="drawer-active" onNavigate={() => setOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarNav({
  pathname,
  layoutId,
  onNavigate,
}: {
  pathname: string;
  layoutId: string;
  onNavigate?: () => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Keep the current page's link in view, e.g. after landing on a deep link.
  React.useEffect(() => {
    const el = scrollRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    const box = scrollRef.current;
    if (!el || !box) return;
    const top = el.offsetTop - box.offsetTop;
    if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 40) {
      box.scrollTo({ top: top - box.clientHeight / 3 });
    }
  }, [pathname]);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto overscroll-contain px-3 pt-6 pb-16 [scrollbar-width:thin] [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-40px),transparent)]"
    >
      <nav className="flex flex-col gap-7">
        {sections.map((section) => (
          <div key={section.title}>
            <SectionTitle section={section} onNavigate={onNavigate} />
            <div className="mt-1.5 flex flex-col gap-3">
              {section.groups.map((group, i) => (
                <div key={group.heading ?? i}>
                  {group.heading && (
                    <Link
                      href={group.headingHref!}
                      onClick={onNavigate}
                      className="mb-0.5 flex h-7 items-center px-3 text-[12px] text-muted-foreground/80 transition-colors hover:text-foreground"
                    >
                      {group.heading}
                    </Link>
                  )}
                  <ul className={cn("flex flex-col", group.heading && "ml-3 border-l border-line pl-1.5")}>
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <NavItem link={link} active={isActive(pathname, link.href)} layoutId={layoutId} onNavigate={onNavigate} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

function isActive(pathname: string, href: string) {
  const path = href.split(/[?#]/)[0];
  // Hash and query links share a path with another entry; only exact page links light up.
  if (href !== path) return false;
  return pathname === path;
}

function SectionTitle({ section, onNavigate }: { section: NavSection; onNavigate?: () => void }) {
  const content = (
    <>
      <span>{section.title}</span>
      {section.count !== undefined && (
        <span className="font-mono text-[11px] font-normal text-muted-foreground tabular-nums">{section.count}</span>
      )}
    </>
  );
  const className = "flex h-7 items-center justify-between px-3 text-[13px] font-semibold text-foreground";
  return section.href ? (
    <Link
      href={section.href}
      onClick={onNavigate}
      prefetch={section.href.startsWith("/icons") ? false : undefined}
      className={cn(className, "rounded-lg transition-colors hover:bg-surface-2")}>
      {content}
    </Link>
  ) : (
    <p className={className}>{content}</p>
  );
}

function NavItem({
  link,
  active,
  layoutId,
  onNavigate,
}: {
  link: NavLink;
  active: boolean;
  layoutId: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      prefetch={link.href.startsWith("/icons") ? false : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-8 items-center gap-2 rounded-lg px-3 text-[13px] transition-colors",
        active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-lg bg-surface shadow-btn"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      <span
        aria-hidden
        className={cn(
          "relative h-1 w-1 shrink-0 rounded-full bg-current transition-opacity",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
        )}
      />
      <span className="relative min-w-0 flex-1 truncate">{link.name}</span>
      {link.isNew && (
        <span className="relative rounded-full bg-emerald-500/10 px-1.5 py-px text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
          New
        </span>
      )}
      {link.count !== undefined && (
        <span className="relative font-mono text-[11px] text-muted-foreground tabular-nums">{link.count}</span>
      )}
    </Link>
  );
}
