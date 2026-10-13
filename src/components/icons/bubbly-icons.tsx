"use client";

import * as React from "react";
import { motion, type TargetAndTransition, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Bubbly icons: a soft, inflated 24×24 icon set. Shapes are filled and
 * puffed up with round strokes, details are punched out with masks (so they
 * work on any background), and a glossy highlight sits on top.
 *
 * Every icon has three states:
 *   rest  → idle
 *   hover → a jelly wobble plus a part-level animation (bubbles rise, bell rings…)
 *   press → a wide squish that springs back on release
 *
 * Uncontrolled, the icon reacts to its own hover/tap. Pass `state` to drive
 * it from a parent (e.g. a whole button or card being hovered).
 */

export type IconState = "rest" | "hover" | "press";

export interface BubblyIconProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof motion.svg>,
    "animate" | "initial" | "variants" | "whileHover" | "whileTap" | "children"
  > {
  size?: number | string;
  state?: IconState;
  /** Accessible label. Without it the icon is decorative (aria-hidden). */
  title?: string;
  /** Show the glossy highlight. Defaults to true. */
  shine?: boolean;
}

/* ---------- motion helpers ---------- */

const bouncy = { type: "spring", stiffness: 420, damping: 11 } as const;
const ease = [0.22, 1, 0.36, 1] as const;
const once = (duration = 0.5, delay = 0) => ({ duration, delay, ease });

/** Build rest/hover/press variants for one part. Press defaults to hover. */
function v(rest: TargetAndTransition, hover: TargetAndTransition, press: TargetAndTransition = hover): Variants {
  return {
    rest: { transition: bouncy, ...rest },
    hover: { transition: bouncy, ...hover },
    press: { transition: bouncy, ...press },
  };
}

// Whole-glyph jelly: wobble on hover, squish wide on press, wobble back on release.
const jelly: Variants = {
  rest: { scaleX: 1, scaleY: 1, transition: { type: "spring", stiffness: 380, damping: 9 } },
  hover: {
    scaleX: [1, 1.14, 0.94, 1.04, 1],
    scaleY: [1, 0.88, 1.06, 0.98, 1],
    transition: { duration: 0.6, ease: "easeOut" },
  },
  press: { scaleX: 1.1, scaleY: 0.86, transition: { type: "spring", stiffness: 700, damping: 24 } },
  // Back from a press: spring out of the squish instead of replaying the wobble.
  settle: { scaleX: 1, scaleY: 1, transition: { type: "spring", stiffness: 520, damping: 10 } },
};

/**
 * Tracks rest/hover/press, from the `state` prop or the icon's own pointer.
 * Parts only ever see rest or hover, so a click never replays their animation;
 * the press is carried by the whole-glyph squish.
 */
function useIconState(state: IconState | undefined) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const current: IconState = state ?? (pressed ? "press" : hovered ? "hover" : "rest");
  const [prev, setPrev] = React.useState(current);
  const [settling, setSettling] = React.useState(false);
  if (current !== prev) {
    setPrev(current);
    setSettling(prev === "press");
  }
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
  return {
    root: current === "press" ? "press" : settling ? "settle" : current,
    parts: current === "rest" ? "rest" : "hover",
    handlers,
  };
}

/** A small bubble that floats up and pops on hover. */
function Rise({ cx, cy, r = 1.2, delay = 0, drift = 0 }: { cx: number; cy: number; r?: number; delay?: number; drift?: number }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      variants={{
        rest: { opacity: 0, scale: 0, x: 0, y: 0, transition: { duration: 0.15 } },
        hover: {
          opacity: [0, 1, 1, 0],
          scale: [0, 1, 1, 0.4],
          y: [0, -2, -4, -6],
          x: [0, drift * 0.5, drift, drift],
          transition: { duration: 0.9, delay, ease: "easeOut" },
        },
        press: { opacity: 0, scale: 0, transition: { duration: 0.1 } },
      }}
    />
  );
}

const pop = (delay = 0) => v({ scale: 1 }, { scale: [1, 0.4, 1.3, 1], transition: once(0.5, delay) }, { scale: 0.8 });

/* ---------- drawing helpers ---------- */

