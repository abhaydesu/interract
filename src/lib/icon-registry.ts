import type { ThockIconName } from "@/components/icons/thock-icons";

export const iconSets = [
  {
    id: "thock",
    name: "Standard",
    file: "thock-icons",
    blurb: "Thick strokes, soft bodies and parts that move. Press for the thock.",
  },
  {
    id: "bubbly",
    name: "Bubbly",
    file: "bubbly-icons",
    blurb: "Inflated, glossy and squishy. Hover for the jelly, press for the squish.",
  },
] as const;

export type IconSetId = (typeof iconSets)[number]["id"];

export interface IconMeta {
  name: ThockIconName;
  category: string;
  /** What the icon does on hover in each set, shown in the gallery. */
  motion: Record<IconSetId, string>;
}

export const iconCategories = [
  "All",
  "Actions",
  "Communication",
  "Navigation",
  "Social",
  "Media",
  "Files",
  "Arrows",
];

export const animatedIcons: IconMeta[] = [
  { name: "ArrowRight", category: "Arrows", motion: { thock: "Nudges forward", bubbly: "Bounces forward" } },
  { name: "ArrowLeft", category: "Arrows", motion: { thock: "Nudges back", bubbly: "Bounces back" } },
  { name: "ArrowUp", category: "Arrows", motion: { thock: "Nudges up", bubbly: "Bounces up" } },
  { name: "ArrowDown", category: "Arrows", motion: { thock: "Nudges down", bubbly: "Bounces down" } },
  { name: "ChevronRight", category: "Arrows", motion: { thock: "Steps right", bubbly: "Hops right" } },
  { name: "ChevronDown", category: "Arrows", motion: { thock: "Steps down", bubbly: "Hops down" } },
  { name: "Home", category: "Navigation", motion: { thock: "Roof lifts, light on", bubbly: "Door blinks, chimney puffs" } },
  { name: "Menu", category: "Navigation", motion: { thock: "Lines stagger", bubbly: "Pills jiggle" } },
  { name: "Settings", category: "Navigation", motion: { thock: "Gear turns", bubbly: "Flower-gear spins" } },
  { name: "Search", category: "Actions", motion: { thock: "Lens tilts, glints", bubbly: "Lens tilts" } },
  { name: "Heart", category: "Social", motion: { thock: "Beats and fills", bubbly: "Swells, bubbles float" } },
  { name: "Star", category: "Social", motion: { thock: "Spins and fills", bubbly: "Wobbles" } },
  { name: "Mail", category: "Communication", motion: { thock: "Flap opens", bubbly: "Flap pops open" } },
  { name: "Bell", category: "Communication", motion: { thock: "Rings", bubbly: "Jelly ring" } },
  { name: "Download", category: "Actions", motion: { thock: "Drops into tray", bubbly: "Plops into tray" } },
  { name: "Upload", category: "Actions", motion: { thock: "Lifts out of tray", bubbly: "Springs out" } },
  { name: "Copy", category: "Actions", motion: { thock: "Sheets separate", bubbly: "Peels apart" } },
  { name: "Edit", category: "Actions", motion: { thock: "Scribbles a line", bubbly: "Doodles a line" } },
  { name: "Trash", category: "Actions", motion: { thock: "Lid pops", bubbly: "Lid hops" } },
  { name: "Eye", category: "Actions", motion: { thock: "Blinks, glances", bubbly: "Blinks, glances" } },
  { name: "Play", category: "Media", motion: { thock: "Pushes and fills", bubbly: "Boops forward" } },
  { name: "Pause", category: "Media", motion: { thock: "Bars pump", bubbly: "Bars bounce" } },
  { name: "Image", category: "Media", motion: { thock: "Sun rises", bubbly: "Sun rises" } },
  { name: "File", category: "Files", motion: { thock: "Lines rewrite", bubbly: "Lines rewrite" } },
  { name: "Folder", category: "Files", motion: { thock: "Flap opens", bubbly: "Flap flops open" } },
  { name: "Plus", category: "Actions", motion: { thock: "Quarter turn", bubbly: "Spins a quarter" } },
  { name: "Minus", category: "Actions", motion: { thock: "Squeezes", bubbly: "Squishes" } },
  { name: "Check", category: "Actions", motion: { thock: "Redraws", bubbly: "Redraws" } },
  { name: "X", category: "Actions", motion: { thock: "Strikes through", bubbly: "Strikes through" } },
  { name: "Zap", category: "Actions", motion: { thock: "Jolts and fills", bubbly: "Jolts" } },
  { name: "Sparkles", category: "Actions", motion: { thock: "Twinkles", bubbly: "Twinkles and pops" } },
  { name: "Box", category: "Files", motion: { thock: "Hops", bubbly: "Hops and squishes" } },
];
