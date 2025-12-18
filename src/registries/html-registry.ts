import type { CanvasComponent } from '../types/component-types';

export type HTMLGenerator = (component: CanvasComponent) => Promise<string> | string;

class HTMLRegistry {
    private generators: Map<string, HTMLGenerator>;

    constructor() {
        this.generators = new Map();
    }

    register(type: string, generator: HTMLGenerator) {
        this.generators.set(type, generator);
    }

    getGenerator(type: string): HTMLGenerator | undefined {
        return this.generators.get(type);
    }
}

export const htmlRegistry = new HTMLRegistry();