/** Inflated tube: a fat round stroke in the icon colour. */
const tube = (w: number) =>
  ({ fill: "none", stroke: "currentColor", strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
/** Puff a filled shape outward so its corners round off. */
const puff = (w: number) => ({ stroke: "currentColor", strokeWidth: w, strokeLinejoin: "round" }) as const;
/** Cut-out stroke, used inside a mask. */
const cutTube = (w: number) =>
  ({ fill: "none", stroke: "black", strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;

const ShineContext = React.createContext(true);

/** Glossy highlight. Only used on chunky shapes; on thin tubes it reads as a nick. */
function Shine({ cx, cy, rx = 1.3, ry = 0.7, rotate = -35 }: { cx: number; cy: number; rx?: number; ry?: number; rotate?: number }) {
  const on = React.useContext(ShineContext);
  if (!on) return null;
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill="white"
      fillOpacity={0.5}
      stroke="none"
      transform={`rotate(${rotate} ${cx} ${cy})`}
    />
  );
}

/** A group whose `holes` (drawn in black) are punched out of its children. */
function Masked({
  id,
  holes,
  children,
  ...props
}: { id: string; holes: React.ReactNode; children: React.ReactNode } & Omit<
  React.ComponentPropsWithoutRef<typeof motion.g>,
  "children"
>) {
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse" x="-8" y="-8" width="40" height="40">
        <rect x="-8" y="-8" width="40" height="40" fill="white" />
        {holes}
      </mask>
      <motion.g mask={`url(#${id})`} {...props}>
        {children}
      </motion.g>
    </>
  );
}

/* ---------- base ---------- */

function createIcon(displayName: string, render: (id: string) => React.ReactNode) {
  const Icon = React.forwardRef<SVGSVGElement, BubblyIconProps>(function Icon(
    { size = 24, state, title, shine = true, className, style, ...rest },
    ref
  ) {
    const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const { root, parts, handlers } = useIconState(state);
    return (
      <motion.svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        overflow="visible"
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        className={cn("shrink-0", className)}
        style={{ originY: 0.9, ...style }}
        variants={jelly}
        initial="rest"
        animate={root}
        {...handlers}
        {...rest}
      >
        {title && <title>{title}</title>}
        <motion.g initial="rest" animate={parts}>
          <ShineContext.Provider value={shine}>{render(`bub-${id}`)}</ShineContext.Provider>
        </motion.g>
      </motion.svg>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}

/* ---------- arrows ---------- */

function arrow(rotate: number) {
  return function ArrowGlyph() {
    return (
      <g transform={`rotate(${rotate} 12 12)`}>
        <motion.g variants={v({ x: 0 }, { x: 2.5 }, { x: 3.5 })}>
          <path d="M5 12h12" {...tube(5)} />
          <path d="M12.5 6.5L18 12l-5.5 5.5" {...tube(5)} />
        </motion.g>
      </g>
    );
  };
}

function chevron(rotate: number) {
  return function ChevronGlyph() {
    return (
      <g transform={`rotate(${rotate} 12 12)`}>
        <motion.g variants={v({ x: 0 }, { x: 2 }, { x: 3 })}>
          <path d="M9.5 5.5L16 12l-6.5 6.5" {...tube(5)} />
        </motion.g>
      </g>
    );
  };
}

export const ArrowRightIcon = createIcon("ArrowRightIcon", arrow(0));
export const ArrowDownIcon = createIcon("ArrowDownIcon", arrow(90));
export const ArrowLeftIcon = createIcon("ArrowLeftIcon", arrow(180));
export const ArrowUpIcon = createIcon("ArrowUpIcon", arrow(270));
export const ChevronRightIcon = createIcon("ChevronRightIcon", chevron(0));
export const ChevronDownIcon = createIcon("ChevronDownIcon", chevron(90));

/* ---------- navigation ---------- */

export const HomeIcon = createIcon("HomeIcon", (id) => (
  <>
    <Masked
      id={id}
      holes={
        <motion.path
          d="M10 22.5v-5a2 2 0 0 1 4 0v5z"
          fill="black"
          style={{ originY: 1 }}
          variants={v({ scaleY: 1 }, { scaleY: [1, 0.35, 1], transition: once(0.5) })}
        />
      }
    >
      <path d="M4 11.2L12 4.5l8 6.7V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" {...puff(2.5)} />
      <rect x="15.5" y="4.5" width="3.2" height="5" rx="1.6" />
      <Shine cx={7.2} cy={12.6} rx={1.2} ry={0.8} />
    </Masked>
    <Rise cx={17.1} cy={2.4} r={1.2} drift={1} />
    <Rise cx={17.1} cy={2.4} r={0.9} delay={0.25} drift={-1} />
  </>
));

export const MenuIcon = createIcon("MenuIcon", () => (
  <>
    {[4.5, 10, 15.5].map((y, i) => (
      <motion.g key={y} variants={v({ x: 0 }, { x: [0, 2, -1, 0], transition: once(0.45, i * 0.06) }, { x: 0 })}>
        <rect x="3.5" y={y} width="17" height="4" rx="2" />
      </motion.g>
    ))}
  </>
));

const bumps = Array.from({ length: 6 }, (_, i) => {
  const a = ((i * 60 - 90) * Math.PI) / 180;
  return { cx: +(12 + 7.6 * Math.cos(a)).toFixed(2), cy: +(12 + 7.6 * Math.sin(a)).toFixed(2) };
});

export const SettingsIcon = createIcon("SettingsIcon", (id) => (
  <Masked
    id={id}
    holes={<circle cx="12" cy="12" r="2.8" fill="black" />}
    variants={v({ rotate: 0 }, { rotate: 60 }, { rotate: 90 })}
  >
    <circle cx="12" cy="12" r="7" />
    {bumps.map((b) => (
      <circle key={`${b.cx}-${b.cy}`} cx={b.cx} cy={b.cy} r="2.7" />
    ))}
    <Shine cx={8.5} cy={8.4} rx={1.3} ry={0.75} />
  </Masked>
));

export const SearchIcon = createIcon("SearchIcon", (id) => (
  <Masked
    id={id}
    holes={<circle cx="10.5" cy="10.5" r="3.8" fill="black" />}
    variants={v({ x: 0, y: 0, rotate: 0 }, { x: -1, y: -1, rotate: -12 })}
  >
    <circle cx="10.5" cy="10.5" r="7.2" />
    <path d="M16.2 16.2L20 20" {...tube(5)} />
    <Shine cx={6.4} cy={7.6} rx={1.2} ry={0.6} rotate={-45} />
  </Masked>
));

/* ---------- social ---------- */

export const HeartIcon = createIcon("HeartIcon", () => (
  <>
    <motion.g
      style={{ originY: 0.6 }}
      variants={v({ scale: 1 }, { scale: [1, 1.22, 0.94, 1.06, 1], transition: once(0.6) }, { scale: 0.9 })}
    >
      <path
        d="M12 20.5s-8.5-5-8.5-11A4.75 4.75 0 0 1 12 6.6a4.75 4.75 0 0 1 8.5 2.9c0 6-8.5 11-8.5 11z"
        {...puff(1.5)}
      />
      <Shine cx={7.3} cy={9.4} rx={1.7} ry={0.9} rotate={-40} />
    </motion.g>
    <Rise cx={5} cy={5} r={1.1} drift={-1} />
    <Rise cx={19} cy={4.5} r={1.4} delay={0.15} drift={1} />
  </>
));

export const StarIcon = createIcon("StarIcon", () => (
  <motion.g
    style={{ originY: 0.55 }}
    variants={v(
      { rotate: 0, scale: 1 },
      { rotate: [0, -14, 10, 0], scale: [1, 1.15, 1], transition: once(0.55) },
      { rotate: 0, scale: 0.88 }
    )}
  >
    <path d="M12 3.2l2.6 5.4 5.9.7-4.4 4 1.2 5.9L12 16.3l-5.3 2.9 1.2-5.9-4.4-4 5.9-.7z" {...puff(3)} />
    <Shine cx={9.8} cy={10.2} rx={1.1} ry={0.6} />
  </motion.g>
));

/* ---------- communication ---------- */

export const MailIcon = createIcon("MailIcon", (id) => (
  <Masked
    id={id}
    holes={
      <motion.path
        d="M6.5 9.5l5.5 3.8 5.5-3.8"
        {...cutTube(2.4)}
        style={{ originY: 0 }}
        variants={v({ scaleY: 1 }, { scaleY: -1 })}
      />
    }
  >
    <rect x="2.5" y="5" width="19" height="14" rx="4.5" />
    <Shine cx={5.6} cy={7.6} rx={1.2} ry={0.65} />
  </Masked>
));

export const BellIcon = createIcon("BellIcon", () => (
  <>
    <motion.g style={{ originY: 0 }} variants={v({ rotate: 0 }, { rotate: [0, 16, -12, 8, -4, 0], transition: once(0.75) })}>
      <path
        d="M12 3.5a6 6 0 0 1 6 6V13l1.8 2.6a1 1 0 0 1-.8 1.6H5a1 1 0 0 1-.8-1.6L6 13V9.5a6 6 0 0 1 6-6z"
        {...puff(1.5)}
      />
      <Shine cx={9.3} cy={8.4} rx={0.8} ry={1.5} rotate={25} />
    </motion.g>
    <motion.circle
      cx="12"
      cy="20.4"
      r="2"
      variants={v({ x: 0 }, { x: [0, -2.5, 2, -1, 0], transition: once(0.75, 0.06) })}
    />
  </>
));

/* ---------- actions ---------- */

export const DownloadIcon = createIcon("DownloadIcon", () => (
  <>
    <motion.path
      d="M4.5 15.5v1.8a2.7 2.7 0 0 0 2.7 2.7h9.6a2.7 2.7 0 0 0 2.7-2.7v-1.8"
      {...tube(4)}
      variants={v({ scaleX: 1 }, { scaleX: [1, 1, 1.08, 1], transition: once(0.6) })}
    />
    <motion.g variants={v({ y: 0 }, { y: [0, 3, -0.5, 0], transition: once(0.6) }, { y: 2.5 })}>
      <path d="M12 3.5V10" {...tube(5)} />
      <path d="M7.8 8.5L12 12.5l4.2-4" {...tube(5)} />
    </motion.g>
  </>
));

export const UploadIcon = createIcon("UploadIcon", () => (
  <>
    <motion.path
      d="M4.5 15.5v1.8a2.7 2.7 0 0 0 2.7 2.7h9.6a2.7 2.7 0 0 0 2.7-2.7v-1.8"
      {...tube(4)}
      variants={v({ scaleX: 1 }, { scaleX: [1, 1.08, 1, 1], transition: once(0.6) })}
    />
    <motion.g variants={v({ y: 0 }, { y: [0, -3, 0.5, 0], transition: once(0.6) }, { y: -2.5 })}>
      <path d="M12 13V6.5" {...tube(5)} />
      <path d="M7.8 8L12 4l4.2 4" {...tube(5)} />
    </motion.g>
  </>
));

const copyFront = v({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: -1.5, y: -1.5 });

export const CopyIcon = createIcon("CopyIcon", (id) => (
  <>
    <Masked id={id} holes={<motion.rect x="7.5" y="7.5" width="15.5" height="15.5" rx="5" fill="black" variants={copyFront} />}>
      <motion.rect x="2.5" y="2.5" width="12.5" height="12.5" rx="3.8" variants={v({ x: 0, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 0 })} />
    </Masked>
    <motion.g variants={copyFront}>
      <rect x="9" y="9" width="12.5" height="12.5" rx="3.8" />
      <Shine cx={11.9} cy={11.7} rx={1.2} ry={0.65} />
    </motion.g>
  </>
));

export const EditIcon = createIcon("EditIcon", (id) => (
  <>
    <motion.g
      style={{ originX: 0, originY: 1 }}
      variants={v({ rotate: 0 }, { rotate: [0, -8, 5, -2, 0], transition: once(0.6) })}
    >
      <Masked id={id} holes={<path d="M12.4 7.3l4.3 4.3" {...cutTube(1.4)} />}>
        <path d="M7.5 16.5L16.8 7.2" {...tube(6)} />
      </Masked>
      <path d="M3.5 20.5l1.2-4.4 3.2 3.2z" {...puff(1.5)} />
    </motion.g>
    <motion.path
      d="M13.5 20.5H20"
      {...tube(3)}
      variants={v({ pathLength: 0, opacity: 0 }, { pathLength: 1, opacity: 1, transition: once(0.4, 0.15) })}
    />
  </>
));

export const TrashIcon = createIcon("TrashIcon", (id) => (
  <>
    <Masked id={id} holes={<path d="M10.2 12.3v4.9M13.8 12.3v4.9" {...cutTube(1.6)} />}>
      <path d="M5.5 9h13l-1 10a2.5 2.5 0 0 1-2.5 2.2H9A2.5 2.5 0 0 1 6.5 19z" {...puff(1.5)} />
      <Shine cx={7.9} cy={11.6} rx={0.55} ry={1.3} rotate={-5} />
    </Masked>
    <motion.g
      style={{ originX: 0, originY: 1 }}
      variants={v({ y: 0, rotate: 0 }, { y: -2.5, rotate: -14 }, { y: 0, rotate: 0 })}
    >
      <rect x="3.5" y="4.6" width="17" height="3.2" rx="1.6" />
      <rect x="9.3" y="2.4" width="5.4" height="3.4" rx="1.7" />
    </motion.g>
  </>
));

export const EyeIcon = createIcon("EyeIcon", (id) => (
  <motion.g variants={v({ scaleY: 1 }, { scaleY: [1, 0.1, 1], transition: once(0.35) })}>
    <Masked id={id} holes={<circle cx="12" cy="12" r="4.3" fill="black" />}>
      <path d="M12 5c5.5 0 9.5 5.2 9.5 7s-4 7-9.5 7-9.5-5.2-9.5-7 4-7 9.5-7z" />
      <Shine cx={7} cy={9.4} rx={1.3} ry={0.55} rotate={-25} />
    </Masked>
    <motion.g
      variants={v(
        { x: 0, scale: 1 },
        { x: [0, 0, 1.5], transition: { duration: 0.6, times: [0, 0.5, 1], ease } },
        { x: 0, scale: 0.8 }
      )}
    >
      <circle cx="12" cy="12" r="2.8" />
      <Shine cx={11} cy={11} rx={0.8} ry={0.8} rotate={0} />
    </motion.g>
  </motion.g>
));

export const PlusIcon = createIcon("PlusIcon", () => (
  <motion.g variants={v({ rotate: 0, scale: 1 }, { rotate: 90, scale: 1.1 }, { rotate: 90, scale: 0.85 })}>
    <path d="M12 5v14M5 12h14" {...tube(5.5)} />
  </motion.g>
));

export const MinusIcon = createIcon("MinusIcon", () => (
  <motion.g
    variants={v(
      { scaleX: 1, scaleY: 1 },
      { scaleX: [1, 0.7, 1.1, 1], scaleY: [1, 1.3, 0.9, 1], transition: once(0.5) },
      { scaleX: 0.6, scaleY: 1.3 }
    )}
  >
    <path d="M5 12h14" {...tube(5.5)} />
  </motion.g>
));

export const CheckIcon = createIcon("CheckIcon", () => (
  <motion.path
    d="M5 12.5l4.5 4.5L19 7.5"
    {...tube(5)}
    variants={v({ pathLength: 1 }, { pathLength: [0, 1], transition: once(0.4) }, { pathLength: 1 })}
  />
));

export const XIcon = createIcon("XIcon", () => (
  <>
    <motion.path d="M6.5 6.5l11 11" {...tube(5)} variants={v({ pathLength: 1 }, { pathLength: [0, 1], transition: once(0.3) })} />
    <motion.path d="M17.5 6.5l-11 11" {...tube(5)} variants={v({ pathLength: 1 }, { pathLength: [0, 1], transition: once(0.3, 0.12) })} />
  </>
));

export const ZapIcon = createIcon("ZapIcon", () => (
  <motion.g
    variants={v({ x: 0, rotate: 0 }, { x: [0, -1.2, 1.2, -0.8, 0], rotate: [0, -4, 4, 0], transition: once(0.4) }, { x: 0 })}
  >
    <path d="M13.5 2.5L5 13.5h6.5l-1 8 8.5-11h-6.5z" {...puff(2.5)} />
    <Shine cx={11.4} cy={6.6} rx={0.5} ry={1.4} rotate={38} />
  </motion.g>
));

export const SparklesIcon = createIcon("SparklesIcon", () => (
  <>
    <motion.g variants={v({ rotate: 0, scale: 1 }, { rotate: 90, scale: 1.1 }, { rotate: 90, scale: 0.85 })}>
      <path
        d="M11 4.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5z"
        {...puff(2.2)}
      />
    </motion.g>
    <motion.circle cx="18.6" cy="18.4" r="2.4" variants={pop(0.08)} />
    <motion.circle cx="18.8" cy="4.6" r="1.6" variants={pop(0.16)} />
    <Rise cx={5} cy={19} r={1} delay={0.1} drift={-0.5} />
  </>
));

/* ---------- media ---------- */

export const PlayIcon = createIcon("PlayIcon", () => (
  <motion.g variants={v({ x: 0 }, { x: [0, 1.5, -0.5, 0], transition: once(0.5) }, { x: 0 })}>
    <path
      d="M6.5 5.5v13a1.5 1.5 0 0 0 2.3 1.3l10-6.5a1.5 1.5 0 0 0 0-2.6l-10-6.5A1.5 1.5 0 0 0 6.5 5.5z"
      {...puff(2)}
    />
    <Shine cx={9.6} cy={9.6} rx={1.1} ry={0.6} rotate={35} />
  </motion.g>
));

export const PauseIcon = createIcon("PauseIcon", () => (
  <>
    {[5, 13.5].map((x, i) => (
      <motion.g key={x} variants={v({ scaleY: 1 }, { scaleY: [1, 0.72, 1.06, 1], transition: once(0.45, i * 0.08) })}>
        <rect x={x} y="4" width="5.5" height="16" rx="2.75" />
        <Shine cx={x + 1.8} cy={7} rx={0.55} ry={1.3} rotate={0} />
      </motion.g>
    ))}
  </>
));

export const ImageIcon = createIcon("ImageIcon", (id) => (
  <Masked
    id={id}
    holes={
      <>
        <motion.circle cx="8.3" cy="9" r="2.2" fill="black" variants={v({ y: 0, scale: 1 }, { y: -1.2, scale: 1.25 })} />
        <motion.path
          d="M5.5 17.5l4-4 3 3 2.5-2.5 3.5 3.5"
          {...cutTube(2.4)}
          style={{ originY: 1 }}
          variants={v({ scaleY: 1 }, { scaleY: 1.2 })}
        />
      </>
    }
  >
    <rect x="2.5" y="3.5" width="19" height="17" rx="4.5" />
  </Masked>
));

/* ---------- files ---------- */

export const FileIcon = createIcon("FileIcon", (id) => (
  <motion.g style={{ originY: 1 }} variants={v({ rotate: 0 }, { rotate: -5 })}>
    <Masked
      id={id}
      holes={
        <>
          <path d="M14 2.5V7a1.5 1.5 0 0 0 1.5 1.5H20z" fill="black" fillOpacity={0.35} />
          <motion.path d="M8.5 13h7" {...cutTube(2.2)} variants={v({ pathLength: 1 }, { pathLength: [0, 1], transition: once(0.3) })} />
          <motion.path d="M8.5 17H13" {...cutTube(2.2)} variants={v({ pathLength: 1 }, { pathLength: [0, 1], transition: once(0.3, 0.12) })} />
        </>
      }
    >
      <path d="M6.5 2.5h6.8a2 2 0 0 1 1.4.6l4.7 4.7a2 2 0 0 1 .6 1.4V19a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19V5a2.5 2.5 0 0 1 2.5-2.5z" />
    </Masked>
  </motion.g>
));

export const FolderIcon = createIcon("FolderIcon", () => (
  <>
    <path
      d="M2.5 7A2.5 2.5 0 0 1 5 4.5h3.6a2 2 0 0 1 1.5.7l1.3 1.6h7.6a2.5 2.5 0 0 1 2.5 2.5V18a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 18z"
      fillOpacity={0.45}
    />
    <motion.g style={{ originY: 1 }} variants={v({ skewX: 0, scaleY: 1 }, { skewX: -12, scaleY: 0.86 }, { skewX: 0, scaleY: 0.95 })}>
      <rect x="2.5" y="10" width="19" height="10.5" rx="2.5" />
      <Shine cx={5.6} cy={12.6} rx={1.2} ry={0.55} rotate={0} />
    </motion.g>
  </>
));

export const BoxIcon = createIcon("BoxIcon", (id) => (
  <motion.g
    style={{ originY: 1 }}
    variants={v(
      { y: 0, scaleY: 1 },
      { y: [0, -3.5, 0, 0], scaleY: [1, 1.04, 0.86, 1], transition: { duration: 0.6, times: [0, 0.4, 0.75, 1], ease } }
    )}
  >
    <Masked
      id={id}
      holes={
        <>
          <path d="M12 2.8l8 4.6L12 12 4 7.4z" fill="black" fillOpacity={0.3} />
          <path d="M4.6 7.8L12 12l7.4-4.2M12 12v8.6" {...cutTube(1.5)} />
        </>
      }
    >
      <path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z" {...puff(2)} />
    </Masked>
  </motion.g>
));

/** Name → component, for building pickers and galleries. */
export const bubblyIcons = {
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
} satisfies Record<string, React.ComponentType<BubblyIconProps>>;

export type BubblyIconName = keyof typeof bubblyIcons;
