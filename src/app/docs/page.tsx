"use client";

import Link from "next/link";
import { Header } from "@/components/interract/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Code, Palette, Zap } from "lucide-react";

const docsSections = [
  {
    title: "Getting Started",
    description: "Learn how to install and set up Interract in your project.",
    href: "/docs/getting-started",
    icon: BookOpen,
  },
  {
    title: "Components",
    description: "Explore our collection of UI components with examples.",
    href: "/components",
    icon: Palette,
  },
  {
    title: "Icons",
    description: "Learn how to use and customize animated icons.",
    href: "/icons",
    icon: Zap,
  },
  {
    title: "Theming",
    description: "Customize colors, spacing, and typography.",
    href: "/docs/theming",
    icon: Code,
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 mb-12"
          >
            <h1 className="font-serif text-5xl font-light mb-4 text-neutral-900 dark:text-neutral-100">Documentation</h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl">
              Everything you need to know about using Interract in your projects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docsSections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href={section.href}>
                  <Card className="h-full hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer group bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                    <CardHeader>
                      <section.icon className="w-8 h-8 mb-2 text-neutral-400" />
                      <CardTitle className="text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-500 dark:text-neutral-400">{section.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
