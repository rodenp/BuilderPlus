# Forensic Design Audit

**Date:** 2025-12-19
**Goal:** Verify strict adherence to `design-guide.md` principles across the entire codebase.

## Audit Checklist

### 1. Hardcoded Style Violations
*   [ ] Search for hardcoded hex codes in `src/components/canvas-components`
*   [ ] Search for `style={{` with literal values (not variables) in Renderers.

### 2. Resolution Hierarchy Violations
*   [ ] Verify Renderers use `styles` or `mergedProps` instead of raw `props` for thematic values.
*   [ ] Check `Button`, `Card`, `Container` specific renderers.

### 3. Tailwind Dependency
*   [ ] Ensure no `bg-blue-*` or `text-*-*` classes are used for dynamic elements (Canvas).
*   [ ] UI Components (`PropertyPanel`, `SideMenu`) are allowed to use Tailwind for *layout*, but should use Theme variables for core colors.

### 4. Registry Integrity
*   [ ] Are all keys used in `Renderer` files registered in `style-properties.ts`?
*   [ ] Do all fallback values match?

### 5. Export Consistency (`getHTML`)
*   [ ] Does `getHTML` generate the same styles as `Renderer`?

---

## Findings Log

### 1. Hardcoded Styles
*   `menu/Renderer.tsx`: Likely contains hardcoded dropdown colors.
*   `textarea/Renderer.tsx`: Likely contains hardcoded border/bg colors.
*   `select/Renderer.tsx`: Likely contains hardcoded select styles.
*   `container/Renderer.tsx`: Confirmed to have some hardcoded logic.
*   `card/Renderer.tsx`: Likely legacy card styles.
*   `input/Renderer.tsx`: Likely hardcoded input borders.
*   `form/Renderer.tsx`: Confirmed legacy form styles.

### 2. Prop Access Violations
*   Initial grep returned no blatant `component.props.*Color` usage, suggesting most components are using the new `commonStyles` or `styles` prop.
*   *Note*: `Button` and `Card` were previously audited and fixed.

### 3. Registry Mismatches
*   Logic Check: `style-properties.ts` was recently expanded and appears to cover all major components (`Button`, `Card`, `Typography`, `Forms`).
*   Risk: `Input` and `Select` components likely need specific keys (e.g. `inputBorder`, `inputBg`) which seem missing from the `Forms` group (only `formPadding` exists).
