"use client";

import * as React from "react";
import { Bell, Heart, Home, Settings, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { IconButton } from "@/components/ui/icon-button";
import { AnimatedIcon } from "@/components/interract/animated-icon";
import { CommandMenu } from "@/components/blocks/command-menu";
import { NotificationStack } from "@/components/blocks/notification-stack";
import { StatCard } from "@/components/blocks/stat-card";
import { PricingToggle } from "@/components/blocks/pricing-toggle";
import { NowPlaying } from "@/components/blocks/now-playing";
import { OtpInput } from "@/components/blocks/otp-input";
import { SettingsList } from "@/components/blocks/settings-list";
import { AvatarStack } from "@/components/blocks/avatar-stack";

function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Button>Deploy</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="secondary">Draft</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  );
}

function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge>New</Badge>
      <Badge variant="outline">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
      </Badge>
      <Badge variant="secondary">v2.4.0</Badge>
      <Badge variant="destructive">Failed</Badge>
    </div>
  );
}

function CardDemo() {
  return (
    <Card className="w-full max-w-[280px]">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm">Weekly digest</CardTitle>
        <CardDescription className="text-xs">A summary of your team’s activity.</CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            ["128", "commits"],
            ["14", "PRs"],
            ["3", "releases"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-lg bg-surface-2 px-2 py-2 shadow-inset">
              <p className="text-sm font-semibold text-foreground tabular-nums">{n}</p>
              <p className="text-[10px] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-line px-5 py-3">
        <Button size="sm" variant="outline" className="h-7 w-full text-xs">
          View report
        </Button>
      </CardFooter>
    </Card>
  );
}

function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="a" className="w-full max-w-sm">
      <AccordionItem value="a">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. Built on Radix primitives with full keyboard support.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Can I customize it?</AccordionTrigger>
        <AccordionContent>You own the source. Change anything.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Does it respect reduced motion?</AccordionTrigger>
        <AccordionContent>Animations are short and interruptible.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Share</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <p className="text-sm font-medium text-foreground">Share this component</p>
        <p className="mt-1 text-xs text-muted-foreground">Anyone with the link can view.</p>
        <div className="mt-3 flex gap-2">
          <input
            readOnly
            value="interract.dev/c/button"
            className="h-8 flex-1 rounded-lg bg-surface-2 px-2.5 font-mono text-[11px] text-muted-foreground shadow-inset outline-none"
          />
          <Button size="sm" className="h-8">Copy</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TooltipDemo() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex gap-1.5 rounded-xl bg-surface p-1 shadow-soft">
        {[
          [Home, "Home"],
          [Star, "Favorites"],
          [Bell, "Inbox"],
          [Settings, "Settings"],
        ].map(([Icon, label]) => {
          const I = Icon as React.ElementType;
          return (
            <Tooltip key={label as string}>
              <TooltipTrigger asChild>
                <IconButton variant="ghost" aria-label={label as string}>
                  <I />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>{label as string}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

function HoverCardDemo() {
  return (
    <p className="text-sm text-muted-foreground">
      Built by{" "}
      <HoverCard openDelay={100}>
        <HoverCardTrigger asChild>
          <a href="#" className="font-medium text-foreground underline decoration-line-strong underline-offset-4">
            @interract
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 font-pixel text-xs text-white dark:bg-white dark:text-neutral-900">
              in
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Interract</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Components that move with intent.</p>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">Joined March 2026</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </p>
  );
}

function IconButtonDemo() {
  return (
    <div className="flex gap-2">
      <IconButton aria-label="Home"><Home /></IconButton>
      <IconButton variant="outline" aria-label="Settings"><Settings /></IconButton>
      <IconButton variant="secondary" aria-label="Notifications"><Bell /></IconButton>
      <IconButton variant="ghost" aria-label="Like"><Heart /></IconButton>
    </div>
  );
}

function AnimatedIconDemo() {
  const presets = [
    [Bell, "wiggle"],
    [Heart, "pulse"],
    [Settings, "spin"],
    [Zap, "shake"],
    [Sparkles, "bounce"],
  ] as const;
  return (
    <div className="flex gap-2">
      {presets.map(([Icon, preset]) => (
        <div
          key={preset}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-neutral-600 shadow-btn dark:text-neutral-300"
        >
          <AnimatedIcon icon={Icon} preset={preset} size={18} />
        </div>
      ))}
    </div>
  );
}

export const previews: Record<string, () => React.ReactNode> = {
  "command-menu": () => <CommandMenu />,
  "notification-stack": () => <NotificationStack />,
  "stat-card": () => <StatCard />,
  "pricing-toggle": () => <PricingToggle />,
  "now-playing": () => <NowPlaying />,
  "otp-input": () => <OtpInput />,
  "settings-list": () => <SettingsList />,
  "avatar-stack": () => <AvatarStack />,
  button: () => <ButtonDemo />,
  card: () => <CardDemo />,
  accordion: () => <AccordionDemo />,
  badge: () => <BadgeDemo />,
  popover: () => <PopoverDemo />,
  tooltip: () => <TooltipDemo />,
  "hover-card": () => <HoverCardDemo />,
  "icon-button": () => <IconButtonDemo />,
  "animated-icon": () => <AnimatedIconDemo />,
};

export function Preview({ slug }: { slug: string }) {
  const render = previews[slug];
  return render ? <>{render()}</> : (
    <span className="font-mono text-[11px] text-muted-foreground">No preview</span>
  );
}
