"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/interract/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { componentsRegistry, categories } from "@/lib/registry";
import { motion } from "framer-motion";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";

export default function ComponentsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "category">("name");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponents = componentsRegistry
    .filter((component) => {
      const matchesCategory = selectedCategory === "All" || component.category === selectedCategory;
      const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a.category.localeCompare(b.category);
    });

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
              <h1 className="font-serif text-5xl font-light mb-4 text-neutral-900 dark:text-neutral-100">Components</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl">
                A collection of beautifully designed, accessible, and customizable UI components.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "name" | "category")}
                    className="h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="category">Sort by Category</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component, i) => (
              <motion.div
                key={component.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/components/${component.name.toLowerCase()}`}>
                  <Card className="h-full hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer group bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                          {component.name}
                        </CardTitle>
                        <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <Badge variant="outline" className="w-fit text-xs border-neutral-300 dark:border-neutral-700">
                        {component.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {component.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500 dark:text-neutral-400">No components found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
