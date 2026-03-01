"use client";

import Link from "next/link";
import { Header } from "@/components/interract/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { componentsRegistry } from "@/lib/registry";
import { ArrowRight, Sparkles, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const featuredComponents = componentsRegistry.slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Header />
      
      <main className="pt-20">
        <section className="relative py-32 grid-bg-subtle">
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white dark:from-neutral-950/0 dark:via-neutral-950/50 dark:to-neutral-950" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <Badge variant="outline" className="mb-4 border-neutral-300 dark:border-neutral-700">
                  <Sparkles className="w-3 h-3 mr-1" />
                  v1.0 Released
                </Badge>
                <h1 className="font-serif text-6xl md:text-8xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
                  Interract
                </h1>
                <p className="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                  A modern component library focused on interactive UI, 
                  micro-interactions, and motion-enhanced design.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button size="lg" className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200" asChild>
                  <Link href="/components">
                    Explore Components
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-neutral-300 dark:border-neutral-700" asChild>
                  <Link href="/docs">
                    Read Docs
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Layers, label: "Components", value: "8+" },
                { icon: Sparkles, label: "Icons", value: "30+" },
                { icon: Zap, label: "Interactions", value: "6+" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center p-8 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                    <CardHeader>
                      <stat.icon className="w-8 h-8 mx-auto mb-4 text-neutral-400" />
                      <div className="font-serif text-5xl font-light text-neutral-900 dark:text-neutral-100">{stat.value}</div>
                      <CardTitle className="text-base font-normal text-neutral-500 dark:text-neutral-400">
                        {stat.label}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-serif text-4xl font-light text-neutral-900 dark:text-neutral-100">Featured Components</h2>
              <Button variant="ghost" asChild>
                <Link href="/components">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredComponents.map((component, i) => (
                <motion.div
                  key={component.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/components/${component.name.toLowerCase()}`}>
                    <Card className="h-full hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer group bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                      <CardHeader>
                        <CardTitle className="text-xl text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                          {component.name}
                        </CardTitle>
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
          </div>
        </section>

        <section className="py-24 border-t border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="font-serif text-4xl font-light text-neutral-900 dark:text-neutral-100">Get Started</h2>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
                Install the components you need and start building beautiful interfaces.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">npm</Badge>
                  </div>
                  <pre className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg overflow-x-auto text-sm text-neutral-700 dark:text-neutral-300">
                    <code>npx shadcn@latest init</code>
                  </pre>
                  <pre className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg overflow-x-auto text-sm text-neutral-700 dark:text-neutral-300">
                    <code>npx shadcn@latest add button card accordion</code>
                  </pre>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-serif text-xl text-neutral-900 dark:text-neutral-100">Interract</div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Built with Next.js, Tailwind CSS, and Framer Motion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
