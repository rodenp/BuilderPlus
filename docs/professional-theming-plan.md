# Professional Theming System Implementation Plan

## Goal
Implement a professional, enterprise-grade theming system where "Global Settings" are replaced by a distinct **Dual-Theme Architecture** (Light & Dark).
The `GlobalRegistry` will act purely as a schema repository. The application state will hold two complete sets of values: `light` and `dark`.
A new **Theme Panel** will allow users to configure these values for every property.

## 1. Schema & Registry Refactor (`src/config/style-properties.ts`)
We will verify that the registry is purely a "Definition of Capabilities".
We must update the `StylePropertyDefinition` to require default values for both modes.

```typescript
export interface StylePropertyDefinition {
  key: string;
  label: string;
  type: 'text' | 'color' | 'select' | 'number';
  // New: Explicit defaults for both modes
  defaultValue: {
    light: string | number | null;
    dark: string | number | null;
  };
  // ... options, etc.
}
```

## 2. Data Model Refactor (`src/types/bodySettings.ts`)
We will replace the singular `globalStyles` object with two distinct theme configurations.

```typescript
export interface ThemeValues {
  [key: string]: string | number | null | undefined;
}

export interface BodySettings {
  // ... existing meta properties (pageTitle, etc.)

  // The Two Complete Themes
  theme: {
    light: ThemeValues;
    dark: ThemeValues;
  };

  // Current Mode Preference (saved with project or just for preview?)
  // Usually this is app state, but we might want to save the "default starting mode"
  defaultMode: 'light' | 'dark' | 'system';
}
```

## 3. UI: The Theme Panel (`src/components/panels/ThemePanel.tsx`)
We will create a new, high-density panel dedicated to theming.
*   **Location**: It replaces the usage of "Global Styles" in `BodyPanel`.
*   **Structure**:
    *   Iterates over `globalStyleRegistry.getGroups()`.
    *   For each property, allows editing the **Light Value** and **Dark Value**.
    *   *UX Option*: A toggle at the top of the panel "Editing: Light Mode | Dark Mode".
*   **Framework Agnostic**: It writes directly to `bodySettings.theme.light` or `bodySettings.theme.dark`.

## 4. App Integration (`App.tsx`)
*   **Sidebar**: Add/Update the 'Brand' or 'Theme' tab to open this new `ThemePanel`.
*   **Preview**: Ensure the Canvas and Preview Mode respect `bodySettings.theme[currentMode]`.

## 5. Migration of Global Logic
*   **Remove**: `ColorPicker`s for "Global Defaults" from `BodyPanel.tsx`.
*   **Redirect**: `BodyPanel` should only handle *Instance* settings if any (like Page Meta) or just be removed if it overlaps entirely.
    *   *Decision*: `BodyPanel` currently handles Page Title, Favicon, etc. We will keep it for "Page Settings" but move all Styling to "Theme Panel".

## 6. Implementation Steps
1.  [ ] **Update Registry Schema**: Modify `StylePropertyDefinition` to support `defaultValue.light` and `.dark`.
2.  [ ] **Refactor Defaults**: Update the `defaultGroups` constant to provide these values.
3.  [ ] **Refactor Store**: Update `BodySettings` interface and `defaultBodySettings`.
4.  [ ] **Create ThemePanel**: Implement the new configuration UI.
5.  [ ] **Update App.tsx**: Mount the `ThemePanel` in the sidebar.
6.  [ ] **Integration**: Connect `CanvasComponentRenderer` to use the new `theme` object.
