# Design Guidelines: "Signal" Concept

## Concept & Theme
**"Signal"**: A candidate's raw skills are noisy data being resolved into a clear signal of readiness. The visual language should feel like audio/frequency analysis, radar, or a live diagnostic read-out—not a generic dashboard.

## Color Palette
- **Background**: Deep charcoal-navy (`#0b0e14` to `#0d1117`) - cooler than pure black.
- **Primary Accent / Success**: Electric cyan-teal (`#2dd4bf` to `#22d3ee`) - gives the signal/frequency feel.
- **Secondary Accent / Gap**: Warm coral-pink (`#fb7185`) - used sparingly for alerts, gaps, or missing skills.
- **Card Surfaces**: `#111827`, featuring a subtle 1px border with a low-opacity cyan glow (not flat white/gray borders).

## Typography
- **Font Stack**: **Space Grotesk** (or similar geometric sans).
- **Headings**: Medium weight (avoid heavy bold).
- **Body Text**: Off-white/light-gray (softer contrast, never pure white).
- **Labels/Nav**: Generous tracking (wide letter-spacing), small size, uppercase.

## Top Navigation
- **Layout**: Minimal. Logo/wordmark left-aligned ("RADIX" in bold, with a small dot or waveform icon beside it). Nav links right-aligned.
- **Divider**: A thin horizontal gradient bar beneath the nav (cyan → coral → transparent). It should be animated very slowly (shifting gradient position, like a subtle live signal).

## Hero / Signature Moment (Home Page)
- **Visual**: A continuously **MOVING waveform**. Not static. Built with SVG path animation or Canvas. Multiple overlapping translucent wave layers in cyan/teal tones, animating horizontally in a slow, hypnotic loop (like an audio visualizer or heartbeat monitor, never fully stopping).
- **Label**: Small muted label above it (e.g., "Analyzing candidate signal...").
- **Heading**: Large, medium-weight, off-white heading below with the tool name/tagline.

## Info Cards (Dashboard/Status Elements)
- **Content**: Small uppercase muted label, with a bold stat below it in cyan or white.
- **Hover State**: Cards should have a subtle glow/shadow in the accent color on hover, moving away from flat design.

## Results Pages (Talent Check, Skill Matching)
- **Score Display**: A **RADAR/FREQUENCY ring**. A circular progress ring in cyan that animates filling in from 0 on load, with the number counting up in the center. Consider a subtle animated pulse/glow behind the score ring while it's calculating.
- **Tags**: 
  - Matched skills: Small cyan pill tags.
  - Missing/Gap skills: Coral pill tags with a subtle dashed border to distinctively highlight the "gap".

## Motion Principles
- The hero waveform never stops moving (subtle idle animation always running).
- Page transitions: Soft fade + slight upward slide, staggered for nav items on load.
- Score reveals should feel like a diagnostic completing (ring fills, number ticks up, soft glow pulse when finished).

## What to Avoid
- Amber/gold or purple/blue palettes.
- Static/frozen decorative elements (if it's on screen as a hero visual, it should breathe/move).
- Generic SaaS card shadows or glassmorphism blur effects.
