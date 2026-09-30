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

## Still open
- [ ] **Visual pass in a browser** in light and dark, at mobile width, checking for horizontal scroll. Chrome tools weren't available, so nothing has been eyeballed yet.
- [ ] The GitHub links and the "2.4k" star count are placeholders.
- [ ] Optional: fix the pre-existing lint issues.

## Notes
- The dev server for this repo is on **:3002**. Ports :3000 and :3001 belong to other projects.
- Nothing is committed. All work is uncommitted on `main`, together with the user's earlier changes.
