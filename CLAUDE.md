# CLAUDE.md — Shruti's Creative Director Portfolio

## Project Overview

This is a **creative director-level portfolio** built by a designer who uses Claude Code as a development medium. It is not a standard developer portfolio, and it should not look like one.

The site must be Awwwards-submission worthy — a piece of work that creative directors at agencies like Locomotive, Obys, Resn, or Monks would stop and study. It should also speak to design-forward organizations like Anthropic, where taste, craft, and the intersection of creativity and technology matter.

**Primary goal**: Demonstrate that a creative director with deep design instincts can wield Claude Code to produce genuinely exceptional digital work — not just functional code, but work with a distinct point of view.

**Secondary goal**: Show range. Brand identity, packaging systems, DTC/CPG work, interactive UI, and editorial design should all have a presence. The portfolio is the work *and* the proof of concept.

---

## Skills & Frameworks Claude Must Use

Before writing any code, Claude should read and internalize the following skill files:

```
/mnt/skills/user/award-winning-web-animations/SKILL.md
/mnt/skills/public/frontend-design/SKILL.md
```

These are not optional references — they define the quality bar for this project. Every decision about motion, layout, typography, and interaction should be filtered through their guidance.

---

## Design Principles for This Portfolio

### This is not a portfolio website. It is a design artifact.

It should feel like the designer made it, not like the developer finished it. The code serves the vision — never the other way around.

**The aesthetic direction must be:**
- Genuinely unexpected. No Inter. No purple gradients. No cards with hover shadows.
- Editorially considered. Think magazine-grade layout decisions: tension, hierarchy, breath.
- Viscerally typographic. Type should carry personality. Pair a distinctive display face with a precise body face.
- Kinetic but restrained. Motion should feel authored, not automated. One unforgettable sequence beats ten forgettable ones.

### Motion System (GSAP + Lenis Required)

Use **GSAP** with **ScrollTrigger** for all scroll-driven animation. Use **Lenis** for smooth scroll. These are non-negotiable for a site targeting Awwwards.

Implement:
- A cinematic loader with progress counter
- Staggered hero reveal with SplitText-style character/word animation
- Scroll-triggered project reveals with parallax depth
- Magnetic hover effects on CTAs and links
- Custom cursor that reacts to context (changes on image hover, project hover, etc.)
- Page/section transitions that feel like turning pages, not navigating routes

### Layout Philosophy

Break the grid. Then bring it back. Then break it again.

Use asymmetry, overlap, and negative space as design tools. Sections shouldn't feel templated — each one should have its own spatial logic that still coheres with the whole. Think editorial spreads, not component libraries.

---

## Site Architecture

### Core Sections

**1. Opening / Hero**
Not a name and tagline. An experience. A visual statement about how this designer sees the world and makes things in it. This is where the "wow" moment lives.

**2. Work**
Projects presented with full creative context — not just the output but the *thinking*. Include: brand identity systems, packaging design and multi-SKU label systems, DTC/CPG brand work, interactive UI, and web design.

Horizontal scroll is encouraged for the work section. Each project card should feel like a mini identity system for that project.

**3. Process / About**
This is a creative director who uses AI as a design tool — not a developer who learned to design. The "about" section should communicate instinct, range, and a philosophy about where design is going.

**4. Contact**
Elegant. Confident. Not a form — a statement.

---

## Technical Standards

### Stack
- **Vanilla HTML/CSS/JS** or **Astro** — this is a portfolio, not an app. Keep it lean.
- GSAP + ScrollTrigger + Lenis (CDN or npm, your choice)
- Three.js if a WebGL element is appropriate (hero background, project transitions)
- No component frameworks unless genuinely needed

### Performance
- 60fps animations on all devices, always
- Lazy load all images/video
- `will-change` used intentionally and cleaned up post-animation
- `prefers-reduced-motion` respected throughout
- Lighthouse score 90+ even with animations

### Responsiveness
- Mobile-first thinking, even if desktop is the hero experience
- Animations simplified (not just disabled) on mobile
- Custom cursor hidden on touch devices
- Typography scales fluidly — no abrupt breakpoint jumps

### Accessibility
- Keyboard navigation functional throughout
- Focus states visible and styled (not hidden, not default)
- Screen reader compatible structure beneath the visual layer
- WCAG 2.1 AA minimum

---

## Voice & Tone

This portfolio should feel like it was made by someone who:
- Has strong opinions about type and space
- Knows what a dieline is
- Has sat in brand strategy sessions and creative reviews
- Is not intimidated by a blank canvas
- Builds with AI the way a photographer uses a camera — as the instrument of a vision, not the vision itself

Avoid:
- "Hi, I'm [name], a designer who loves creating beautiful experiences" energy
- Case study formats that feel like a PowerPoint deck
- Anything that reads like an agency template

---

## Submission Checklist (Pre-Launch)

Before considering this done, verify:

**Awwwards-level quality:**
- [ ] Would this win a site of the day? Honestly?
- [ ] Is there at least one moment that makes you stop scrolling?
- [ ] Does the type feel designed, not defaulted?
- [ ] Is the motion choreographed, not scattered?
- [ ] Does the color palette feel intentional and unusual?

**Technical quality (from award-winning-web-animations SKILL.md):**
- [ ] 60fps on desktop and mobile
- [ ] No layout shifts (CLS < 0.1)
- [ ] Loader → hero transition is seamless
- [ ] Custom cursor implemented and context-aware
- [ ] Magnetic interactions on interactive elements
- [ ] ScrollTrigger animations all have proper `start`/`end` values
- [ ] Lenis smooth scroll initialized and synced with GSAP
- [ ] `prefers-reduced-motion` handled

**Design quality (from frontend-design SKILL.md):**
- [ ] No generic fonts (no Inter, Roboto, Arial, Space Grotesk)
- [ ] Color palette uses CSS variables, commits to a dominant + accent approach
- [ ] Layout breaks the grid in at least two meaningful ways
- [ ] Each section has a distinct spatial personality
- [ ] Backgrounds have depth (texture, gradient mesh, noise, or layered elements)
- [ ] The site has a clear, singular aesthetic POV — not a mix of trends

**Portfolio content:**
- [ ] At least 4 projects shown with genuine creative context
- [ ] Range visible: identity + packaging + web/interactive
- [ ] Process thinking present (not just outcomes)
- [ ] "Made with Claude Code" acknowledged without being the whole story

---

## A Note on This Project

This site is itself a demonstration of the thesis: that a creative director can use Claude Code to produce work that belongs on Awwwards.

Every build decision, every animation, every typographic choice is a piece of evidence for that thesis. Claude is the instrument. The creative direction is Shruti's.

Don't build a template. Build a statement.
