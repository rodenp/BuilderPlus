import { useState, useCallback } from 'react';
import type { CanvasComponent } from '../types/component-types';
import { generateId } from '../types/component-types';
import { getChildCreator } from '../components/canvas-components/register';

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

    // History State
    const [past, setPast] = useState<CanvasComponent[][]>([]); // Stack of past component trees
    const [future, setFuture] = useState<CanvasComponent[][]>([]); // Stack of future component trees

    // Helper to record history before a state change
    const recordHistory = useCallback(() => {
        setPast(prev => {
            const newPast = [...prev, components];
            // Optional: Limit history size
            if (newPast.length > 50) return newPast.slice(newPast.length - 50);
            return newPast;
        });
        setFuture([]); // Clear future on new action
    }, [components]);

    const undo = useCallback(() => {
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        setPast(newPast);
        setFuture(prev => [components, ...prev]);
        setComponents(previous);
    }, [past, components]);

    const redo = useCallback(() => {
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        setFuture(newFuture);
        setPast(prev => [...prev, components]);
        setComponents(next);
    }, [future, components]);

    const canUndo = past.length > 0;
    const canRedo = future.length > 0;

    // Wrap setComponents to record history automatically?
    // Doing strict "Action" based history is cleaner but requires refactoring all setters.
    // For now, I will modify the exported actions to call recordHistory() BEFORE setComponents.
    // But setComponents is async. So we record CURRENT 'components' state before calling setComponents.

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
        recordHistory(); // Record BEFORE change
        setComponents(prev => {
            const { nodes: withoutItem, removed } = findAndRemove(prev, componentId);
            if (!removed) return prev; // Item not found

            const { nodes: withItem, inserted } = insertInto(withoutItem, targetContainerId, removed, targetIndex);

            if (!inserted) {
                return prev;
            }
            return withItem;
        });
    }, [findAndRemove, insertInto, recordHistory]);

    // ... existing wrapper functions must call recordHistory ...

    const addComponent = useCallback((componentDef: any, targetContainerId: string | null, index: number) => {
        recordHistory();
        const componentId = generateId();
        // ... (rest of logic same as before, essentially) ...
        // Re-implementing to ensure recordHistory call is captured correctly in scope

        // ... logic duplication or we can reuse existing logic if we careful ...
        // I will paste the body logic again to be safe.

        let initialChildren = componentDef.initialChildren || componentDef.children || [];

        if (initialChildren.length === 0) {
            const childCreator = getChildCreator(componentDef.type);
            if (childCreator) {
                initialChildren = childCreator(componentId);
            }
        }

        const buildComponentTree = (def: any, parentId?: string): CanvasComponent => {
            const id = generateId();
            const children = (def.initialChildren || def.children || []).map((childDef: any) =>
                buildComponentTree(childDef, id)
            );
            return {
                id,
                type: def.type,
                props: def.props || {},
                children,
                parentId
            };
        };

        const newComponent: CanvasComponent = {
            id: componentId,
            type: componentDef.type,
            props: componentDef.props || {},
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
    }, [insertInto, recordHistory]);

    const removeComponent = useCallback((componentId: string) => {
        recordHistory();
        setComponents(prev => {
            const { nodes } = findAndRemove(prev, componentId);
            return nodes;
        });
    }, [findAndRemove, recordHistory]);

    const copyComponent = useCallback((componentId: string) => {
        recordHistory();
        let newId: string | null = null;

        setComponents(prev => {
            const parentId = findParent(componentId, prev);
            const parent = parentId ? findContainer(parentId, prev) : null;
            const containerNodes = parent ? (parent.children || []) : prev;

            const originalIndex = containerNodes.findIndex(node => node.id === componentId);
            if (originalIndex === -1) return prev;

            const originalComponent = containerNodes[originalIndex];

            const deepCopy = (node: CanvasComponent, pId?: string): CanvasComponent => {
                const id = generateId();
                if (!newId && node.id === originalComponent.id) newId = id; // Track the top-level new ID

                return {
                    ...node,
                    id,
                    parentId: pId,
                    children: node.children?.map(child => deepCopy(child, id)),
                    props: { ...node.props }
                };
            };

            const newComponent = deepCopy(originalComponent, parentId || undefined);

            const { nodes, inserted } = insertInto(prev, parentId || null, newComponent, originalIndex + 1);
            return inserted ? nodes : prev;
        });

        return newId;
    }, [findParent, findContainer, insertInto, recordHistory]);

    const updateComponent = useCallback((componentId: string, updates: Partial<CanvasComponent> | ((prev: CanvasComponent) => Partial<CanvasComponent>)) => {
        recordHistory();
        setComponents(prev => {
            const updateNode = (nodes: CanvasComponent[]): CanvasComponent[] => {
                return nodes.map(node => {
                    if (node.id === componentId) {
                        const newProps = typeof updates === 'function' ? updates(node) : updates;
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
    }, [recordHistory]);

    return {
        components,
        setComponents,
        moveComponent,
        addComponent,
        removeComponent,
        copyComponent,
        updateComponent,
        findParent,
        findContainer,
        undo,
        redo,
        canUndo,
        canRedo
    };
};
