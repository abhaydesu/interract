"use client";

import * as React from "react";
import { motion, type TargetAndTransition, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Thock icons: a chunky 24×24 icon set with heavy rounded strokes,
 * a soft tinted body, and SVG micro-interactions on individual parts.
 *
 * Every icon has three states:
 *   rest  → idle
 *   hover → the part-level animation (bell swings, lid lifts, check redraws…)
 *   press → a springy "thock" squash of the whole glyph
 *
 * Uncontrolled, the icon reacts to its own hover/tap. Pass `state` to drive
 * it from a parent (e.g. a whole button or card being hovered).
 */

export type IconState = "rest" | "hover" | "press";

export interface ThockIconProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof motion.svg>,
    "animate" | "initial" | "variants" | "whileHover" | "whileTap" | "children"
  > {
  size?: number | string;
  strokeWidth?: number;
  state?: IconState;
  /** Accessible label. Without it the icon is decorative (aria-hidden). */
  title?: string;
}

/* ---------- motion helpers ---------- */

const spring = { type: "spring", stiffness: 520, damping: 20 } as const;
const ease = [0.22, 1, 0.36, 1] as const;
const once = (duration = 0.45, delay = 0) => ({ duration, delay, ease });

/** Build rest/hover/press variants for one part. Press defaults to hover. */
function v(rest: TargetAndTransition, hover: TargetAndTransition, press: TargetAndTransition = hover): Variants {
  return {
    rest: { transition: spring, ...rest },
    hover: { transition: spring, ...hover },
    press: { transition: spring, ...press },
  };
}

// The whole-glyph "thock": squash on press, overshoot back on release.
const thock: Variants = {
  rest: { scale: 1, y: 0, transition: { type: "spring", stiffness: 700, damping: 14 } },
  hover: { scale: 1, y: 0, transition: { type: "spring", stiffness: 700, damping: 14 } },
  press: { scale: 0.84, y: 0.6, transition: { type: "spring", stiffness: 900, damping: 30 } },
};

/**
 * Tracks rest/hover/press, from the `state` prop or the icon's own pointer.
 * Parts only ever see rest or hover, so a click never replays their animation;
 * the press is carried by the whole-glyph thock.
 */
function useIconState(state: IconState | undefined) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const current: IconState = state ?? (pressed ? "press" : hovered ? "hover" : "rest");
  const handlers =
    state !== undefined
      ? {}
      : {
          onHoverStart: () => setHovered(true),
          onHoverEnd: () => {
            setHovered(false);
            setPressed(false);
          },
          onTapStart: () => setPressed(true),
          onTap: () => setPressed(false),
          onTapCancel: () => setPressed(false),
        };
  return { root: current, parts: current === "rest" ? "rest" : "hover", handlers };
}

/** Soft body fill that gives the strokes their weight. */
const TINT = 0.16;
const tint = { fill: "currentColor", fillOpacity: TINT } as const;

/* ---------- base ---------- */

const IconBase = React.forwardRef<SVGSVGElement, ThockIconProps & { children: React.ReactNode }>(
  function IconBase({ size = 24, strokeWidth = 2.75, state, title, className, children, ...rest }, ref) {
    const { root, parts, handlers } = useIconState(state);
    return (
      <motion.svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        overflow="visible"
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        className={cn("shrink-0", className)}
        variants={thock}
        initial="rest"
        animate={root}
        {...handlers}
        {...rest}
      >
        {title && <title>{title}</title>}
        <motion.g initial="rest" animate={parts}>
          {children}
        </motion.g>
      </motion.svg>
    );
  }
);

function createIcon(displayName: string, glyph: React.ReactNode) {
  const Icon = React.forwardRef<SVGSVGElement, ThockIconProps>((props, ref) => (
    <IconBase ref={ref} {...props}>
      {glyph}
    </IconBase>
  ));
  Icon.displayName = displayName;
  return Icon;
}

/* ---------- arrows ---------- */

