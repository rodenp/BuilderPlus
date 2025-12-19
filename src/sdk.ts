// ============================================================================
// BUILDER+ PUBLIC SDK
// This file exports everything an external app needs to extend the builder.
// ============================================================================

// 1. The Main Registration API
// Use this to register components, validation rules, and export logic in one go.
export { registerPlugin } from './framework/plugin-api';
export type { PluginComponentConfig } from './framework/plugin-api';

// 2. Core Components
// Use these when building custom renderers.
export { ContainerDroppable } from './components/layout/ContainerDroppable';

// 3. Types
// TypeScript interfaces for props, themes, and components.
export type {
    CanvasComponentProps,
    CommonStyles
} from './components/canvas-components/types';

export type {
    CanvasComponent
} from './types/component-types';

export type {
    PropertyField,
    PropertyGroup
} from './components/canvas-components/properties';

// 4. Utilities
// Helpers for styling and HTML generation.
export { extractCommonStyles } from './components/canvas-components/types';
export { getComponentHTML, registerComponent } from './components/canvas-components/register';
export { globalStyleRegistry, registerStyleFields } from './config/style-properties';
export { globalThemeRegistry, registerTheme } from './core/theme-registry';
