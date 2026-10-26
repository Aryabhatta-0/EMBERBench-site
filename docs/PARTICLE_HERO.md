# Fine-particle hero alternative

This branch is an experiment stacked on `codex/anantam-company` (PR #3), starting from commit `19767d3b586a331b13f8aee534bd69b516971139`. The original ribbon version remains on that branch. This PR changes only the hero treatment, its fallback, related tests and design documentation.

The full-window, edge-to-edge light hero and EMBERBench naming remain. Fine blue particles replace the ribbon paths, with a quiet center around the supplied logo, title and action. There are no connecting lines, large glowing dots, pointer tracking or pause control.

One Canvas draws 1,100 small particles on desktop and 360 on phones, in five opacity batches. It caps rendering at 30fps and pixel density at 1.5. A gentle four-second drift resolves into a static field, after which no animation frame remains scheduled. Offscreen or hidden documents settle immediately. Resize redraws the final state without replaying it. Navigation cancels the frame and observers. Reduced motion renders the final frame directly. An authored static SVG provides a no-JavaScript or unavailable-Canvas fallback.

## Skills used

The dedicated skill-discovery agent checked the installed skills again. No additional download was necessary: the relevant skills were already installed and read. No particle library or new runtime package is added.

| Skill | Application |
| --- | --- |
| Animate, using Emil’s motion principles (`~/.agents/skills/animate/SKILL.md`) | Marketing-only delight, the cheapest fitting tool, a finite entrance, immediate reduced-motion behavior, and no unnecessary framework. |
| Official GSAP Performance (`~/.codex/skills/gsap-performance/SKILL.md`) | Batched work, one animation loop, bounded particle count/pixel density, no per-particle DOM animation, and offscreen/page-exit cleanup. These principles apply to the native Canvas implementation; no GSAP tween is needed for the field. |
| LottieFiles Motion Design (`~/.codex/skills/motion-design/SKILL.md`) | Calm motion personality, restrained travel, a clear resolution and an undisturbed reading area. |

The published benchmark data, analytical routes and original PR branch remain unchanged. Chromium tests cover actual changing pixels, final settlement, fixed pointer behavior, reduced motion, unavailable Canvas and no-GSAP behavior. Physical devices and other browser engines are outside the runtime checks.

Validation completed: 19 Node checks, 314 browser checks and 57 automated WCAG A/AA scans passed, with zero violations in the rules checked. The original base branch still points to 19767d3.
