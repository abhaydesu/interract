"use client";

import * as React from "react";
import { CommandLine, CopyButton } from "@/components/interract/copy-button";
import { Segmented } from "./segmented";

export function InstallTabs({
  command,
  dependencies,
  targetPath,
  source,
}: {
  command: string;
  dependencies: string[];
  targetPath: string;
  source: string | null;
}) {
  const [tab, setTab] = React.useState<"cli" | "manual">("cli");
  const depsCommand = `npm i ${dependencies.join(" ")}`;

  return (
    <div className="min-w-0">
      <Segmented label="Installation method" value={tab} options={["cli", "manual"] as const} onChange={setTab} />
      <div className="mt-3">
        {tab === "cli" ? (
          <CommandLine command={command} />
        ) : (
          <ol className="divide-y divide-line overflow-hidden rounded-xl bg-surface shadow-soft">
            {dependencies.length > 0 && (
              <li className="flex items-center gap-3 py-2 pr-2 pl-4">
                <Step n={1} />
                <code className="no-scrollbar min-w-0 flex-1 overflow-x-auto py-1 font-mono text-[13px] whitespace-nowrap text-foreground">
                  {depsCommand}
                </code>
                <CopyButton text={depsCommand} label="Copy command" />
              </li>
            )}
            <li className="flex items-center gap-3 py-2 pr-2 pl-4">
              <Step n={dependencies.length ? 2 : 1} />
              <p className="min-w-0 flex-1 py-1 text-[13px] text-muted-foreground">
                Copy the source into{" "}
                <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px] break-all text-foreground shadow-inset">
                  {targetPath}
                </code>
              </p>
              {source && <CopyButton text={source} label="Copy source" />}
            </li>
          </ol>
        )}
      </div>
    </div>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-2 font-mono text-[10px] text-muted-foreground shadow-hairline">
      {n}
    </span>
  );
}
