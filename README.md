# Kingsgate Dental

A production rebuild of the Kingsgate Dental "Dark Luxury" site, in the
animation idiom of [lavadental.lv](https://lavadental.lv/en) — buttery smooth
scroll, line-by-line heading reveals, scroll-triggered section fades, parallax
imagery, magnetic buttons, and a custom cursor.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind v4 + CSS custom-property design tokens |
| Animation | GSAP 3.15 (ScrollTrigger + SplitText, now free) |
| Smooth scroll | Lenis, driven off GSAP's ticker (single RAF loop) |
| Icons | lucide-react |

## Animation language (LAVA-inspired)

- **Smooth scroll** — `components/SmoothScroll.tsx`. Lenis with `lerp: 0.08`,
  synced to `ScrollTrigger.update` and driven from a single GSAP ticker loop.
- **Heading reveals** — `components/anim/AnimatedHeading.tsx`. SplitText splits
  each heading into lines; each line is wrapped in an `overflow:hidden` mask and
  rises into view (`yPercent: 115 → 0`) on scroll. The hero plays immediately.
- **Section reveals** — `components/anim/Reveal.tsx`. Fade + slide-up on scroll,
  with optional child stagger.
- **Parallax** — `components/anim/Parallax.tsx`. Inner layer scrubs against
  scroll progress for depth on clinic imagery.
- **Magnetic buttons** — `components/anim/MagneticButton.tsx`. Drift toward the
  cursor, elastic snap-back on leave.
- **Custom cursor** — `components/Cursor.tsx`. Dot + lagging follower ring that
  expands over interactive elements.
- All motion respects `prefers-reduced-motion` and degrades to visible content
  server-side (SSR-safe, SEO-friendly).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the build
```

## Structure

```
app/
  layout.tsx      fonts, metadata
  page.tsx        section assembly + ScrollTrigger.refresh()
  globals.css     design tokens, Lenis styles, keyframes, button styles
components/
  SmoothScroll, Cursor, Nav
  anim/           Reveal, AnimatedHeading, MagneticButton, Parallax
  sections/       Hero, About, Services, Showcase, Office, Team,
                  SmileGallery, Faq, Contact, Footer
lib/
  gsap.ts         plugin registration
  data.ts         services, team, FAQ, gallery, image URLs
```

## Notes / next steps

- **Stock imagery** — team headshots and gallery photos are Unsplash
  stand-ins; clinic interiors are the real CDN images. Swap in real
  patient/team photos (with consent) when available.
- **Map** is a styled SVG schematic pointing at East Broadway, with an
  "Open in Maps" link to Google Maps — no flaky external embed.
- The "Make an appointment" CTAs all smooth-scroll to `#contact`, ready for
  a custom booking form.