function arrow(rotate: number) {
  return (
    <g transform={`rotate(${rotate} 12 12)`}>
      <motion.g variants={v({ x: 0 }, { x: 2.5 }, { x: 4 })}>
        <path d="M4.5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </motion.g>
    </g>
  );
}

function chevron(rotate: number) {
  return (
    <g transform={`rotate(${rotate} 12 12)`}>
      <motion.path d="M9 5.5l6.5 6.5L9 18.5" variants={v({ x: 0 }, { x: 2 }, { x: 3 })} />
    </g>
  );
}

export const ArrowRightIcon = createIcon("ArrowRightIcon", arrow(0));
export const ArrowDownIcon = createIcon("ArrowDownIcon", arrow(90));
export const ArrowLeftIcon = createIcon("ArrowLeftIcon", arrow(180));
export const ArrowUpIcon = createIcon("ArrowUpIcon", arrow(270));
export const ChevronRightIcon = createIcon("ChevronRightIcon", chevron(0));
export const ChevronDownIcon = createIcon("ChevronDownIcon", chevron(90));

/* ---------- navigation ---------- */

export const HomeIcon = createIcon(
  "HomeIcon",
  <>
    <path d="M5.5 10v9a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-9" {...tint} />
    <motion.path
      d="M10 20.5V16a2 2 0 0 1 4 0v4.5"
      fill="currentColor"
      variants={v({ fillOpacity: 0 }, { fillOpacity: 1 })}
    />
    <motion.path d="M3 11.5L12 4l9 7.5" variants={v({ y: 0 }, { y: -1.75 }, { y: 0.5 })} />
  </>
);

export const MenuIcon = createIcon(
  "MenuIcon",
  <>
    <motion.path d="M4 6.5h16" style={{ originX: 0 }} variants={v({ scaleX: 1 }, { scaleX: 1 }, { scaleX: 0.55 })} />
    <motion.path d="M4 12h16" style={{ originX: 0 }} variants={v({ scaleX: 1 }, { scaleX: 0.55 }, { scaleX: 0.8 })} />
    <motion.path d="M4 17.5h16" style={{ originX: 0 }} variants={v({ scaleX: 1 }, { scaleX: 0.8 }, { scaleX: 1 })} />
  </>
);

const teeth = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const p = (r: number) => `${(12 + r * Math.cos(a)).toFixed(2)} ${(12 + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(7)}L${p(9.6)}`;
}).join("");

export const SettingsIcon = createIcon(
  "SettingsIcon",
  <motion.g variants={v({ rotate: 0 }, { rotate: 90 }, { rotate: 135 })}>
    <path d={teeth} strokeWidth={3.5} />
    <circle cx="12" cy="12" r="6.25" {...tint} />
    <circle cx="12" cy="12" r="2.25" />
  </motion.g>
);

export const SearchIcon = createIcon(
  "SearchIcon",
  <motion.g variants={v({ x: 0, y: 0, rotate: 0 }, { x: -1, y: -1, rotate: -10 })}>
    <circle cx="10.5" cy="10.5" r="6.25" {...tint} />
    <path d="M15.25 15.25L20 20" />
    <motion.path
      d="M7.75 9.75a3 3 0 0 1 2-2"
      strokeWidth={2}
      variants={v({ pathLength: 0, opacity: 0 }, { pathLength: 1, opacity: 1, transition: once(0.35, 0.05) })}
    />
  </motion.g>
);

/* ---------- social ---------- */

export const HeartIcon = createIcon(
  "HeartIcon",
  <motion.path
    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
    fill="currentColor"
    variants={v(
      { scale: 1, fillOpacity: TINT },
      { scale: [1, 1.22, 1.06], fillOpacity: 1, transition: once(0.45) },
      { scale: 0.92, fillOpacity: 1 }
    )}
  />
);

