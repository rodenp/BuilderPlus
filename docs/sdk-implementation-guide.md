# Comprehensive Global Defaults & Extensibility Plan

## Goal
Establish a comprehensive "Global Styles Repository" that acts as the source of truth for all available styling properties in the application. Ensure the system is easily extensible, allowing developers to add new properties (like Shadows, Transforms, Filters) without rewriting UI logic.

## 1. Data Model Strategy (The Repository)
We will expand `GlobalStyles` in `src/types/bodySettings.ts` to cover the full spectrum of CSS capabilities.
*   **Concept**: A flat or nested interface representing every styleable attribute.
*   **Default State**: All values are optional (`?: string`) and `undefined` by default, meaning "no global override".

### Proposed structure for `GlobalStyles`:
```typescript
export interface GlobalStyles {
  // Layout
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  padding?: string;
  margin?: string;
  
  // Box Model
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  
  // Borders
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  
  // Backgrounds & Effects
  backgroundColor?: string;
  opacity?: string;
  boxShadow?: string;
  
  // Typography
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  color?: string; // mapped to textColor
  
  // Transforms
  transform?: string;
  // ... and so on
}
```

## 2. Extensible UI Strategy (BodyPanel)
To avoid manually hardcoding hundreds of inputs, we will implement a **Configuration-Driven UI**.

### The `StyleConf` Registry
We will create a `src/config/style-registry.ts` file. This is the "Suggestion for the Future" requested.
It will export a configuration object defining all available properties, their types, and groupings.

```typescript
// Future-proof way to add properties:
export const styleRegistry = [
  {
    group: 'Layout',
    properties: [
      { key: 'gap', label: 'Gap', type: 'text', placeholder: '16' },
      { key: 'display', label: 'Display', type: 'select', options: ['flex', 'grid', 'block'] }
    ]
  },
  {
    group: 'Borders',
    properties: [
      { key: 'borderRadius', label: 'Radius', type: 'text', placeholder: '4' },
      { key: 'borderColor', label: 'Color', type: 'color' }
    ]
  }
];
```

### Benefits
1.  **Easy Addition**: To add a new property (e.g., `textShadow`), you simply add one line to the registry. The UI automatically renders it.
2.  **Consistency**: Ensures `BodyPanel` and `PropertyPanel` (in the future) can share the same definitions.

## 3. Implementation Steps

### Phase 1: The Repository
- [ ] Refactor `src/types/bodySettings.ts` to include the exhaustive `GlobalStyles` interface.

### Phase 2: The Registry (Future-Proofing)
- [ ] Create `src/config/style-properties.ts` (or similar).
- [ ] Define the schema for known properties (starting with the ones we have + the requested generic ones).

### Phase 3: The Dynamic BodyPanel
- [ ] Refactor `src/components/panels/BodyPanel.tsx`.
- [ ] Replace hardcoded sections (where possible) with a map loop over the `styleRegistry`.
- [ ] Maintain special robust components (like the Background Image picker) for complex inputs.

### Phase 4: Integration
- [ ] Ensure `CanvasComponentRenderer` spreads `bodySettings.globalStyles` into `themeDefaults`.
- [ ] Verify inheritance works for a newly added complex property (e.g., `opacity`).

## Dynamic Registration API (Plugin System)

To avoid manual file edits and enable a plugin-friendly architecture, we will convert the static registry into a **Runtime Singleton Manager** and relax the Type definitions.

### 1. Extensible Data Model (`GlobalStyles`)
We will add an **Index Signature** to `GlobalStyles` to allow any string key. This enables plugins to save custom properties without TypeScript errors, while keeping the "Core" properties strictly typed for autocomplete.

```typescript
export interface GlobalStyles {
  // ... core properties like display, color, etc.
  
  // Allow dynamic extension
  [key: string]: string | undefined; 
}
```

### 2. The Style Registry Manager
We will refactor `src/config/style-properties.ts` to export a Singleton Class instead of a static array.

```typescript
class StyleRegistry {
  private groups: StyleGroup[] = [...defaultGroups];

  // Register a completely new group
  registerGroup(group: StyleGroup) {
    this.groups.push(group);
  }

  // Add a property to an existing group
  addProperty(groupId: string, property: StylePropertyDefinition) {
    const group = this.groups.find(g => g.id === groupId);
    if (group) {
      group.properties.push(property);
    }
  }
  
  // Get all groups
  getGroups() {
    return this.groups;
  }
}

export const globalStyleRegistry = new StyleRegistry();
```

### 3. Usage Implementation
*   **Startup**: Components or plugins calls `globalStyleRegistry.addProperty(...)` on app initialization.
*   **BodyPanel**: Uses `globalStyleRegistry.getGroups()` to render the UI.

#### Real-World Example: Adding Text Shadow
Here is how a "Text Effects Plugin" would register a new global property at runtime:

```typescript
import { globalStyleRegistry } from './config/style-properties';

// In your plugin initialization or App.tsx
export function registerTextEffects() {
  // Add 'textShadow' to the existing 'global-typography' group
  globalStyleRegistry.addProperty('global-typography', {
    key: 'textShadow',
    label: 'Text Shadow',
    type: 'text', 
    placeholder: '2px 2px 4px rgba(0,0,0,0.5)'
  });
  
  console.log('Text Shadow property registered!');
}
```
*Result: The "Text Shadow" input immediately appears in the Body Panel, and values are saved/inherited automatically.*

