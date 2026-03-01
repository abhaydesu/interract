export interface ComponentMeta {
  name: string;
  description: string;
  category: string;
  tags: string[];
  installation: string;
  path: string;
}

export const componentsRegistry: ComponentMeta[] = [
  {
    name: "Button",
    description: "A clickable button component with multiple variants and sizes.",
    category: "Actions",
    tags: ["button", "click", "action"],
    installation: "npx shadcn@latest add button",
    path: "/components/ui/button.tsx",
  },
  {
    name: "Card",
    description: "A container component for grouping related content and actions.",
    category: "Layout",
    tags: ["card", "container", "box"],
    installation: "npx shadcn@latest add card",
    path: "/components/ui/card.tsx",
  },
  {
    name: "Accordion",
    description: "A vertically stacked set of interactive headings that expand to reveal content.",
    category: "Disclosure",
    tags: ["accordion", "expand", "collapse"],
    installation: "npx shadcn@latest add accordion",
    path: "/components/ui/accordion.tsx",
  },
  {
    name: "Popover",
    description: "A floating panel that appears near a trigger element.",
    category: "Overlay",
    tags: ["popover", "tooltip", "floating"],
    installation: "npx shadcn@latest add popover",
    path: "/components/ui/popover.tsx",
  },
  {
    name: "Tooltip",
    description: "A popup that displays information related to an element.",
    category: "Overlay",
    tags: ["tooltip", "info", "hint"],
    installation: "npx shadcn@latest add tooltip",
    path: "/components/ui/tooltip.tsx",
  },
  {
    name: "Badge",
    description: "A small status indicator or label component.",
    category: "Data Display",
    tags: ["badge", "label", "tag"],
    installation: "npx shadcn@latest add badge",
    path: "/components/ui/badge.tsx",
  },
  {
    name: "HoverCard",
    description: "A card that appears on hover with additional information.",
    category: "Overlay",
    tags: ["hover", "card", "preview"],
    installation: "npx shadcn@latest add hover-card",
    path: "/components/ui/hover-card.tsx",
  },
  {
    name: "IconButton",
    description: "A button component specifically designed for icons.",
    category: "Actions",
    tags: ["button", "icon", "action"],
    installation: "npx shadcn@latest add button",
    path: "/components/ui/icon-button.tsx",
  },
];

export const categories = [
  "All",
  "Actions",
  "Layout",
  "Disclosure",
  "Overlay",
  "Data Display",
];
