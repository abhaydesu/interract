import fs from "fs";
import path from "path";
import { componentsRegistry } from "../src/lib/registry";

const REGISTRY_PATH = path.join(process.cwd(), "public/r");

interface RegistryFile {
  path: string;
  content: string;
  type: "registry:ui" | "registry:lib" | "registry:component";
  target?: string;
}

interface RegistryItem {
  $schema: string;
  name: string;
  type: "registry:ui" | "registry:lib" | "registry:component";
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

const SCHEMA_URL = "https://ui.shadcn.com/schema/registry-item.json";

function detectDependencies(content: string) {
  const deps = new Set<string>();
  if (content.includes("motion/react")) deps.add("motion");
  if (content.includes("class-variance-authority")) deps.add("class-variance-authority");
  if (content.includes("clsx") || content.includes("@/lib/utils")) deps.add("clsx");
  if (content.includes("tailwind-merge") || content.includes("@/lib/utils")) deps.add("tailwind-merge");
  if (content.includes("lucide-react")) deps.add("lucide-react");

  const radixMatches = content.match(/@radix-ui\/react-[a-z-]+/g);
  radixMatches?.forEach((m) => deps.add(m));

  return Array.from(deps);
}

function detectRegistryDeps(content: string) {
  const deps = new Set<string>();
  if (content.includes("@/lib/utils")) deps.add("utils");
  if (content.includes("@/lib/motion")) deps.add("motion");
  return Array.from(deps);
}

async function buildRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    fs.mkdirSync(REGISTRY_PATH, { recursive: true });
  }

  // 1. Utility libs
  const libs = [
    { name: "utils", src: "src/lib/utils.ts", target: "lib/utils.ts" },
    { name: "motion", src: "src/lib/motion.ts", target: "lib/motion.ts" },
  ];

  for (const lib of libs) {
    const content = fs.readFileSync(path.join(process.cwd(), lib.src), "utf-8");
    const item: RegistryItem = {
      $schema: SCHEMA_URL,
      name: lib.name,
      type: "registry:lib",
      dependencies: detectDependencies(content),
      files: [
        {
          path: lib.target,
          content,
          type: "registry:lib",
          target: lib.target,
        },
      ],
    };
    fs.writeFileSync(
      path.join(REGISTRY_PATH, `${lib.name}.json`),
      JSON.stringify(item, null, 2)
    );
  }

  // 2. Components
  for (const component of componentsRegistry) {
    const filePath = path.join(process.cwd(), "src", component.path);
    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping ${component.name}: file not found at ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const targetPath = component.path.replace(/^\/components\//, "");

    const slug = component.slug ?? component.name.toLowerCase().replace(/\s+/g, "-");
    const item: RegistryItem = {
      $schema: SCHEMA_URL,
      name: slug,
      type: "registry:ui",
      dependencies: detectDependencies(content),
      registryDependencies: detectRegistryDeps(content),
      files: [
        {
          path: targetPath,
          content,
          type: "registry:ui",
          target: `components/${targetPath}`,
        },
      ],
    };

    fs.writeFileSync(
      path.join(REGISTRY_PATH, `${slug}.json`),
      JSON.stringify(item, null, 2)
    );
  }

  // 3. Index
  const index = componentsRegistry.map((c) => ({
    name: c.slug,
    type: "registry:ui" as const,
    description: c.description,
    category: c.category,
    tags: c.tags,
  }));

  fs.writeFileSync(
    path.join(REGISTRY_PATH, "index.json"),
    JSON.stringify(index, null, 2)
  );

  console.log(`Registry built: ${componentsRegistry.length} components + ${libs.length} libs → public/r/`);
}

buildRegistry().catch(console.error);
