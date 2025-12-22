import type { CanvasComponent } from '../types/component-types';
import type { Theme } from '../types/theme';

export type HTMLGenerator = (
    component: CanvasComponent,
    theme: Theme,
    renderChildren: (children: CanvasComponent[]) => Promise<string[]>,
    isExport?: boolean
) => Promise<string> | string;

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
