export interface IconMeta {
  name: string;
  category: string;
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
  { name: "ArrowRight", category: "Arrows" },
  { name: "ArrowLeft", category: "Arrows" },
  { name: "ArrowUp", category: "Arrows" },
  { name: "ArrowDown", category: "Arrows" },
  { name: "ChevronRight", category: "Arrows" },
  { name: "ChevronDown", category: "Arrows" },
  { name: "Home", category: "Navigation" },
  { name: "Menu", category: "Navigation" },
  { name: "Settings", category: "Navigation" },
  { name: "Search", category: "Actions" },
  { name: "Heart", category: "Social" },
  { name: "Star", category: "Social" },
  { name: "Mail", category: "Communication" },
  { name: "Bell", category: "Communication" },
  { name: "Download", category: "Actions" },
  { name: "Upload", category: "Actions" },
  { name: "Copy", category: "Actions" },
  { name: "Edit", category: "Actions" },
  { name: "Trash", category: "Actions" },
  { name: "Eye", category: "Actions" },
  { name: "Play", category: "Media" },
  { name: "Pause", category: "Media" },
  { name: "Image", category: "Media" },
  { name: "File", category: "Files" },
  { name: "Folder", category: "Files" },
  { name: "Plus", category: "Actions" },
  { name: "Minus", category: "Actions" },
  { name: "Check", category: "Actions" },
  { name: "X", category: "Actions" },
  { name: "Zap", category: "Actions" },
  { name: "Sparkles", category: "Actions" },
  { name: "Box", category: "Files" },
];
