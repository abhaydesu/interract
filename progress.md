# Design refresh — progress

Goal: a minimal, premium redesign inspired by ui.aceternity.com, aceternity.com, shwn.design, dotmatrix and perfolios. Instead of solid borders, it uses layered hairline shadows, `black/10`-style borders, monochrome surfaces, dashed frame rails with `+` marks and small mono labels. It also adds mock (interactive) components.

Status as of 2026-09-30: `npx tsc --noEmit` passes. Nothing has been built or checked in the browser yet.

## Done

### Design tokens (`src/app/globals.css`)
- Shadow scale, registered in `@theme` and swapped per theme through the `--sh-*` vars in `:root` and `.dark`: `shadow-hairline`, `shadow-soft`, `shadow-raised`, `shadow-float`, `shadow-btn`, `shadow-btn-primary`, `shadow-key`, `shadow-inset`.
- Color tokens: `line`, `line-strong`, `surface`, `surface-2`. The dark background is `#0a0a0a` and dark cards are `#111`.
- Utilities: `bg-dots`, `bg-grid`, `bg-hatch`, `mask-fade-y`, `mask-fade-b`, `mask-radial`, `text-pretty`, `text-shimmer`, plus themed `::selection`.
- Removed the old custom `.animate-in`, which was overriding tw-animate's version used by the Radix overlays, along with the unused `grid-bg*` and `stagger-*` classes.

### Layout and chrome
- `src/components/interract/frame.tsx` (new) contains:
  - `PageShell`: header, a `max-w-6xl` column with `border-x border-line` rails, and the footer.
  - `Section`: a full-bleed top rule with `+` corner marks.
  - `SectionHeader`, `Eyebrow`, `PlusMark` and `Kbd`.
- `src/components/interract/header.tsx` was rewritten:
  - Floating pill that narrows and blurs on scroll.
  - Spring hover highlight and an active underline.
  - GitHub "Star" button. The 2.4k count is placeholder.
  - Mobile menu (there was none before) and a `LogoMark` dot-grid logo.
- `src/components/theme-toggle.tsx` now uses `resolvedTheme`. Before, the "system" theme showed the wrong icon. The icon swap is also animated.

### Primitives restyled (APIs unchanged)
`button`, `icon-button`, `badge`, `card`, `tabs`, `tooltip`, `popover`, `hover-card` and `accordion` in `src/components/ui/` now use the shadow tokens.

### Mock components (new, `src/components/blocks/`)
- `command-menu`: ⌘K palette with filtering, keyboard navigation and a spring highlight.
- `notification-stack`: stacked toasts that fan out on hover, can be dismissed, and can be restored.
- `stat-card`: range switcher, morphing sparkline and a hover scrubber.
- `pricing-toggle`: segmented billing switch with rolling digits.
- `now-playing`: dot-matrix cover, equalizer, scrubbable progress.
- `otp-input`: a single real input driving 6 slots, with verifying, success and error-shake states. `000000` is rejected.
- `settings-list`: rows with spring switches.
- `avatar-stack`: fans out on hover with tooltips and has an invite toggle.

All 8 are registered in `src/lib/registry.ts` under the new `"Blocks"` category, which is also added to `categories`.

### Previews
`src/components/interract/previews.tsx` (new) holds the `previews` map and a `<Preview slug>` component for every registry slug, covering both primitives and blocks. It's meant to replace the inline `require()` demos in `components/[slug]/page.tsx`.

### Landing
`src/components/interract/landing/hero.tsx` was rewritten:
- "New" pill, headline "Components that move / with intent.", CTAs and an install-command copy chip.
- A framed dotted stage with live `CommandMenu`, `NotificationStack`, `StatCard` and `AvatarStack`. The side mocks only appear at `lg` and `xl` widths.

### Session 2 (landing, inner pages, verification)
- Landing sections, all built with `Section` and `SectionHeader`:
  - `featured-components.tsx`: a live blocks bento with `gap-px` hairlines.
  - `principles.tsx` (new), which replaces the deleted `stats.tsx`.
  - `get-started.tsx`: terminal card with pnpm/npm/bun tabs.
  - `cta.tsx` (new).
  - `footer.tsx`, now inside the frame, with a large faint pixel wordmark.
