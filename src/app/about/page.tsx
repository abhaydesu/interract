"use client";

import Link from "next/link";
import { Header } from "@/components/interract/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github, Twitter, Heart } from "lucide-react";

export default function AboutPage() {
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
            <h1 className="font-serif text-5xl font-light mb-4 text-neutral-900 dark:text-neutral-100">About Interract</h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl">
              Interract is a modern component library focused on interactive UI, micro-interactions, 
              and motion-enhanced design. Built with accessibility and developer experience in mind.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-lg text-neutral-900 dark:text-neutral-100">Accessible</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Built on Radix UI primitives for full accessibility support out of the box.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-lg text-neutral-900 dark:text-neutral-100">Animated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Smooth micro-interactions powered by Framer Motion for delightful experiences.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-lg text-neutral-900 dark:text-neutral-100">Customizable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Built on Tailwind CSS for easy theming and customization to match your brand.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="p-8 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <CardContent className="space-y-6">
                <h2 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Radix UI", "Lucide"].map((tech) => (
                    <Badge key={tech} variant="outline" className="border-neutral-300 dark:border-neutral-700">{tech}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              Built with <Heart className="w-4 h-4 inline mx-1 text-red-500" /> for the community
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="border-neutral-300 dark:border-neutral-700" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" className="border-neutral-300 dark:border-neutral-700" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
