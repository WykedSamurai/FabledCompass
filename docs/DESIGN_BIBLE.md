# Fabled Compass Design Bible

## Purpose

This document defines how Fabled Compass should look, feel, move, and communicate.

The interface should feel calm, elegant, professional, and intentional. It should never feel loud, cluttered, childish, or game-first.

## Core Design Principles

1. Professional first.
2. Quiet confidence over visual noise.
3. Space is part of the design.
4. Color signals context, not decoration.
5. Motion should guide attention, never demand it.
6. Overlays should preserve workspace context.
7. Growth should be discovered, not announced.
8. The compass, stars, and constellations are functional symbols, not ornament.

## Visual Language

### Slate

Slate is the foundation of the interface.

It represents calm, focus, and trust.

Primary surfaces should use dark slate tones rather than pure black or bright white.

### Cyan

Cyan represents the Career Journey.

Use it for:

- active navigation
- primary actions
- links
- selected states
- focus rings
- progress
- professional growth indicators

Cyan should remain restrained so it keeps meaning.

### Amber

Amber represents the Community Journey.

Use it for:

- friends
- groups
- mentors
- networking
- events
- social collaboration

Amber should feel warm and welcoming, not bright or playful.

### Crimson

Crimson represents the Adventure Journey.

Use it for:

- scenarios
- assessments
- AI roleplay
- challenge progress
- scenario-specific interaction states

Crimson should feel focused and immersive, not aggressive.

## Design Tokens

Recommended foundation:

- Background: `#10161D`
- Surface: `#18222D`
- Card: `#1F2B38`
- Elevated Card: `#243343`
- Border: `#314556`
- Primary Text: `#F3F4F6`
- Secondary Text: `#94A3B8`
- Career Accent: `#2DD4F3`
- Community Accent: `#F59E0B`
- Adventure Accent: `#EF4444`
- Success: `#22C55E`
- Warning: `#F59E0B`
- Danger: `#EF4444`

## Typography

Typography should communicate hierarchy through weight and spacing, not oversized text.

### Rules

- Avoid giant hero headlines inside the signed-in workspace.
- Page titles should generally remain between 24px and 38px.
- Section titles should generally remain between 16px and 22px.
- Supporting copy should be concise.
- Uppercase labels should be small, subtle, and used sparingly.
- No interface text should feel like advertising copy.

### Preferred Pattern

```text
Portfolio
Manage your professional identity and evidence.
```

Not:

```text
BUILD THE CAREER YOU WERE MEANT TO HAVE
```

## Layout

Fabled Compass is a workspace, not a sequence of marketing pages.

### Signed-In Shell

- Fixed or sticky left sidebar
- Minimal top bar
- Scrollable main workspace
- Persistent Communication Hub access
- Consistent content width and spacing

### Spacing

- Use generous but efficient spacing.
- Avoid cramped controls.
- Avoid excessive empty space that reduces utility.
- Reuse a consistent spacing scale.

Recommended spacing scale:

- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 48px

## Components

### Cards

Cards should use:

- dark slate surface
- thin border
- soft radius
- restrained shadow
- consistent internal spacing

Cards should not use bright white backgrounds or heavy shadows.

### Buttons

Use three styles only:

1. Primary: accent-filled or accent-tinted
2. Secondary: outlined
3. Ghost: text-only or transparent

Primary actions should be visually clear but never oversized.

### Forms

Inputs should use:

- consistent heights
- consistent radii
- dark surface
- subtle border
- clear focus ring
- readable labels

### Drawers and Overlays

Drawers should preserve the user's sense of place.

The Communication Hub should use frosted slate glass with:

- 85–92% opacity
- backdrop blur
- thin journey-colored edge
- subtle shadow
- calm slide animation

The workspace should remain visible behind the drawer.

## Glass UI

Glass is reserved for overlays and temporary layers.

Use it for:

- Communication Hub
- notifications
- quick views
- contextual inspectors
- search overlays

Do not use glass for every card or surface.

## Motion

Motion should feel deliberate and restrained.

Recommended durations:

- Hover: 120–160ms
- Fade: 150–200ms
- Drawer: 180–220ms
- Page transition: 180–240ms

Rules:

- No bouncing.
- No continuous pulsing.
- No unnecessary spinning.
- Compass thinking motion may use a slow, subtle needle rotation.
- Star completion may use a short glow and soft shimmer.

## Brand Symbols

### Compass

The compass represents direction.

Use it in:

- brand mark
- favicon
- app icon
- Communication Hub
- loading states
- Professional Compass
- navigation accents

### Stars

Stars represent completed evidence.

A star should correspond to a meaningful achievement, assessment, scenario, project, or verified competency event.

### Constellations

Constellations represent related bodies of evidence.

Examples:

- Communication
- Leadership
- Customer Service
- Professionalism
- Problem Solving
- Adaptability
- Teamwork
- Industry-specific pathways

A constellation should only glow fully when its defined requirements are complete.

## Professional Sky

The Professional Sky is the long-term visual record of growth.

It should:

- show completed stars
- connect related evidence into constellations
- use journey or competency color carefully
- remain readable and accessible
- allow users to inspect the evidence behind each star

The sky should become richer as the user grows.

## Achievement Philosophy

Fabled Compass should reward curiosity, not interrupt focus.

Do not use:

- confetti
- loud achievement banners
- flashing notifications
- exaggerated sound effects

Preferred behavior:

- one star illuminates
- a short glow appears
- a quiet message confirms the evidence was added

Example:

```text
Competency demonstrated.
Customer Recovery was added to your Portfolio.
```

## Communication Hub

The Communication Hub is a persistent communication layer.

It supports:

- Compass AI
- friends
- private messages
- recruiters
- employers
- groups
- notifications
- OOC roleplay chat

The drawer must feel integrated with the workspace rather than like a separate application.

### Context Rules

The Hub should know the active page or experience.

Examples:

- Portfolio: offer portfolio help
- Jobs: explain match reasons
- Scenario: provide OOC or rules help
- Community: support networking and messaging

## Journey Themes

The shell, typography, spacing, and components remain consistent across all journeys.

Only the accent system changes.

### Career

- Accent: Cyan
- Mood: confident, clear, professional

### Community

- Accent: Amber
- Mood: warm, connected, collaborative

### Adventure

- Accent: Crimson
- Mood: focused, immersive, intentional

## Accessibility

- Never rely on color alone.
- Maintain sufficient text and control contrast.
- Support keyboard navigation.
- Provide visible focus states.
- Support screen readers.
- Respect reduced motion preferences.
- Ensure drawer and modal focus trapping.
- Keep constellation data available in a text or list view.

## Product Promise

A resume tells where someone has been.

A portfolio shows what someone has built.

A constellation shows what someone has become.
