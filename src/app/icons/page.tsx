"use client";

import { useState } from "react";
import { Header } from "@/components/interract/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { iconCategories } from "@/lib/icon-registry";
import { motion } from "framer-motion";
import { AnimatedIcon } from "@/components/interract/animated-icon";
import { 
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronDown,
  Home, Menu, Settings, Search, Heart, Star, Mail, Bell,
  Download, Upload, Copy, Edit, Trash, Eye, Play, Pause,
  Image, File, Folder, Plus, Minus, Check as CheckIcon, X, Zap, Sparkles, Box
} from "lucide-react";

const iconsList = [
  { name: "ArrowRight", icon: ArrowRight },
  { name: "ArrowLeft", icon: ArrowLeft },
  { name: "ArrowUp", icon: ArrowUp },
  { name: "ArrowDown", icon: ArrowDown },
  { name: "ChevronRight", icon: ChevronRight },
  { name: "ChevronDown", icon: ChevronDown },
  { name: "Home", icon: Home },
  { name: "Menu", icon: Menu },
  { name: "Settings", icon: Settings },
  { name: "Search", icon: Search },
  { name: "Heart", icon: Heart },
  { name: "Star", icon: Star },
  { name: "Mail", icon: Mail },
  { name: "Bell", icon: Bell },
  { name: "Download", icon: Download },
  { name: "Upload", icon: Upload },
  { name: "Copy", icon: Copy },
  { name: "Edit", icon: Edit },
  { name: "Trash", icon: Trash },
  { name: "Eye", icon: Eye },
  { name: "Play", icon: Play },
  { name: "Pause", icon: Pause },
  { name: "Image", icon: Image },
  { name: "File", icon: File },
  { name: "Folder", icon: Folder },
  { name: "Plus", icon: Plus },
  { name: "Minus", icon: Minus },
  { name: "Check", icon: CheckIcon },
  { name: "X", icon: X },
  { name: "Zap", icon: Zap },
  { name: "Sparkles", icon: Sparkles },
  { name: "Box", icon: Box },
];

export default function IconsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const copyToClipboard = (iconName: string) => {
    navigator.clipboard.writeText(`import { ${iconName} } from "lucide-react"`);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-serif text-5xl font-light mb-4 text-neutral-900 dark:text-neutral-100">Icons</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl">
                A collection of animated icons built with Lucide and Framer Motion.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-2">
              {iconCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {iconsList.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
              >
                <Card
                  className="cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group relative bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                  onClick={() => copyToClipboard(item.name)}
                  onMouseEnter={() => setHoveredIcon(item.name)}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <CardContent className="p-4 flex items-center justify-center">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <AnimatedIcon
                        icon={item.icon}
                        preset={hoveredIcon === item.name ? "bounce" : "none"}
                        className="text-neutral-700 dark:text-neutral-300"
                      />
                    </div>
                  </CardContent>
                  
                  {copiedIcon === item.name && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-neutral-900/90 rounded-md"
                    >
                      <CheckIcon className="w-5 h-5 text-green-500" />
                    </motion.div>
                  )}
                </Card>
                <p className="text-xs text-center mt-2 text-neutral-500 dark:text-neutral-400 truncate">
                  {item.name}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Click any icon to copy its import to clipboard
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
