import type { CanvasComponentProps } from '../components/canvas-components/types';

/**
 * Dynamic registry for custom container renderers.
 * This allows plugins to register new containers that need direct builderContext access.
 */
class CustomContainerRegistry {
    private containerTypes: Set<string>;
    private renderers: Map<string, React.FC<CanvasComponentProps>>;

    constructor() {
        // Default system containers
        this.containerTypes = new Set([
            'container',
            'section',
            'card',
            'columns',
            'form'
        ]);

        // Default custom renderers
        this.renderers = new Map();
    }

    register(type: string, renderer?: React.FC<CanvasComponentProps>) {
        this.containerTypes.add(type);
        if (renderer) {
            this.renderers.set(type, renderer);
        }
    }

    isContainer(type: string): boolean {
        return this.containerTypes.has(type);
    }

    getRenderer(type: string): React.FC<CanvasComponentProps> | undefined {
        return this.renderers.get(type);
    }
}

export const customContainerRegistry = new CustomContainerRegistry();