export const StarIcon = createIcon(
  "StarIcon",
  <motion.path
    d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
    fill="currentColor"
    style={{ originY: 0.55 }}
    variants={v(
      { rotate: 0, scale: 1, fillOpacity: TINT },
      { rotate: 72, scale: 1.06, fillOpacity: 1 },
      { rotate: 72, scale: 0.9, fillOpacity: 1 }
    )}
  />
);

/* ---------- communication ---------- */

export const MailIcon = createIcon(
  "MailIcon",
  <>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" {...tint} />
    <motion.path d="M3.5 7.5l8.5 6 8.5-6" style={{ originY: 0 }} variants={v({ scaleY: 1 }, { scaleY: -1 })} />
  </>
);

export const BellIcon = createIcon(
  "BellIcon",
  <>
    <motion.path
      d="M18 10.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5z"
      {...tint}
      style={{ originY: 0 }}
      variants={v({ rotate: 0 }, { rotate: [0, 16, -12, 8, -4, 0], transition: once(0.7) })}
    />
    <motion.path
      d="M10.2 20.5a2 2 0 0 0 3.6 0"
      variants={v({ x: 0 }, { x: [0, -2.5, 2, -1, 0], transition: once(0.7, 0.05) })}
    />
  </>
);

/* ---------- actions ---------- */

export const DownloadIcon = createIcon(
  "DownloadIcon",
  <>
    <motion.path
      d="M4 15.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.5"
      variants={v({ y: 0 }, { y: [0, 0, 1, 0], transition: once(0.5) })}
    />
    <motion.g variants={v({ y: 0 }, { y: [0, 3, 0], transition: once(0.5) }, { y: 2.5 })}>
      <path d="M12 3.5v11" />
      <path d="M7.5 10l4.5 4.5 4.5-4.5" />
    </motion.g>
  </>
);

export const UploadIcon = createIcon(
  "UploadIcon",
  <>
    <motion.path
      d="M4 15.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.5"
      variants={v({ y: 0 }, { y: [0, 1, 0, 0], transition: once(0.5) })}
    />
    <motion.g variants={v({ y: 0 }, { y: [0, -3, 0], transition: once(0.5) }, { y: -2.5 })}>
      <path d="M12 15V4" />
      <path d="M7.5 8.5L12 4l4.5 4.5" />
    </motion.g>
  </>
);

export const CopyIcon = createIcon(
  "CopyIcon",
  <>
    <motion.path
      d="M15.5 8V6A2.5 2.5 0 0 0 13 3.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2"
      variants={v({ x: 0, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 0 })}
    />
    <motion.rect
      x="8.5"
      y="8.5"
      width="12"
      height="12"
      rx="2.5"
      {...tint}
      variants={v({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: -2, y: -2 })}
    />
  </>
);

export const EditIcon = createIcon(
  "EditIcon",
  <>
    <motion.g
      style={{ originX: 0, originY: 1 }}
      variants={v({ rotate: 0 }, { rotate: [0, -6, 4, -2, 0], transition: once(0.55) })}
    >
      <path d="M16 4.5a2.1 2.1 0 0 1 3 3L8.5 18 4 19.5 5.5 15z" {...tint} />
      <path d="M14 6.5l3 3" />
    </motion.g>
    <motion.path
      d="M13 20.5h7"
      variants={v({ pathLength: 0, opacity: 0 }, { pathLength: 1, opacity: 1, transition: once(0.4, 0.15) })}
    />
  </>
);

export const TrashIcon = createIcon(
  "TrashIcon",
  <>
    <path d="M5.5 7l1 12.2A2 2 0 0 0 8.5 21h7a2 2 0 0 0 2-1.8L18.5 7" {...tint} />
    <path d="M10 11v6M14 11v6" />
    <motion.g
      style={{ originX: 0, originY: 1 }}
      variants={v({ y: 0, rotate: 0 }, { y: -2.5, rotate: -14 }, { y: 0, rotate: 0 })}
    >
      <path d="M3.5 7h17" />
      <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
    </motion.g>
  </>
);

