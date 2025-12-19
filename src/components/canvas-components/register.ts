import React from 'react';
import type { CanvasComponentProps, CommonStyles } from './types';
import type { PropertyField, PropertyGroup, ComponentProperties } from './properties';
import { createComponentProperties } from './properties';
import type { ComponentCategory } from '../../types/component-types';

// ============================================================================
// PUBLIC API - Types for consuming applications
// ============================================================================

import type { StylePropertyDefinition } from '../../config/style-properties';
import { globalStyleRegistry } from '../../config/style-properties';

/**
 * Configuration for registering a new component
 */
export interface ComponentConfig {
  /** Unique identifier for the component (e.g., 'badge', 'rating') */
  type: string;
  /** Display name shown in the components panel */
  label: string;
  /** Category for grouping in the panel */
  category: ComponentCategory;
  /** Lucide icon name (e.g., 'Star', 'Tag', 'Heart') */
  icon: string;
  /** Short description shown in the panel */
  description: string;
  /** The React component that renders on the canvas */
  render: React.FC<ComponentRenderProps>;
  /** Component-specific property fields (content fields) */
  properties?: PropertyField[];
  /** Additional property groups */
  propertyGroups?: PropertyGroup[];
  /** Whether to include layout properties (display, flex, etc.) */
  isContainer?: boolean;
  /** Default property values */
  defaultProps: Record<string, unknown>;
  /** stylistic property metadata for this component */
  styleProperties?: StylePropertyDefinition[];
  /** Optional: Create default children when component is added */
  createChildren?: (parentId: string) => ChildComponentConfig[];
}

/**
 * Simplified props passed to the render function
 * Consuming apps don't need to know about internal types
 */
export interface ComponentRenderProps {
  /** The component's property values */
  props: Record<string, unknown>;
  /** Theme colors for the canvas */
  theme: {
    background: string;
    text: string;
    link: string;
  };
  /** Pre-calculated common styles (margins, padding, colors, etc.) */
  styles: CommonStyles;
  /** Whether the canvas is in preview mode */
  isPreviewMode: boolean;
  /** For container components: render a child component */
  renderChild?: (child: { id: string; type: string; props: Record<string, unknown> }) => React.ReactNode;
  /** The component's children (for container components) */
  children?: Array<{ id: string; type: string; props: Record<string, unknown> }>;
}

/**
 * Configuration for creating child components
 */
export interface ChildComponentConfig {
  type: string;
  props?: Record<string, unknown>;
}

// ============================================================================
// INTERNAL - Registry storage
// ============================================================================

interface RegisteredComponent {
  config: ComponentConfig;
  Renderer: React.FC<CanvasComponentProps>;
  properties: ComponentProperties;
}

// Storage for all registered components (built-in + custom)
const registry = new Map<string, RegisteredComponent>();

// Storage for component definitions (for the components panel)
const definitions: Array<{
  type: string;
  label: string;
  category: ComponentCategory;
  icon: string;
  description: string;
}> = [];

// Storage for default props
const defaultPropsMap = new Map<string, Record<string, unknown>>();

// Storage for child creators
const childCreators = new Map<string, (parentId: string) => ChildComponentConfig[]>();

// ============================================================================
// PUBLIC API - Registration function
// ============================================================================

/**
 * Register a new component with the page builder
 *
 * @example
 * ```tsx
 * import { registerComponent } from '@your-org/page-builder';
 *
 * registerComponent({
 *   type: 'badge',
 *   label: 'Badge',
 *   category: 'basic',
 *   icon: 'Tag',
 *   description: 'Status badge or label',
 *   properties: [
 *     { key: 'text', label: 'Text', type: 'text', group: 'content' },
 *     { key: 'variant', label: 'Variant', type: 'select', group: 'content', options: [
 *       { label: 'Default', value: 'default' },
 *       { label: 'Success', value: 'success' },
 *     ]},
 *   ],
 *   defaultProps: {
 *     text: 'Badge',
 *     variant: 'default',
 *     backgroundColor: '#3b82f6',
 *     color: '#ffffff',
 *   },
 *   render: ({ props, styles }) => (
 *     <span style={{
 *       padding: '4px 8px',
 *       borderRadius: styles.borderRadius || '9999px',
 *       backgroundColor: styles.backgroundColor || '#3b82f6',
 *       color: styles.color || '#fff',
 *     }}>
 *       {props.text}
 *     </span>
 *   ),
 * });
 * ```
 */
