import type { CanvasComponent } from '../types/component-types';

/**
 * Calculates the effective properties for a component by merging properties
 * from the global theme, root container, and all intermediate ancestors.
 */
export const getMergedProps = (
    componentId: string,
    components: CanvasComponent[],
    globalDefaults: Record<string, any> = {},
    getDefaultProps?: (type: string) => Record<string, any>,
    skipLast: boolean = false
): Record<string, any> => {
    const findPath = (
        id: string,
        nodes: CanvasComponent[],
        path: CanvasComponent[] = []
    ): CanvasComponent[] | null => {
        for (const node of nodes) {
            if (node.id === id) return [...path, node];
            if (node.children) {
                const found = findPath(id, node.children, [...path, node]);
                if (found) return found;
            }
        }
        return null;
    };

    const path = findPath(componentId, components);
    if (!path) return globalDefaults;

    const finalPath = skipLast ? path.slice(0, -1) : path;

    return finalPath.reduce((acc, node) => {
        const nodeDefaults = getDefaultProps ? getDefaultProps(node.type) : {};
        const nodeManualProps = { ...node.props };

        // Combine defaults and manual props for this node
        const effectiveNodeProps = { ...nodeDefaults, ...nodeManualProps };

        // If a property is explicitly set to null, it means "Skip this node and inherit from parent"
        // We remove it from effectiveNodeProps so the previous level's value (acc) persists.
        Object.keys(effectiveNodeProps).forEach(key => {
            if (effectiveNodeProps[key] === null || effectiveNodeProps[key] === undefined) {
                delete effectiveNodeProps[key];
            }
        });

        return { ...acc, ...effectiveNodeProps };
    }, { ...globalDefaults });
};
