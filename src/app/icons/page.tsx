"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronDown,
  Home, Menu, Settings, Search, Heart, Star, Mail, Bell,
  Download, Upload, Copy, Edit, Trash, Eye, Play, Pause,
  Image, File, Folder, Plus, Minus, Check, X, Zap, Sparkles, Box,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/interract/page-shell";
import { Eyebrow, Section } from "@/components/interract/frame";
import { AnimatedIcon } from "@/components/interract/animated-icon";
import { animatedIcons, iconCategories } from "@/lib/icon-registry";

const iconMap: Record<string, LucideIcon> = {
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronDown,
  Home, Menu, Settings, Search, Heart, Star, Mail, Bell,
  Download, Upload, Copy, Edit, Trash, Eye, Play, Pause,
  Image, File, Folder, Plus, Minus, Check, X, Zap, Sparkles, Box,
};

export default function IconsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const icons = animatedIcons.filter(
    (i) => selectedCategory === "All" || i.category === selectedCategory
  );

  const copyToClipboard = (iconName: string) => {
    navigator.clipboard.writeText(`import { ${iconName} } from "lucide-react"`);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 1600);
  };

  return (
    <PageShell>
      <Section marks={false} bleed={false}>
        <div className="px-6 pt-16 pb-10 md:px-10">
          <Eyebrow>{animatedIcons.length} icons</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">Icons</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Lucide icons with motion on hover. Click any icon to copy its import.
          </p>
        </div>
      </Section>

      <Section>
        <div className="-mx-1 flex gap-0.5 overflow-x-auto px-7 py-4 md:px-11">
          {iconCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "relative h-8 shrink-0 rounded-lg px-3 text-[13px] font-medium transition-colors",
                selectedCategory === cat ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {selectedCategory === cat && (
                <motion.span
                  layoutId="icon-cat"
                  className="absolute inset-0 rounded-lg bg-surface shadow-btn"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{cat}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-px border-t border-line bg-line sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {icons.map((item) => {
            const Icon = iconMap[item.name];
            if (!Icon) return null;
            return (
              <button
                key={item.name}
                onClick={() => copyToClipboard(item.name)}
                onMouseEnter={() => setHoveredIcon(item.name)}
                onMouseLeave={() => setHoveredIcon(null)}
                className="group relative flex aspect-square flex-col items-center justify-center gap-3 bg-background transition-colors hover:bg-surface"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-600 transition-shadow group-hover:bg-surface group-hover:shadow-btn dark:text-neutral-300">
                  <AnimatedIcon icon={Icon} preset={hoveredIcon === item.name ? "bounce" : "none"} size={18} />
                </span>
                <span className="max-w-full truncate px-2 font-mono text-[10px] text-muted-foreground">
                  {item.name}
                </span>
                <AnimatePresence>
                  {copiedIcon === item.name && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-neutral-900 px-1.5 py-0.5 text-[10px] text-white dark:bg-white dark:text-neutral-900"
                    >
                      <Check className="h-2.5 w-2.5" /> Copied
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </Section>
    </PageShell>
  );
}
