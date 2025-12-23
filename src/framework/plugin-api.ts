import { registerComponent } from '../components/canvas-components/register';
import { customContainerRegistry } from '../config/custom-containers';
import type { ComponentConfig } from '../components/canvas-components/register';
import type { CanvasComponentProps } from '../components/canvas-components/types';

import { htmlRegistry, type HTMLGenerator } from '../registries/html-registry';

/**
 * Extended configuration for plugins.
 * Adds 'allowedChildren' to the standard component config.
 */
export interface PluginComponentConfig extends ComponentConfig {
    /**
     * For containers: define what children are allowed.
     * Can be 'ALL', 'NONE', or an array of component types.
     */
    allowedChildren?: string[] | 'ALL' | 'NONE';

    /**
     * If this is a specialized container that needs direct BuilderContext access,
     * provide the raw renderer here. 
     * Note: This bypasses the standard 'render' prop logic if isContainer is true.
     */
    customContainerRenderer?: React.FC<CanvasComponentProps>;

    /**
     * Custom HTML generator for export functionality.
     */
    getHTML?: HTMLGenerator;
}

/**
 * Register a new component via the Plugin API.
 * Handles:
 * 1. UI Registration (Components Panel)
 * 2. Validation Rules (Drop zones)
 * 3. Custom Container Logic (if needed)
 * 4. HTML Generation (Export)
 */
export function registerPlugin(config: PluginComponentConfig) {
    // 1. Register Custom Container Logic (if provided)
    if (config.isContainer && config.customContainerRenderer) {
        customContainerRegistry.register(config.type, config.customContainerRenderer);
    }

    // 2. Register HTML Generator (if provided)
    if (config.getHTML) {
        htmlRegistry.register(config.type, config.getHTML);
    }

    // 3. Register Standard Component (UI & Basic Rendering)
    // This now handles validation rule registration automatically
    registerComponent(config);
}
