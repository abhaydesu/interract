"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/interract/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { componentsRegistry } from "@/lib/registry";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, ChevronRight } from "lucide-react";

const componentExamples: Record<string, React.ReactNode> = {
  button: (
    <div className="flex flex-wrap gap-4">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  card: (
    <Card className="w-[350px] bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-neutral-100">Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          This is a card component with a title and description. It can contain any content.
        </p>
      </CardContent>
    </Card>
  ),
  accordion: (
    <div className="w-[350px]">
      <AccordionDemo />
    </div>
  ),
  badge: (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  popover: (
    <PopoverDemo />
  ),
  tooltip: (
    <TooltipDemo />
  ),
  hovercard: (
    <HoverCardDemo />
  ),
  iconbutton: (
    <div className="flex gap-2">
      <IconButtonDemo />
    </div>
  ),
};

function AccordionDemo() {
  const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } = require("@/components/ui/accordion");
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-neutral-200 dark:border-neutral-800">
        <AccordionTrigger className="text-neutral-900 dark:text-neutral-100">What is Interract?</AccordionTrigger>
        <AccordionContent className="text-neutral-500 dark:text-neutral-400">
          Interract is a modern component library focused on interactive UI, micro-interactions, and motion-enhanced design.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border-neutral-200 dark:border-neutral-800">
        <AccordionTrigger className="text-neutral-900 dark:text-neutral-100">How do I install?</AccordionTrigger>
        <AccordionContent className="text-neutral-500 dark:text-neutral-400">
          Use the shadcn CLI to add components to your project.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" className="border-neutral-200 dark:border-neutral-800">
        <AccordionTrigger className="text-neutral-900 dark:text-neutral-100">Is it accessible?</AccordionTrigger>
        <AccordionContent className="text-neutral-500 dark:text-neutral-400">
          Yes, all components are built with accessibility in mind using Radix UI primitives.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function PopoverDemo() {
  const { Popover, PopoverTrigger, PopoverContent } = require("@/components/ui/popover");
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-neutral-300 dark:border-neutral-700">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
        <div className="space-y-2">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">Popover Title</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            This is a popover component that appears near the trigger element.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TooltipDemo() {
  const { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } = require("@/components/ui/tooltip");
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="border-neutral-300 dark:border-neutral-700">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900">
          <p>This is a tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function HoverCardDemo() {
  const { HoverCard, HoverCardTrigger, HoverCardContent } = require("@/components/ui/hover-card");
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="text-neutral-900 dark:text-neutral-100">@interract</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
        <div className="space-y-2">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">@interract</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            A modern component library for building beautiful interfaces.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function IconButtonDemo() {
  const { IconButton } = require("@/components/ui/icon-button");
  const { Home, Settings, Bell, Heart } = require("lucide-react");
  return (
    <>
      <IconButton><Home /></IconButton>
      <IconButton variant="secondary"><Settings /></IconButton>
      <IconButton variant="outline"><Bell /></IconButton>
      <IconButton variant="ghost"><Heart /></IconButton>
    </>
  );
}

export default function ComponentDetailPage() {
  const params = useParams();
  const componentName = params.slug as string;
  const component = componentsRegistry.find(
    (c) => c.name.toLowerCase() === componentName.toLowerCase()
  );
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  if (!component) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <Header />
        <main className="pt-32 pb-24 mx-auto max-w-7xl px-6">
          <p className="text-neutral-900 dark:text-neutral-100">Component not found</p>
        </main>
      </div>
    );
  }

  const example = componentExamples[componentName.toLowerCase()] || (
    <p className="text-neutral-500 dark:text-neutral-400">Preview not available</p>
  );

  const codeExample = `import { ${component.name} } from "@/components/ui/${component.name.toLowerCase()}";

export function MyComponent() {
  return (
    <${component.name}>
      Content
    </${component.name}>
  );
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <Link href="/components" className="hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Components
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-neutral-900 dark:text-neutral-100">{component.name}</span>
            </div>

            <div>
              <h1 className="font-serif text-5xl font-light mb-4 text-neutral-900 dark:text-neutral-100">{component.name}</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg">{component.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-neutral-300 dark:border-neutral-700">{component.category}</Badge>
              {component.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">{tag}</Badge>
              ))}
            </div>
          </motion.div>

          <div className="mt-12">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-neutral-100 dark:bg-neutral-800">
                <TabsTrigger value="preview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100">Preview</TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100">Code</TabsTrigger>
                <TabsTrigger value="props" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100">Props</TabsTrigger>
              </TabsList>

              <TabsContent value="preview">
                <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                  <CardContent className="p-12">
                    <div className="flex items-center justify-center min-h-[200px]">
                      {example}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code">
                <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-normal text-neutral-900 dark:text-neutral-100">Installation</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => {
                      navigator.clipboard.writeText(component.installation);
                    }}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg overflow-x-auto text-sm text-neutral-700 dark:text-neutral-300">
                      <code>{component.installation}</code>
                    </pre>
                  </CardContent>
                </Card>

                <Card className="mt-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-normal text-neutral-900 dark:text-neutral-100">Usage</CardTitle>
                    <Button variant="ghost" size="sm" onClick={copyCode}>
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg overflow-x-auto text-sm text-neutral-700 dark:text-neutral-300">
                      <code>{codeExample}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="props">
                <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                  <CardHeader>
                    <CardTitle className="text-neutral-900 dark:text-neutral-100">API Reference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      This component is built on top of Radix UI primitives and accepts all native HTML attributes.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