export const EyeIcon = createIcon(
  "EyeIcon",
  <motion.g variants={v({ scaleY: 1 }, { scaleY: [1, 0.12, 1], transition: once(0.32) })}>
    <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" {...tint} />
    <motion.circle
      cx="12"
      cy="12"
      r="2.75"
      fill="currentColor"
      stroke="none"
      variants={v({ x: 0, scale: 1 }, { x: [0, 0, 2], transition: { duration: 0.6, times: [0, 0.5, 1], ease } }, { x: 0, scale: 0.75 })}
    />
  </motion.g>
);

export const PlusIcon = createIcon(
  "PlusIcon",
  <motion.g variants={v({ rotate: 0, scale: 1 }, { rotate: 90, scale: 1.1 }, { rotate: 90, scale: 0.85 })}>
    <path d="M12 5v14M5 12h14" />
  </motion.g>
);

export const MinusIcon = createIcon(
  "MinusIcon",
  <motion.path d="M5 12h14" variants={v({ scaleX: 1 }, { scaleX: 0.7 }, { scaleX: 0.45 })} />
);

export const CheckIcon = createIcon(
  "CheckIcon",
  <motion.path
    d="M4.5 12.5l5 5L19.5 6.5"
    variants={v({ pathLength: 1, scale: 1 }, { pathLength: [0, 1], scale: 1.06, transition: once(0.4) }, { pathLength: 1, scale: 0.9 })}
  />
);

export const XIcon = createIcon(
  "XIcon",
  <>
    <motion.path d="M6 6l12 12" variants={v({ pathLength: 1 }, { pathLength: [0, 1], transition: once(0.3) })} />
    <motion.path d="M18 6L6 18" variants={v({ pathLength: 1 }, { pathLength: [0, 1], transition: once(0.3, 0.12) })} />
  </>
);

export const ZapIcon = createIcon(
  "ZapIcon",
  <motion.path
    d="M13.5 2.5L4.5 13.5h7l-1 8 9-11h-7z"
    fill="currentColor"
    variants={v(
      { x: 0, fillOpacity: TINT },
      { x: [0, -1.25, 1.25, -0.75, 0], fillOpacity: 1, transition: once(0.35) },
      { x: 0, fillOpacity: 1 }
    )}
  />
);

export const SparklesIcon = createIcon(
  "SparklesIcon",
  <>
    <motion.path
      d="M11 4.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5z"
      fill="currentColor"
      variants={v(
        { rotate: 0, scale: 1, fillOpacity: TINT },
        { rotate: 90, scale: 1.08, fillOpacity: 1 },
        { rotate: 90, scale: 0.88, fillOpacity: 1 }
      )}
    />
    <motion.path
      d="M18.5 16v5M16 18.5h5"
      strokeWidth={2.25}
      variants={v({ scale: 1, rotate: 0 }, { scale: [1, 0.4, 1.25, 1], rotate: 90, transition: once(0.5, 0.08) })}
    />
    <motion.circle
      cx="19"
      cy="4.5"
      r="1.4"
      fill="currentColor"
      stroke="none"
      variants={v({ scale: 1 }, { scale: [1, 1.9, 1], transition: once(0.45, 0.16) })}
    />
  </>
);

/* ---------- media ---------- */

export const PlayIcon = createIcon(
  "PlayIcon",
  <motion.path
    d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"
    fill="currentColor"
    variants={v({ x: 0, fillOpacity: TINT }, { x: 0.75, fillOpacity: 1 }, { x: 0, fillOpacity: 1 })}
  />
);

export const PauseIcon = createIcon(
  "PauseIcon",
  <>
    <motion.rect
      x="5.5" y="4.5" width="4.5" height="15" rx="1.5"
      fill="currentColor"
      variants={v({ scaleY: 1, fillOpacity: TINT }, { scaleY: [1, 0.7, 1], fillOpacity: 1, transition: once(0.4) })}
    />
    <motion.rect
      x="14" y="4.5" width="4.5" height="15" rx="1.5"
      fill="currentColor"
      variants={v({ scaleY: 1, fillOpacity: TINT }, { scaleY: [1, 0.7, 1], fillOpacity: 1, transition: once(0.4, 0.08) })}
    />
  </>
);

