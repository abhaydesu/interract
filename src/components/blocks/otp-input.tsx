"use client";

import * as React from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "verifying" | "success" | "error";

export interface OtpInputProps {
  length?: number;
  /** Return true when the code is valid. Defaults to rejecting "000000". */
  verify?: (code: string) => boolean | Promise<boolean>;
  className?: string;
}

/**
 * One-time-code field. A single real input drives the visual slots,
 * so paste, autofill and mobile keyboards behave natively.
 */
export function OtpInput({
  length = 6,
  verify = (c) => c !== "0".repeat(c.length),
  className,
}: OtpInputProps) {
  const [value, setValue] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const controls = useAnimationControls();

  const submit = async (code: string) => {
    setStatus("verifying");
    await new Promise((r) => setTimeout(r, 900));
    const ok = await verify(code);
    if (ok) {
      setStatus("success");
    } else {
      setStatus("error");
      await controls.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.35 } });
      setValue("");
      setStatus("idle");
      inputRef.current?.focus();
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/\D/g, "").slice(0, length);
    setValue(next);
    if (next.length === length) submit(next);
  };

  const reset = () => {
    setValue("");
    setStatus("idle");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("w-full max-w-[320px]", className)}>
      <motion.div animate={controls} className="relative" onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={length}
          disabled={status === "verifying" || status === "success"}
          aria-label="Verification code"
          className="absolute inset-0 z-10 w-full cursor-text opacity-0"
        />
        <div className="flex gap-1.5">
          {Array.from({ length }).map((_, i) => {
            const char = value[i];
            const isActive = focused && status === "idle" && i === Math.min(value.length, length - 1);
            return (
              <React.Fragment key={i}>
                {i === length / 2 && <span className="w-1.5 self-center text-center text-neutral-300 dark:text-neutral-700">·</span>}
                <div
                  className={cn(
                    "relative flex h-12 flex-1 items-center justify-center rounded-xl bg-surface text-lg font-medium text-foreground tabular-nums transition-shadow duration-200",
                    isActive
                      ? "shadow-[0_0_0_1px_var(--foreground),0_0_0_4px_rgb(120_120_120/0.12)]"
                      : "shadow-btn",
                    status === "error" && "shadow-[0_0_0_1px_rgb(239_68_68),0_0_0_4px_rgb(239_68_68/0.12)]",
                    status === "success" && "shadow-[0_0_0_1px_rgb(16_185_129/0.6),0_0_0_4px_rgb(16_185_129/0.1)]"
                  )}
                >
                  <AnimatePresence mode="popLayout">
                    {char && (
                      <motion.span
                        key={char + i}
                        initial={{ opacity: 0, y: 8, scale: 0.8, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        {char}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !char && (
                    <motion.span
                      className="h-5 w-px bg-foreground"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      <div className="mt-3 flex h-5 items-center justify-between text-xs">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={cn(
              "flex items-center gap-1.5",
              status === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
              status === "error" && "text-red-500"
            )}
          >
            {status === "idle" && "Enter the 6-digit code we sent you"}
            {status === "verifying" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Verifying…
              </>
            )}
            {status === "success" && (
              <>
                <Check className="h-3 w-3" /> Verified
              </>
            )}
            {status === "error" && "Invalid code"}
          </motion.span>
        </AnimatePresence>
        <button
          onClick={reset}
          className="text-muted-foreground underline decoration-line-strong underline-offset-2 transition-colors hover:text-foreground"
        >
          {status === "success" ? "Reset" : "Resend"}
        </button>
      </div>
    </div>
  );
}
