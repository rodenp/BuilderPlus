import { useState, useCallback } from 'react';
import type { CanvasComponent } from '../types/component-types';
import { generateId } from '../types/component-types';
import { getChildCreator, getDefaultProps } from '../components/canvas-components/register';

export interface DragItem {
    id: string;
    index: number;
    parentId: string | null;
    type: string;
    component?: CanvasComponent; // For existing items
    componentDef?: any; // For new items from sidebar
}

export const useBuilderState = (initialComponents: CanvasComponent[] = []) => {
    const [components, setComponents] = useState<CanvasComponent[]>(initialComponents);

    const findContainer = useCallback((id: string, searchNodes: CanvasComponent[] = components): CanvasComponent | null => {
        for (const node of searchNodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findContainer(id, node.children);
                if (found) return found;
            }
        }
        return null;
    }, [components]);

    const findParent = useCallback((id: string, searchNodes: CanvasComponent[] = components, parentId: string | null = null): string | null => {
        for (const node of searchNodes) {
            if (node.id === id) return parentId;
            if (node.children) {
                const found = findParent(id, node.children, node.id);
                if (found !== undefined) return found;
            }
        }
        return undefined as unknown as string | null;
    }, [components]);

    const findAndRemove = useCallback((nodes: CanvasComponent[], id: string): { nodes: CanvasComponent[], removed?: CanvasComponent } => {
        const newNodes: CanvasComponent[] = [];
        let removed: CanvasComponent | undefined;

        for (const node of nodes) {
            if (node.id === id) {
                removed = node;
                continue;
            }
            if (node.children) {
                const { nodes: newChildren, removed: childRemoved } = findAndRemove(node.children, id);
                if (childRemoved) removed = childRemoved;
                newNodes.push({ ...node, children: newChildren });
            } else {
                newNodes.push(node);
            }
        }
        return { nodes: newNodes, removed };
    }, []);

    const insertInto = useCallback((nodes: CanvasComponent[], targetId: string | null, item: CanvasComponent, index: number): { nodes: CanvasComponent[], inserted: boolean } => {
        // If target is root (null)
        if (targetId === null) {
            const newNodes = [...nodes];
            newNodes.splice(index, 0, item);
            return { nodes: newNodes, inserted: true };
        }

        let inserted = false;
        const newNodes = nodes.map(node => {
            if (node.id === targetId) {
                const newChildren = [...(node.children || [])];
                newChildren.splice(index, 0, item);
                inserted = true;
                return { ...node, children: newChildren };
            }
            if (node.children) {
                const result = insertInto(node.children, targetId, item, index);
                if (result.inserted) {
                    inserted = true;
                    return { ...node, children: result.nodes };
                }
            }
            return node;
        });

        return { nodes: newNodes, inserted };
    }, []);

    const moveComponent = useCallback((componentId: string, _sourceContainerId: string | null, targetContainerId: string | null, targetIndex: number) => {
        setComponents(prev => {
            const { nodes: withoutItem, removed } = findAndRemove(prev, componentId);
            if (!removed) return prev; // Item not found

            const { nodes: withItem, inserted } = insertInto(withoutItem, targetContainerId, removed, targetIndex);

            if (!inserted) {
                // Restore if insert failed
                // Note: Simplification, in real app handle error better
                return prev;
            }
            return withItem;
        });
    }, [findAndRemove, insertInto]);

    // ... existing code ...

    // ... existing code ...

    const addComponent = useCallback((componentDef: any, targetContainerId: string | null, index: number) => {
        const componentId = generateId();

        // Get default props from registry
        const defaultProps = getDefaultProps(componentDef.type);

        // Get initial children from definition OR from registered creator
        let initialChildren = componentDef.initialChildren || componentDef.children || [];

        if (initialChildren.length === 0) {
            const childCreator = getChildCreator(componentDef.type);
            if (childCreator) {
                initialChildren = childCreator(componentId);
            }
        }

        // Recursive helper to build component tree from definition
        const buildComponentTree = (def: any, parentId?: string): CanvasComponent => {
            const id = generateId();
            const childDefaultProps = getDefaultProps(def.type);

            const children = (def.initialChildren || def.children || []).map((childDef: any) =>
                buildComponentTree(childDef, id)
            );

            return {
                id,
                type: def.type,
                props: { ...childDefaultProps, ...def.props },
                children,
                parentId
            };
        };

        const newComponent: CanvasComponent = {
            id: componentId,
            type: componentDef.type,
            // MERGE: defaultProps + props from drag item
            props: { ...defaultProps, ...componentDef.props },
            children: initialChildren.map((childDef: any) =>
                buildComponentTree(childDef, componentId)
            ),
            parentId: targetContainerId || undefined
        };

        setComponents(prev => {
            const { nodes, inserted } = insertInto(prev, targetContainerId, newComponent, index);
            return inserted ? nodes : prev;
        });

        return componentId;
    }, [insertInto]);

    const removeComponent = useCallback((componentId: string) => {
        setComponents(prev => {
            const { nodes } = findAndRemove(prev, componentId);
            return nodes;
        });
    }, [findAndRemove]);

    const copyComponent = useCallback((componentId: string) => {
        setComponents(prev => {
            const parentId = findParent(componentId, prev);
            const parent = parentId ? findContainer(parentId, prev) : null;
            const containerNodes = parent ? (parent.children || []) : prev;

            const originalIndex = containerNodes.findIndex(node => node.id === componentId);
            if (originalIndex === -1) return prev;

            const originalComponent = containerNodes[originalIndex];

            // Deep copy with new IDs
            const deepCopy = (node: CanvasComponent): CanvasComponent => ({
                ...node,
                id: generateId(),
                children: node.children?.map(deepCopy),
                props: { ...node.props }
            });

            const newComponent = deepCopy(originalComponent);

            const { nodes, inserted } = insertInto(prev, parentId || null, newComponent, originalIndex + 1);
            return inserted ? nodes : prev;
        });
    }, [findParent, findContainer, insertInto]);

    const updateComponent = useCallback((componentId: string, updates: Partial<CanvasComponent> | ((prev: CanvasComponent) => Partial<CanvasComponent>)) => {
        // console.log('updateComponent called', componentId, updates);
        setComponents(prev => {
            const updateNode = (nodes: CanvasComponent[]): CanvasComponent[] => {
                return nodes.map(node => {
                    if (node.id === componentId) {
                        const newProps = typeof updates === 'function' ? updates(node) : updates;
                        // Handle strict props update if passed, or merge? 
                        // The updates arg usually implies props updates or root level updates? 
                        // Let's assume updates is root level object merger.
                        // But wait, usually we update props. 
                        // Let's support both or just merge properties.

                        // If updates has "props", merge them.
                        if ('props' in newProps) {
                            return { ...node, ...newProps, props: { ...node.props, ...newProps.props } };
                        }
                        return { ...node, ...newProps };
                    }
                    if (node.children) {
                        return { ...node, children: updateNode(node.children) };
                    }
                    return node;
                });
            };
            return updateNode(prev);
        });
    }, []);

    return {
        components,
        setComponents,
        moveComponent,
        addComponent,
        removeComponent,
        copyComponent,
        updateComponent,
        findParent,
        findContainer
    };
};
