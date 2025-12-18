// Core component type definitions - used throughout the app

// Component category definitions
export type ComponentCategory =
  | 'basic'
  | 'typography'
  | 'media'
  | 'layout'
  | 'forms'
  | 'navigation'
  | 'mockup'
  | 'testing-mockup'
  | 'hidden-from-sidebar';

// Component type definitions
export type ComponentType =
  // Basic
  | 'button'
  | 'divider'
  | 'spacer'
  // Typography
  | 'heading'
  | 'paragraph'
  | 'text'
  | 'list'
  | 'quote'
  // Media
  | 'image'
  | 'video'
  | 'icon'
  // Layout
  | 'container'
  | 'columns'
  | 'card'
  | 'section'
  // Forms
  | 'input'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'form'
  // Navigation
  | 'link'
  | 'menu'
  | 'breadcrumb'
  | 'mockup-container'
  | 'mockup-item' // For legacy mockup items
  | string; // Allow dynamic types from plugins

// Component definition for the palette
export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  category: ComponentCategory;
  icon: string; // Lucide icon name
  description: string;
  initialChildren?: any[]; // For mockup presets
}

// Canvas component instance
export interface CanvasComponent {
  id: string;
  type: ComponentType;
  props: Record<string, unknown>;
  children?: CanvasComponent[];
  parentId?: string;
}

// Category metadata
export interface CategoryDefinition {
  id: ComponentCategory;
  label: string;
  description: string;
}

// Generate unique ID
export const generateId = (): string => {
  return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};