export function registerComponent(config: ComponentConfig): void {
  const {
    type,
    label,
    category,
    icon,
    description,
    render,
    properties = [],
    propertyGroups = [],
    isContainer = false,
    defaultProps,
    styleProperties = [],
    createChildren,
  } = config;

  // Create the internal renderer that wraps the user's render function
  const Renderer: React.FC<CanvasComponentProps> = ({
    component,
    canvasTheme,
    commonStyles,
    isPreviewMode,
    renderChild,
  }) => {
    // Transform internal types to the simplified public API
    const renderProps: ComponentRenderProps = {
      props: component.props,
      theme: {
        background: canvasTheme.bg,
        text: canvasTheme.text,
        link: canvasTheme.link,
      },
      styles: commonStyles,
      isPreviewMode: isPreviewMode || false,
      children: component.children?.map(c => ({
        id: c.id,
        type: c.type,
        props: c.props,
      })),
      renderChild: renderChild ? (child: any) => {
        // Find the full child component data
        const fullChild = component.children?.find(c => c.id === child.id);
        if (fullChild && renderChild) {
          return renderChild(fullChild);
        }
        return null;
      } : undefined,
    };

    return render(renderProps);
  };

  // Build the component properties with inherited base fields
  const componentProperties = createComponentProperties(
    properties.map(field => ({
      ...field,
      defaultValue: field.defaultValue ?? defaultProps[field.key]
    })),
    propertyGroups,
    [],
    isContainer
  );

  // Store in registry
  registry.set(type, {
    config,
    Renderer,
    properties: componentProperties,
  });

  // Register style metadata with the global registry
  if (styleProperties.length > 0) {
    globalStyleRegistry.registerStyleFields(styleProperties);
  }

  // Store definition for components panel
  definitions.push({ type, label, category, icon, description });

  // Store default props
  const fullDefaultProps = {
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    padding: { top: '0', right: '0', bottom: '0', left: '0' },
    ...defaultProps,
  };
  defaultPropsMap.set(type, fullDefaultProps);

  // Store child creator if provided
  if (createChildren) {
    childCreators.set(type, createChildren);
  }
}

// ============================================================================
// INTERNAL API - Used by the page builder internals
// ============================================================================

/**
 * Get the renderer for a component type
 * @internal
 */
export function getRenderer(type: string): React.FC<CanvasComponentProps> | null {
  return registry.get(type)?.Renderer || null;
}

/**
 * Get the properties configuration for a component type
 * @internal
 */
export function getComponentProperties(type: string): ComponentProperties | null {
  return registry.get(type)?.properties || null;
}

/**
 * Get all registered component definitions (for the components panel)
 * @internal
 */
export function getComponentDefinitions() {
  return [...definitions];
}

/**
 * Get default props for a component type
 * @internal
 */
export function getDefaultProps(type: string): Record<string, unknown> {
  return defaultPropsMap.get(type) || {};
}

/**
 * Check if a component type is registered
 * @internal
 */
export function isRegistered(type: string): boolean {
  return registry.has(type);
}

/**
 * Get all registered component types
 * @internal
 */
export function getRegisteredTypes(): string[] {
  return Array.from(registry.keys());
}

/**
 * Get child creator for a component type
 * @internal
 */
export function getChildCreator(type: string): ((parentId: string) => ChildComponentConfig[]) | null {
  return childCreators.get(type) || null;
}

/**
 * Clear all registrations (useful for testing)
 * @internal
 */
export function clearRegistry(): void {
  registry.clear();
  definitions.length = 0;
  defaultPropsMap.clear();
  childCreators.clear();
}

/**
 * Get the HTML string for a component
 * @internal
 */
import { htmlRegistry } from '../../registries/html-registry';

/**
 * Get the HTML string for a component
 * @internal
 */
export async function getComponentHTML(component: import('../../types/component-types').CanvasComponent, _isExport: boolean = false): Promise<string> {
  const generator = htmlRegistry.getGenerator(component.type);
  if (generator) {
    return generator(component);
  }

  // Fallback for components without registered HTML generators
  // In a real app, this might try to render the Reac component to static markup
  return `<!-- ${component.type} component (id: ${component.id}) -->`;
}
