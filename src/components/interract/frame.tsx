import * as React from "react";
import { cn } from "@/lib/utils";

export function PlusMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 11 11"
      className={cn(
        "pointer-events-none absolute z-10 h-[11px] w-[11px] text-neutral-300 dark:text-neutral-700",
        className
      )}
    >
      <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Section({
  children,
  className,
  marks = true,
  bleed = true,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  marks?: boolean;
  bleed?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative", className)}>
      {bleed && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 bg-line"
        />
      )}
      {marks && (
        <>
          <PlusMark className="-top-[5px] -left-[6px]" />
          <PlusMark className="-top-[5px] -right-[6px]" />
        </>
      )}
      {children}
    </section>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  muted,
  description,
  action,
  className,
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  muted?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 px-6 pt-16 pb-10 md:flex-row md:items-end md:justify-between md:px-10",
        className
      )}
    >
      <div className="max-w-xl">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance text-foreground md:text-4xl">
          {title}
          {muted && (
            <span className="text-neutral-400 dark:text-neutral-500"> {muted}</span>
          )}
        </h2>
        {description && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-[11px] tracking-wider text-muted-foreground uppercase",
        className
      )}
    >
      {index && (
        <span className="font-pixel text-[13px] text-foreground/80">{index}</span>
      )}
      {index && <span className="h-px w-5 bg-line-strong" />}
      <span>{children}</span>
    </div>
  );
}

/** Small tactile keycap, e.g. <Kbd>⌘</Kbd> */
export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] bg-surface px-1 font-sans text-[11px] font-medium text-neutral-500 shadow-key dark:text-neutral-400",
        className
      )}
    >
      {children}
    </kbd>
  );
}
