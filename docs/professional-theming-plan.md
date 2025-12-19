# Professional Theming System Implementation Plan

## Goal
Implement a professional, enterprise-grade theming system based on a **Decentralized Theme Architecture**. This replaces the fixed "Global Settings" with an extensible collection of self-contained themes.

> [!IMPORTANT]
> **Decentralization**: The project state (`BodySettings`) no longer mentions "all possible themes". Instead, standard themes live in a core `ThemeRegistry`, and the project only stores the active theme IDs and its own `customThemes`.

## 1. Schema & Registry Refactor (`src/config/style-properties.ts`)
The `StyleRegistry` acts purely as a **Metadata Schema Repository**.

```typescript
export interface StylePropertyDefinition {
  key: string;              // The unique style property ID
  label: string;            // UI Label
  type: PropertyFieldType;  // Editor input type
  group: string;            // Theme Panel grouping
  systemFallback?: any;     // Absolute last-resort fallback
}
```

## 2. Core Theme Registry (`src/core/theme-registry.ts`) [NEW]
Standard themes (Light, Dark, etc.) are registered in the core SDK. They are self-contained collections of styles.

```typescript
export interface Theme {
  id: string;
  name: string;
  styles: Record<string, any>;
}

export const themeRegistry: Record<string, Theme> = {
  'light': { id: 'light', name: 'Default Light', styles: { ... } },
  'dark': { id: 'dark', name: 'Default Dark', styles: { ... } }
};
```

## 3. Data Model Refactor (`src/types/bodySettings.ts`)
`BodySettings` only tracks active pointers and local customizations.

```typescript
export interface BodySettings {
  activeCanvasThemeId: string; // ID of the theme used on the canvas
  activeUIThemeId: string;     // ID of the theme used for the builder UI
  customThemes: Theme[];       // Project-specific themes
}
```

## 4. UI: The Theme Panel (`src/components/panels/ThemePanel.tsx`)
A high-density panel for managing the theme collection.
*   **Source Management**: Aggregates themes from `themeRegistry` and `customThemes`.
*   **Context Control**: Switch themes for the Canvas and UI independently.
*   **Thematic Editor**: Binds directly to the selected theme's `styles` object.
*   **Self-Contained**: Every theme contains all properties; no inheritance between themes.

## 5. App Integration & SDK (`App.tsx`)
*   **SDK Entry**: Provides `registerComponent`, `registerStyleFields`, and `registerTheme`.
*   **Style Resolution Hierarchy**:
    1.  **Manual Overrides** (Top priority)
    2.  **Component Instance Props**
    3.  **Body/Page Overrides** (Page-specific overrides on top of theme)
    4.  **Active Theme** (lookup in Custom -> Registry -> System 'Light'/'Dark')
    5.  **Component Defaults** (Specific defaults defined in `registerComponent`)
    6.  **Global System Defaults** (`style-properties.ts`)

## 6. Component Creation Pattern (SDK)
External developers can register components that "just work" with the global theming system.

```tsx
import { registerComponent } from '@builder-plus/core';

registerComponent('audio-track', {
  Renderer: ({ props, styles }) => (
    <div style={{ borderLeft: `4px solid ${styles.primaryColor}` }}>...</div>
  ),
  styleProperties: [
    { key: 'primaryColor', label: 'Accent Color', type: 'color', group: 'Colors' }
  ]
});
```

## 7. Implementation Steps
1.  [ ] **Metadata Registry**: Refactor `StyleRegistry` to be metadata-only and dynamic.
2.  [ ] **Theme Collection**: Update `BodySettings` to hold a list of `ThemeInstance` objects.
3.  [ ] **SDK APIs**: Implement `registerComponent` and `registerStyleFields`.
4.  [ ] **Dynamic Registry**: Ensure component installation triggers style registration.
5.  [ ] **Theme Manager UI**: Implement the new `ThemePanel` with theme switching and dynamic editing.
6.  [ ] **Theme Persistence**: Ensure all custom themes are saved/loaded correctly in the project JSON.
7.  [ ] **Style Resolution**: Update the core renderer to resolve `styles` from the active theme instance.