- `PageShell` moved to `src/components/interract/page-shell.tsx`. This broke a frame ↔ footer import cycle.
- Inner pages moved to `PageShell`:
  - `components`: live preview tiles, a spring category pill, and hatched filler cells for an incomplete last row.
  - `components/[slug]`: Preview/Code toggle, replay button, CLI/Manual install, prev/next. The inline `require()` demos are gone, and source now loads from local `/r/<slug>.json`.
  - `docs`, `icons` and `about`. The icon category filter now actually filters.
- Ran `npm run build:registry`: 17 components + 2 libs are in `public/r/`.
- Checks:
  - `tsc` and `next build` pass.
  - ESLint shows 1 error and 8 warnings, all pre-existing: the `any` in `animated-icon.tsx` and unused imports in older files.
  - Compiled CSS confirms that `shadow-*`, `bg-line` and `bg-surface` resolve to the theme vars.
  - Every route returns 200 on the dev server at :3002.

### Session 3 (2026-10-13): bug and UX pass, verified in headless Chromium
- Bugs fixed:
  - `IconButton` leaked Button's solid styles into ghost and outline variants.
  - Hero side mocks collapsed to slivers because of `w-full` inside absolutely positioned wrappers.
  - The command menu didn't scroll to the active row, and its ESC button did nothing.
  - Global `layoutId`s made highlights jump between block instances. They're now scoped per instance with `useId`.
  - StatCard logged an SVG `d="undefined"` console error.
  - The `AnimatedIcon` hover on the icons page never fired.
  - Copy buttons were invisible on touch.
  - Clipboard rejections were unhandled.
  - Translucent hovers on hairline grids revealed the grey gap colour.
  - The docs "Theming" card linked to itself.
  - Invalid component slugs returned 200.
  - Inputs smaller than 16px triggered iOS zoom.
- Pages:
  - `components/[slug]`, `docs`, `icons` and `about` are server components, each with its own metadata.
  - Detail pages are SSG, use `notFound()`, and read source straight from `src/`.
  - The components category syncs with `?category=`.
  - `/` focuses search.
  - Added a styled `not-found.tsx`.
- Accessibility:
  - Skip link and a global `:focus-visible` ring.
  - `MotionConfig reducedMotion="user"`.
  - Escape and outside tap close the mobile menu.
  - The NowPlaying seek slider works from the keyboard.
  - Tab, radio and switch roles added.
- Placeholders: the fake "2.4k" star count and the Twitter link are gone. GitHub links point to `siteConfig.github` in `src/lib/site.ts`, and unused `public/bg.jpg` (7.9MB) was removed.
- Checks: `tsc`, ESLint (0 problems) and `next build` all pass. There's no horizontal overflow at 375px or 1280px in light or dark mode, and the console has no errors.

### Session 4 (2026-10-13): Thock icons
- Added `src/components/icons/thock-icons.tsx`, 32 hand-drawn icons that replace Lucide on `/icons`.
  - Style: 2.75 stroke, round joins and a 16% tinted body.
  - States: each icon has `rest`, `hover` and `press`. Hover moves individual parts, and press is a springy whole-glyph squash.
  - Control: icons react to their own hover and tap by default, or a parent can drive them with the `state` prop.
- The `/icons` gallery now uses keycap tiles (`shadow-keycap` / `shadow-keycap-down` tokens) that sink on press. It also has a stroke-weight picker, search that covers motion descriptions, and hatched row fillers.
- Copying an icon copies `import { XIcon } from "@/components/icons/thock-icons"`. The set ships as the `thock-icons` registry item through the `extras` list in `scripts/build-registry.ts`.
- Fixed: `cn("bg-background bg-hatch")` dropped the background colour, because tailwind-merge sees both as bg classes.

