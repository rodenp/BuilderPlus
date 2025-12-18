import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { CanvasComponent } from '../../types/component-types';
import type { Theme } from '../panels/property-panel/theme';
import { DragTypes } from '../../types/dnd-types';
import { getRenderer } from '../../components/canvas-components/register';
import { extractCommonStyles } from '../../components/canvas-components/types';
// DropIndicator removed

import type { CanvasTheme } from '../../components/canvas-components/types';
import { ContainerDroppable } from './ContainerDroppable';
import { customContainerRegistry } from '../../config/custom-containers';

interface CanvasComponentRendererProps {
    component: CanvasComponent;
    index: number;
    parentId: string | null;
    builderContext: any;
    theme: Theme;
    canvasTheme: CanvasTheme;
    parentFlexDirection?: string; // Added prop
}

export const CanvasComponentRenderer: React.FC<CanvasComponentRendererProps> = ({
    component,
    index,
    parentId,
    builderContext,
    theme,
    canvasTheme,
    parentFlexDirection = 'column', // Default to column
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { selectComponent, selectedId } = builderContext;

    const isSelected = selectedId === component.id;

    // DRAG logic
    const [{ isDragging }, drag] = useDrag({
        type: DragTypes.ITEM,
        item: {
            id: component.id,
            index,
            parentId,
            type: component.type,
            entity: component
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // DROP logic - Reordering & Insertion
    const [{ handlerId }, drop] = useDrop({
        accept: [DragTypes.ITEM, DragTypes.NEW_COMPONENT],
        collect: (monitor) => ({
            handlerId: monitor.getHandlerId(),
        }),
        hover(item: any, monitor) {
            if (!ref.current) return;
            if (!monitor.isOver({ shallow: true })) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Get horizontal middle
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
            const hoverClientX = (clientOffset as any).x - hoverBoundingRect.left;

            // Check direction
            const isHorizontal = parentFlexDirection.includes('row');

            // Dragging calculations
            if (isHorizontal) {
                // Dragging right
                if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
                // Dragging left
                if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;
            } else {
                // Dragging downwards
                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
                // Dragging upwards
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
            }

            // HANDLE Sidebar Item -> Live Canvas Item
            if (item.type === DragTypes.NEW_COMPONENT) {
                // ADD IMMEDIATELY to canvas at current position
                // This converts the drag item to a "live" item in the state
                const newId = builderContext.addComponent(item.componentDef, parentId, hoverIndex);

                // MUTATE the drag item to become a tracked ITEM
                item.type = DragTypes.ITEM;
                item.id = newId;
                item.index = hoverIndex;
                item.parentId = parentId;

                return;
            }

            // KANBAN LIVE REORDERING
            // Existing Components: Immediate state update for live feedback
            const isDragItem = monitor.getItemType() === DragTypes.ITEM || item.type === DragTypes.ITEM;

            if (isDragItem && item.id !== component.id) {
                // Optimization: Avoid flickering by checking if we're essentially in the same spot
                if (item.parentId === parentId && dragIndex === hoverIndex) return;

                // Perform move
                builderContext.moveComponent(item.id, item.parentId, parentId, hoverIndex);

                // Update the dragged item's index/parent so we don't keep firing
                item.index = hoverIndex;
                item.parentId = parentId;
            }
        },
        drop() {
            // Drop handled by local state updates in hover
            // We just need to clear any temporary state if we had it, but we modified the tree directly.
        }
    });

    drag(drop(ref));

    // CONTAINER CHECK
    const isContainer = customContainerRegistry.isContainer(component.type);

    // Style helpers
    // const Icon = getComponentIcon(component.type); // Moved to SelectionOverlay

    // Get actual renderer
    const Renderer = getRenderer(component.type);

    // Function to render children
    const renderChild = (child: any) => (
        <CanvasComponentRenderer
            key={child.id}
            component={child}
            index={component.children?.findIndex(c => c.id === child.id) ?? 0}
            parentId={component.id}
            builderContext={builderContext}
            theme={theme}
            canvasTheme={canvasTheme}
            parentFlexDirection={(component.props as any).flexDirection} // Pass current container's direction to children
        />
    );

    const renderComponent = () => {
        // Atomic components - use registered Renderer
        if (!isContainer) {
            if (Renderer) {
                return (
                    <Renderer
                        component={component}
                        canvasTheme={canvasTheme}
                        commonStyles={extractCommonStyles(component.props)}
                        uiTheme={theme}
                        isPreviewMode={false}
                        renderChild={renderChild}
                    />
                );
            }
            return <div>Unknown Component: {component.type}</div>;
        }

        // Container components - use ContainerDroppable
        const commonStyles = extractCommonStyles(component.props);

        // CHECK CUSTOM RENDERERS FIRST (from dynamic registry)
        const CustomRenderer = customContainerRegistry.getRenderer(component.type);
        if (CustomRenderer) {
            return (
                <CustomRenderer
                    component={component}
                    canvasTheme={canvasTheme}
                    commonStyles={commonStyles}
                    uiTheme={theme}
                    isPreviewMode={false}
                    renderChild={renderChild}
                    builderContext={builderContext} // Pass context directly!
                />
            );
        }

        switch (component.type) {

            // Specialized containers if needed, or default
            case 'columns':
                return (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${(component.props.columns as number) || 2}, 1fr)`,
                            gap: (component.props.gap as string) || '16px',
                            ...commonStyles
                        }}
                    >
                        <ContainerDroppable
                            containerId={component.id}
                            containerType={component.type}
                            children={component.children || []}
                            builderContext={builderContext}
                            theme={theme}
                            canvasTheme={canvasTheme}
                            style={{
                                ...commonStyles,
                                minHeight: (commonStyles as any).minHeight || '50px'
                            }}
                            emptyContent={null}
                        />
                    </div>
                );

            default:
                return (
                    <ContainerDroppable
                        containerId={component.id}
                        containerType={component.type}
                        children={component.children || []}
                        builderContext={builderContext}
                        theme={theme}
                        canvasTheme={canvasTheme}
                        style={{
                            ...commonStyles,
                            minHeight: (commonStyles as any).minHeight || '50px',
                            border: (commonStyles as any).borderWidth ? undefined : `1px dashed ${canvasTheme.text}20`
                        }}
                        emptyContent={
                            <span style={{ color: canvasTheme.text, opacity: 0.5, fontSize: '12px' }}>
                                {component.type}
                            </span>
                        }
                    />
                );
        }
    };


    const style: React.CSSProperties = {
        opacity: isDragging ? 0.3 : 1, // Standard Kanban drag visual
        cursor: 'move',
        position: 'relative',
        outline: isSelected ? `2px solid ${theme.primary}` : (isHovered ? `1px solid ${theme.primary}` : undefined),
        outlineOffset: '2px',
    };

    return (
        <div
            ref={ref}
            style={style}
            onClick={(e) => {
                e.stopPropagation();
                selectComponent(component.id);
            }}
            onMouseEnter={(e) => {
                e.stopPropagation();
                setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
            data-handler-id={handlerId}
            id={`component-${component.id}`}
            className={`canvas-component-wrapper group ${isDragging ? 'is-dragging' : ''}`}
        >

            {renderComponent()}
        </div>
    );
};