export const ImageIcon = createIcon(
  "ImageIcon",
  <>
    <rect x="3" y="4" width="18" height="16" rx="3" {...tint} />
    <motion.path
      d="M3.5 17.5l5-5 4 4 2.5-2.5 5.5 5"
      style={{ originY: 1 }}
      variants={v({ scaleY: 1 }, { scaleY: 1.15 })}
    />
    <motion.circle
      cx="8.5" cy="9" r="1.75"
      fill="currentColor"
      stroke="none"
      variants={v({ y: 0, scale: 1 }, { y: -1.5, scale: 1.3 })}
    />
  </>
);

/* ---------- files ---------- */

export const FileIcon = createIcon(
  "FileIcon",
  <>
    <motion.g style={{ originY: 1 }} variants={v({ rotate: 0 }, { rotate: -4 })}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" {...tint} />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    </motion.g>
    <motion.path d="M9 13h6" variants={v({ pathLength: 1 }, { pathLength: [0, 1], transition: once(0.3) })} />
    <motion.path d="M9 17h4" variants={v({ pathLength: 1 }, { pathLength: [0, 1], transition: once(0.3, 0.12) })} />
  </>
);

export const FolderIcon = createIcon(
  "FolderIcon",
  <>
    <path d="M4 20h16a2 2 0 0 0 2-2V9.5a2 2 0 0 0-2-2h-7.6a2 2 0 0 1-1.6-.8L9.6 5.2A2 2 0 0 0 8 4.5H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2z" />
    <motion.path
      d="M4 20h16a2 2 0 0 0 2-2v-6.5a1.5 1.5 0 0 0-1.5-1.5h-17A1.5 1.5 0 0 0 2 11.5V18a2 2 0 0 0 2 2z"
      {...tint}
      style={{ originY: 1 }}
      variants={v({ skewX: 0, scaleY: 1 }, { skewX: -14, scaleY: 0.86 }, { skewX: 0, scaleY: 0.95 })}
    />
  </>
);

export const BoxIcon = createIcon(
  "BoxIcon",
  <motion.g
    style={{ originY: 1 }}
    variants={v(
      { y: 0, scaleY: 1 },
      { y: [0, -3.5, 0, 0], scaleY: [1, 1.03, 0.88, 1], transition: { duration: 0.55, times: [0, 0.4, 0.75, 1], ease } }
    )}
  >
    <path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z" {...tint} />
    <path d="M4.3 7.6L12 12l7.7-4.4M12 12v9" />
  </motion.g>
);

/** Name → component, for building pickers and galleries. */
export const thockIcons = {
  ArrowRight: ArrowRightIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowUp: ArrowUpIcon,
  ArrowDown: ArrowDownIcon,
  ChevronRight: ChevronRightIcon,
  ChevronDown: ChevronDownIcon,
  Home: HomeIcon,
  Menu: MenuIcon,
  Settings: SettingsIcon,
  Search: SearchIcon,
  Heart: HeartIcon,
  Star: StarIcon,
  Mail: MailIcon,
  Bell: BellIcon,
  Download: DownloadIcon,
  Upload: UploadIcon,
  Copy: CopyIcon,
  Edit: EditIcon,
  Trash: TrashIcon,
  Eye: EyeIcon,
  Play: PlayIcon,
  Pause: PauseIcon,
  Image: ImageIcon,
  File: FileIcon,
  Folder: FolderIcon,
  Plus: PlusIcon,
  Minus: MinusIcon,
  Check: CheckIcon,
  X: XIcon,
  Zap: ZapIcon,
  Sparkles: SparklesIcon,
  Box: BoxIcon,
} satisfies Record<string, React.ComponentType<ThockIconProps>>;

export type ThockIconName = keyof typeof thockIcons;