### Session 5 (2026-10-13): Bubbly icons
- Added `src/components/icons/bubbly-icons.tsx`, the same 32 icons in an inflated style. It ships as the `bubbly-icons` registry item.
  - Drawing: shapes are filled and puffed, and details are punched out with masks. The ids come from `useId`, so cut-outs work on any background.
  - Gloss: a white highlight on chunky shapes only. On thin tubes it reads as a nick.
  - Motion: a jelly wobble on hover, a wide squish on press, part-level moves, and `Rise` bubbles that float up.
- On `/icons`, a Thock/Bubbly switcher syncs to `?set=bubbly`. Bubbly uses round "bubble" tiles (`shadow-bubble` token). Motion hints are stored per set in `icon-registry.ts` (`motion[set]`).

### Session 6 (2026-10-13): Icon color bar
- Added `src/app/icons/_components/color-bar.tsx`. It offers Auto (theme foreground), 8 presets, a native colour picker behind a rainbow swatch, and a hex field that accepts 3 or 6 digits, with invalid input reverting.
- The colour tints every tile through inline `color` (icons use `currentColor`). It syncs to `?color=rrggbb` with a 250ms debounce and persists across set switches.
- With a colour active, copying an icon also copies a usage line: `<HeartIcon className="text-[#ec4899]" />`.

### Session 7 (2026-10-13): Icon toolbar cleanup
- `/icons` controls were cut from 4 rows to 2:
  - Row 1: the set switcher and the install command. The set blurb moved into the switcher's `title`.
  - Row 2: one wrapping toolbar with search, `CategoryMenu` (a Radix dropdown with counts that replaces the 8 tabs), the weight picker and the colour pill.
- The colour bar is now one `h-9` pill:
  - An Auto swatch, then a divider, 8 presets and a custom rainbow swatch.
  - An inset hex chip with a live colour dot.
  - The selected ring slides via `layoutId`.
  - On mobile the swatches scroll horizontally, and the selected swatch auto-scrolls into view.
- Removed all `uppercase tracking-wider` labels site-wide, including Eyebrow, footer headings, the hero stage, Terminal and prev/next. Eyebrow and footer headings went from 11px to 12px.

## Still open
- [ ] `interract.dev` in `REGISTRY_URL` is assumed to be the production domain.
- [ ] The code view has no syntax highlighting.

## Session 8 (2026-10-13): Click glitch + spectrum colour picker
- Icons: parts only ever see rest/hover (inner `motion.g`), so a click no longer replays the hover animation twice; bubbly root has a `settle` spring after press instead of re-running the wobble keyframes. Tile bubble uses motion springs instead of CSS transitions.
- Toolbar order: search, type (Standard/Bubbly, icon-only under 440px), categories, weight (Standard only), colour drop on the right. Install command moved under the grid.
- Colour: closed = swirling "drop" of the current colour; open = right-anchored pill with a draggable hue spectrum (role=slider, arrow keys), hex field and reset. Presets removed. Thock set display name is now "Standard".

## Session 9 (2026-10-13): Components sidebar (Aceternity-style)
- `src/app/components/layout.tsx` wraps the index and every `[slug]` page in `PageShell max-w-7xl` with a 248px sticky sidebar (`_components/components-sidebar.tsx`). Pages no longer render PageShell themselves.
- Sidebar: Getting started (All components, Installation → /docs#installation, Theming), then each type from `componentTypes` (Primitives grouped by category with clickable sub-headings → `?category=`; Blocks flat), then Icons sets. `layoutId` pill slides between items since the layout persists. Below lg: sticky "Browse components" bar opening a drawer (Escape/backdrop/route change close it).
- Registry: `componentTypes`, `typeOf`, `groupByCategory`, `isNew` (set on the 8 blocks → "New" badges). Index page: search + type tabs (`?type=`), removable category chip, 2-col live-preview grid. Detail breadcrumb: Components › Type › Category.
- Section rules: `.section-rule` class on Section's bleed line; the components layout pins it to the content column so it doesn't run under the sidebar.
- Cherry Bomb One moved to root layout as `--font-bubble` (`font-bubble`, preload: false) to stop "preloaded but not used" warnings from header prefetch of /icons.
