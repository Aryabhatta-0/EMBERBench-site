# Fine-particle hero alternative

This branch is an experiment stacked on `codex/anantam-company` (PR #3), starting from commit `19767d3b586a331b13f8aee534bd69b516971139`. The original ribbon version remains on that branch. This PR changes only the hero treatment, its fallback, related tests and design documentation.

The selected direction assembles Anantam's actual emblem from fine particles. A 220px sampling canvas reads the supplied PNG's alpha and ink pixels; these coordinates become the particle targets. The HTML logo supplies the fallback, and remains in layout so the title and action do not shift. The visible particle emblem is 156px on desktop and 112px on phones.

The ten-second cycle assembles over three seconds, holds the complete emblem for four, releases over two and rests briefly before reforming. Up to 1,800 desktop particles or 1,000 phone particles render in four opacity batches, capped at 30fps and 1.5 pixel density. Particles stay above the reading area. There are no ribbons, connecting lines, cursor tracking or pause controls.

Reduced motion renders the completed particle emblem immediately. Hidden/offscreen state suspends rendering and resumes it on return. Resize recalculates targets from the logo's current position. If Canvas, sampling or JavaScript is unavailable, the original supplied emblem remains visible. Navigation releases the frame, observers and listeners. The former random-dust SVG is removed.

## Skills used

The dedicated skill-discovery agent checked the installed skills again. No additional download was necessary: the relevant skills were already installed and read. No particle library or new runtime package is added.

| Skill | Application |
| --- | --- |
| Animate, using Emil’s motion principles (`~/.agents/skills/animate/SKILL.md`) | Marketing-only delight, the cheapest fitting tool, visible ambient motion, immediate reduced-motion behavior, and no unnecessary framework. |
| Official GSAP Performance (`~/.codex/skills/gsap-performance/SKILL.md`) | Batched work, one animation loop, bounded particle count/pixel density, no per-particle DOM animation, and offscreen/page-exit cleanup. These principles apply to the native Canvas implementation; no GSAP tween is needed for the field. |
| LottieFiles Motion Design (`~/.codex/skills/motion-design/SKILL.md`) | Calm motion personality, coherent drift, restrained scale and an undisturbed reading area. |

The published benchmark data, analytical routes and original PR branch remain unchanged. Chromium tests cover actual assembly and release pixels, confinement to the supplied emblem bounds, offscreen suspension, fixed pointer behavior, reduced motion, unavailable Canvas and no-GSAP behavior. Physical devices and other browser engines are outside the runtime checks.

Validation completed: 19 Node checks, 316 browser checks and 57 automated WCAG A/AA scans passed, with zero violations in the rules checked. The original base branch still points to 19767d3.
