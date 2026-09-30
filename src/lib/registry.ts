export interface ComponentMeta {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  path: string;
  dependencies?: string[];
}

export const REGISTRY_URL = "https://interract.dev/r";

export const componentsRegistry: ComponentMeta[] = [
  {
    name: "CommandMenu",
    slug: "command-menu",
    description: "A ⌘K command palette with filtering, keyboard navigation and a spring-driven highlight.",
    category: "Blocks",
    tags: ["command", "palette", "search", "keyboard"],
    path: "/components/blocks/command-menu.tsx",
    dependencies: ["motion", "lucide-react"],
  },
  {
    name: "NotificationStack",
    slug: "notification-stack",
    description: "Stacked notifications that fan out on hover and can be dismissed individually.",
    category: "Blocks",
    tags: ["notification", "toast", "stack"],
    path: "/components/blocks/notification-stack.tsx",
    dependencies: ["motion", "lucide-react"],
  },
  {
    name: "StatCard",
    slug: "stat-card",
    description: "KPI card with a range switcher, morphing sparkline and hover scrubber.",
    category: "Blocks",
    tags: ["stats", "chart", "sparkline", "dashboard"],
    path: "/components/blocks/stat-card.tsx",
    dependencies: ["motion", "lucide-react"],
  },
  {
    name: "PricingToggle",
    slug: "pricing-toggle",
    description: "Pricing card with a segmented billing switch and rolling digits.",
    category: "Blocks",
    tags: ["pricing", "toggle", "number"],
    path: "/components/blocks/pricing-toggle.tsx",
    dependencies: ["motion", "lucide-react"],
  },
  {
    name: "NowPlaying",
    slug: "now-playing",
    description: "Compact media player with dot-matrix art, live equalizer and scrubbable progress.",
    category: "Blocks",
    tags: ["media", "player", "audio"],
    path: "/components/blocks/now-playing.tsx",
    dependencies: ["motion", "lucide-react"],
  },
  {
    name: "OtpInput",
    slug: "otp-input",
    description: "One-time-code field with native paste/autofill, animated slots and verify states.",
    category: "Blocks",
    tags: ["otp", "input", "form", "auth"],
    path: "/components/blocks/otp-input.tsx",
    dependencies: ["motion", "lucide-react"],
  },
  {
    name: "SettingsList",
    slug: "settings-list",
    description: "Grouped preference rows with tactile, spring-loaded switches.",
    category: "Blocks",
    tags: ["settings", "switch", "toggle", "form"],
    path: "/components/blocks/settings-list.tsx",
    dependencies: ["motion", "lucide-react"],
  },
  {
    name: "AvatarStack",
    slug: "avatar-stack",
    description: "Overlapping team avatars that fan out on hover, with an inline invite action.",
    category: "Blocks",
    tags: ["avatar", "team", "group"],
    path: "/components/blocks/avatar-stack.tsx",
    dependencies: ["motion", "lucide-react"],
  },
  {
    name: "Button",
    slug: "button",
    description: "A clickable button component with multiple variants, sizes, and an interract-specific motion variant.",
    category: "Actions",
    tags: ["button", "click", "action"],
    path: "/components/ui/button.tsx",
    dependencies: ["@radix-ui/react-slot", "class-variance-authority", "motion"],
  },
  {
    name: "Card",
    slug: "card",
    description: "A container component for grouping related content and actions.",
    category: "Layout",
    tags: ["card", "container", "box"],
    path: "/components/ui/card.tsx",
  },
  {
    name: "Accordion",
    slug: "accordion",
    description: "A vertically stacked set of interactive headings that expand to reveal content.",
    category: "Disclosure",
    tags: ["accordion", "expand", "collapse"],
    path: "/components/ui/accordion.tsx",
    dependencies: ["@radix-ui/react-accordion", "lucide-react", "motion"],
  },
  {
    name: "Popover",
    slug: "popover",
    description: "A floating panel that appears near a trigger element.",
    category: "Overlay",
    tags: ["popover", "tooltip", "floating"],
    path: "/components/ui/popover.tsx",
    dependencies: ["@radix-ui/react-popover"],
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    description: "A popup that displays information related to an element.",
    category: "Overlay",
    tags: ["tooltip", "info", "hint"],
    path: "/components/ui/tooltip.tsx",
    dependencies: ["@radix-ui/react-tooltip"],
  },
  {
    name: "Badge",
    slug: "badge",
    description: "A small status indicator or label component.",
    category: "Data Display",
    tags: ["badge", "label", "tag"],
    path: "/components/ui/badge.tsx",
  },
  {
    name: "HoverCard",
    slug: "hover-card",
    description: "A card that appears on hover with additional information.",
    category: "Overlay",
    tags: ["hover", "card", "preview"],
    path: "/components/ui/hover-card.tsx",
    dependencies: ["@radix-ui/react-hover-card"],
  },
  {
    name: "IconButton",
    slug: "icon-button",
    description: "A button component specifically designed for icons.",
    category: "Actions",
    tags: ["button", "icon", "action"],
    path: "/components/ui/icon-button.tsx",
  },
  {
    name: "AnimatedIcon",
    slug: "animated-icon",
    description: "An icon component with built-in motion and micro-interactions.",
    category: "Data Display",
    tags: ["icon", "motion", "animation"],
    path: "/components/interract/animated-icon.tsx",
    dependencies: ["motion", "lucide-react"],
  },
];

export const categories = [
  "All",
  "Actions",
  "Layout",
  "Disclosure",
  "Overlay",
  "Data Display",
  "Blocks",
];

export function getInstallCommand(slug: string) {
  return `npx shadcn@latest add "${REGISTRY_URL}/${slug}.json"`;
}
