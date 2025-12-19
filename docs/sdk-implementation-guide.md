# SDK & Extensibility Guide

## Core Architecture
The builder is built as a modular library (`@builder-plus/core`) where every component and stylistic property is dynamically registered. The "Active Theme" serves as the primary source of truth for all component styles.

## 1. Global Style Registry
The `StyleRegistry` is a dynamic, authoritative superset of all styling capabilities. It ensures that any property used by a component can be globally managed via the **Theme Panel**.

### Standard Property Definition
```typescript
export interface StylePropertyDefinition {
    key: string;              // The CSS property or custom style key
    label: string;            // Human-readable label
    type: PropertyFieldType;  // 'color', 'spacing', 'number', 'text', etc.
    group: string;            // Grouping for the Theme Panel (e.g., 'Spacing')
    systemFallback?: any;     // Absolute last-resort fallback value
    options?: { label: string; value: string }[];
}
```

## 2. Dynamic Registration API
To add new components, styles, or themes, use the public SDK APIs.

### Registering a Component (and its styles)
Components register their *metadata* to ensure the Theme Panel can manage them.

```typescript
import { registerComponent } from '@builder-plus/core';

registerComponent('custom-banner', {
  Renderer: BannerRenderer,
  styleProperties: [
    { 
      key: 'bannerShadow', 
      label: 'Accent Shadow', 
      type: 'text', 
      group: 'Effects',
      systemFallback: '0 4px 6px -1px rgba(0,0,0,0.1)' 
    }
  ],
  defaultProps: {
    title: 'Hello World',
    backgroundColor: 'primary'
  }
});
```

### Registering a Theme
Standard or brand-specific themes can be registered globally.

```typescript
import { registerTheme } from '@builder-plus/core';

registerTheme('neon-night', {
  id: 'neon-night',
  name: 'Neon Night',
  styles: {
    primaryColor: '#00ffcc',
    surfaceColor: '#0a0a0a',
    textColor: '#ffffff',
    borderColor: '#333333'
  }
});
```

### Registering Core Style Metadata
```typescript
import { registerStyleFields } from '@builder-plus/core';

registerStyleFields([
  { key: 'pagePadding', label: 'Page Padding', type: 'spacing', group: 'Layout', systemFallback: '40' },
  { key: 'siteMaxWidth', label: 'Max Width', type: 'text', group: 'Layout', systemFallback: '1200px' }
]);
```

## 3. Style Inheritance & Themes
Components do not hardcode Light/Dark values. Instead, they follow a hierarchy of style resolution provided by the core renderer.

### Resolution Order:
1.  **Manual Overrides**: Direct inline styles or user-forced values (Highest Priority).
2.  **Component Props**: Specific values set on the individual component instance.
3.  **Body/Page Overrides**: Page-level customizations set in the **Body Panel**.
4.  **Active Theme (Project-Specific)**: Values from `bodySettings.customThemes` if the ID matches.
5.  **Active Theme (Global Registry)**: Values from `themeRegistry` (e.g., 'Light', 'Dark').
6.  **Component Defaults**: Defaults defined in the component's registration.
7.  **Global System Defaults**: The baseline fallback defined in `style-properties.ts`.

## 4. Component Implementation Pattern
A well-implemented component uses the `styles` prop provided by the core renderer to automatically respect the active theme.

```typescript
// YourComponentRenderer.tsx
export const Renderer = ({ props, styles }) => {
  return (
    <button style={{
      ...styles, // Spreads all active theme values
      backgroundColor: props.backgroundColor || styles.primaryColor
    }}>
      {props.text}
    </button>
  );
};
```

## 5. Component Creation Blueprint

This is a complete, copy-pasteable example of how to add a new "Audio Track" component to the builder. This single file or module contains everything required for registration, rendering, and export.

```tsx
import React from 'react';
import { 
  registerComponent, 
  ContainerDroppable, 
  type CanvasComponentProps 
} from '@builder-plus/core';

/**
 * 1. THE RENDERER
 * This is how the component looks on the Canvas.
 * - 'props' are unique to this specific instance.
 * - 'styles' are provided by the Active Theme (Colors, Border, etc.)
 */
const AudioRenderer: React.FC<CanvasComponentProps> = ({ props, styles }) => {
  return (
    <div style={{
      ...styles, // Spreads theme background, border, padding, etc.
      display: 'flex',
      alignItems: 'center',
      borderLeft: `4px solid ${styles.primaryColor || '#22c55e'}`,
      opacity: props.isVisible ? 1 : 0.5
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold' }}>{props.title}</div>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>{props.artist}</div>
      </div>
      <div style={{ fontSize: '12px' }}>{props.duration}</div>
    </div>
  );
};

/**
 * 2. REGISTRATION
 * Define the component metadata and tell the builder how to handle it.
 */
export function initCustomComponents() {
  registerComponent('audio-track', {
    label: 'Audio Track',
    category: 'Media',
    icon: 'Music', // Uses Lucide icon name
    
    // The visual rendering function
    Renderer: AudioRenderer,

    // Define editable properties for the Property Panel
    properties: [
      { key: 'title', label: 'Song Title', type: 'text', group: 'Content' },
      { key: 'artist', label: 'Artist Name', type: 'text', group: 'Content' },
      { key: 'duration', label: 'Duration', type: 'text', group: 'Content' },
      { key: 'isVisible', label: 'Visible', type: 'boolean', group: 'Settings' }
    ],

    // These default values are used when a new item is dropped
    defaultProps: {
      title: 'New Track',
      artist: 'Unknown Artist',
      duration: '0:00',
      isVisible: true
    },

    // Optional: Contribute specific style properties metadata to the global pool
    styleProperties: [
      { 
        key: 'primaryColor', 
        label: 'Accent Color', 
        type: 'color', 
        group: 'Colors',
        systemFallback: '#22c55e'
      }
    ],

    // How to generate static HTML for the final export
    getHTML: async (component) => {
      const { props } = component;
      return `
        <div class="audio-track" style="border-left: 4px solid #22c55e; padding: 10px;">
          <strong>${props.title}</strong> - ${props.artist} (${props.duration})
        </div>
      `;
    }
  });
}
```

## 6. Container & Hierarchy Patterns

For components that hold other components (like Playlists or Cards), use the `ContainerDroppable` component.

```tsx
import { registerComponent, ContainerDroppable } from '@builder-plus/core';

registerComponent('playlist-container', {
  label: 'Playlist',
  isContainer: true,
  allowedChildren: ['audio-track'], // Restrict what can be dropped inside
  
  Renderer: ({ component, builderContext, styles }) => (
    <div style={styles}>
      <h3>{component.props.title}</h3>
      {/* The drop zone for children */}
      <ContainerDroppable
        containerId={component.id}
        containerType={component.type}
        children={component.children || []}
        builderContext={builderContext}
        emptyContent={<div>Drop audio tracks here</div>}
      />
    </div>
  )
});
```

## 7. Summary of Best Practices
1.  **Registry First**: Ensure every stylistic property is registered to enable global theming support.
2.  **Thematic Resolution**: Always spread the `styles` prop into your root container to respect the active user theme.
3.  **Encapsulation**: Keep your renderers focused on the data provided by `props` and `styles`.
