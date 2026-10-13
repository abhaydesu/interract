"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export function CategoryMenu({
  value,
  options,
  counts,
  onChange,
}: {
  value: string;
  options: string[];
  counts: Record<string, number>;
  onChange: (value: string) => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Category: ${value}`}
          className="group flex h-9 shrink-0 items-center gap-2 rounded-[10px] bg-surface pr-2.5 pl-3 text-[13px] font-medium text-foreground shadow-btn transition-colors hover:bg-surface-2 data-[state=open]:bg-surface-2"
        >
          <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
          <span>
            {value === "All" ? (
              <>
                All<span className="max-[439px]:hidden"> categories</span>
              </>
            ) : (
              value
            )}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums max-[439px]:hidden">
            {counts[value] ?? 0}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-[200px] rounded-xl bg-popover p-1 text-popover-foreground shadow-float outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1"
        >
          <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>
            {options.map((option, i) => (
              <React.Fragment key={option}>
                {i === 1 && <DropdownMenu.Separator className="mx-2 my-1 h-px bg-line" />}
                <DropdownMenu.RadioItem
                  value={option}
                  className={cn(
                    "relative flex h-8 cursor-default items-center gap-2 rounded-lg pr-2.5 pl-7 text-[13px] text-neutral-600 outline-none select-none dark:text-neutral-400",
                    "data-[highlighted]:bg-black/[0.045] data-[highlighted]:text-foreground data-[state=checked]:text-foreground dark:data-[highlighted]:bg-white/[0.06]"
                  )}
                >
                  <DropdownMenu.ItemIndicator className="absolute left-2 flex items-center">
                    <Check className="h-3.5 w-3.5" />
                  </DropdownMenu.ItemIndicator>
                  <span className="flex-1">{option === "All" ? "All categories" : option}</span>
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{counts[option] ?? 0}</span>
                </DropdownMenu.RadioItem>
              </React.Fragment>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