### 4. Implementation Steps - Registration Refactor
- [ ] **Modify Interface**: Add index signature `[key: string]: any` to `GlobalStyles` in `bodySettings.ts`.
- [ ] **Create Manager**: Rewrite `style-properties.ts` to export a `StyleRegistry` class instance.
- [ ] **Update Consumer**: Refactor `BodyPanel.tsx` to consume the registry via method calls.
- [ ] **Export SDK**: Export `globalStyleRegistry` from `src/sdk.ts`.
- [ ] **Verify**: Test adding a "Custom Property" at runtime (simulated) and verify it appears in the panel and saves.

## Library Consumption & Extension

This section demonstrates how **external applications** (consumers) can import `builderplus` and register their own global style properties.

### Scenario: A "Theme Pack" Plugin
Imagine an external app wants to add a "Glassmorphism" effect set using your builder.

#### 1. Import the Registry
The consumer imports the registry from the main SDK entry point.

```typescript
import { globalStyleRegistry } from 'builderplus/sdk'; // Assumptions on package export path
```

#### 2. Register New Properties
Calls to `addProperty` should happen before the Builder component is mounted.

```typescript
// theme-plugin.ts
import { globalStyleRegistry } from 'builderplus/sdk';

export function initializeGlassmorphism() {
  // Create a new group for these special effects
  globalStyleRegistry.registerGroup({
    id: 'glass-effects',
    title: 'Glassmorphism',
    icon: 'Sparkles', // Uses Lucide icon name
    properties: [
      { 
        key: 'backdropFilter', 
        label: 'Blur Amount', 
        type: 'text', 
        placeholder: 'blur(10px)' 
      },
      { 
        key: 'glowingBorder', // Custom key supported by index signature
        label: 'Glow Color', 
        type: 'color' 
      }
    ]
  });
}
```

#### 3. Mount the App
The consumer initializes their plugins, then renders the Builder.

```typescript
// index.tsx (Consumer App)
import React from 'react';
import { Builder } from 'builderplus'; // Main component
import { initializeGlassmorphism } from './theme-plugin';

// 1. Register customizations
initializeGlassmorphism();

// 2. Render App
ReactDOM.render(<Builder />, document.getElementById('root'));
```


## Component Registration Guide

This section provides a cookbook for registering various types of components using the SDK, based on the **Mockup Example**.

### 1. Basic Item (e.g., Audio Track)
Items are leaf nodes. They receive `props` and `commonStyles`.

```typescript
registerPlugin({
    type: 'audio',           // Unique ID
    label: 'Audio',
    icon: 'Music',           // Lucide icon definition
    isContainer: false,
    
    // Properties Panel Config
    properties: [
        { key: 'title', label: 'Title', type: 'text', group: 'content' },
        { key: 'duration', label: 'Duration', type: 'text', group: 'content' }
    ],
    
    // Default Values
    defaultProps: {
        title: 'New Song',
        duration: '3:00',
        borderColor: '#22c55e', // Can utilize global style props
        borderWidth: '0px 0px 0px 4px'
    },
    
    // Render Function
    render: ({ props, styles }) => (
        <div style={{ ...styles, border: props.borderWidth }}> // Merge common styles
            <span>{props.title}</span>
            <span>{props.duration}</span>
        </div>
    ),
    
    // Export Logic
    getHTML: async () => '<div>Audio</div>'
});
```

### 2. Strict Container (e.g., Playlist)
Containers hold other components. Use `allowedChildren` to enforce strict hierarchy (e.g. Playlists can only hold Audio tracks).

```typescript
registerPlugin({
    type: 'playlist',
    label: 'Playlist',
    isContainer: true,
    
    // HIERARCHY ENFORCEMENT
    allowedChildren: ['audio'], // Only allow 'audio' items to be dropped here
    
    // Custom Renderer using ContainerDroppable
    customContainerRenderer: ({ component, builderContext, commonStyles }) => (
        <div style={commonStyles}>
            <h3>{component.props.title}</h3>
            {/* The Drop Zone */}
            <ContainerDroppable
                containerId={component.id}
                containerType={component.type}
                children={component.children || []} // Pass children
                builderContext={builderContext}
            />
        </div>
    )
});
```

### 3. Recursive Container (e.g., Folder)
Containers can allow themselves as children to support infinite nesting.

```typescript
registerPlugin({
    type: 'folder',
    label: 'Folder',
    isContainer: true,
    
    // Allow Files AND other Folders
    allowedChildren: ['file', 'folder'], 
    
    // customContainerRenderer: MyFolderRenderer // (See above pattern)
});
```

### 4. Templates (Pre-filled Trees)
You can register a "Template" that, when dropped, creates a whole tree of components.

```typescript
registerPlugin({
    type: 'template-morning-mix',
    label: 'Morning Mix Template',
    isContainer: true,
    allowedChildren: ['audio'],
    
    // DATA FACTORY
    createChildren: () => [
        { type: 'audio', props: { title: 'Track 1', duration: '3:00' } },
        { type: 'audio', props: { title: 'Track 2', duration: '4:15' } }
    ],
    
    // Render as a normal playlist
    render: ({ props }) => <PlaylistRenderer ... /> 
});
```
