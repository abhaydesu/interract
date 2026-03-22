"use client";

import Link from "next/link";
import { Header } from "@/components/interract/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { componentsRegistry } from "@/lib/registry";
import { ArrowRight, Sparkles, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GeistPixelSquare } from "geist/font/pixel";

export default function Home() {
  const featuredComponents = componentsRegistry.slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Header />
      
      <main className="pt-20">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Hero Background */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/bg.jpg" 
              alt="Interract Hero Background" 
              fill 
              className="object-cover"
              priority
            />
            {/* Gradient Overlay for Depth and Contrast */}
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-white dark:to-neutral-950 transition-colors duration-500" />
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-10"
            >
              <div className="space-y-6">
                
                <h1 className={`${GeistPixelSquare.className} text-7xl md:text-9xl font-light tracking-tight text-white drop-shadow-2xl`}>
                  Interract
                </h1>
                
                <p className="text-xl md:text-2xl text-neutral-200 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
                  Crafting modern component libraries focused on 
                  micro-interactions and motion-enhanced design.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Button 
                  size="lg" 
                  className="bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-100 dark:hover:bg-white text-lg px-8 h-14 rounded-full transition-all duration-300 hover:scale-105 shadow-xl" 
                  asChild
                >
                  <Link href="/components">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="backdrop-blur-md bg-white/5 border-white/20 text-white hover:bg-white/10 dark:hover:bg-white/10 text-lg px-8 h-14 rounded-full transition-all duration-300" 
                  asChild
                >
                  <Link href="/docs">
                    View Docs
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Subtle bottom fade to content area */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white dark:from-neutral-950 to-transparent pointer-events-none" />
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
              <h2 className={`${GeistPixelSquare.className} text-4xl font-light text-neutral-900 dark:text-neutral-100`}>Featured Components</h2>
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
              <h2 className={`${GeistPixelSquare.className} text-4xl font-light text-neutral-900 dark:text-neutral-100`}>Get Started</h2>
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
            <div className={`${GeistPixelSquare.className} text-xl text-neutral-900 dark:text-neutral-100`}>Interract</div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Built with Next.js, Tailwind CSS, and Framer Motion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
